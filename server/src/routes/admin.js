import { Router } from 'express'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { config } from '../config.js'
import {
  deleteMedia as removeMedia,
  deleteProject,
  findMedia,
  getProjectById,
  getSettings,
  insertMedia,
  insertProject,
  listMedia,
  listProjects,
  mediaMap,
  mediaUrl,
  newId,
  publicMedia,
  publicProject,
  saveSettings,
  updateProject,
} from '../store.js'
import { requireAuth } from '../auth.js'
import { asyncRoute, badRequest, notFound } from '../http.js'
import { validateProject, validateSettings } from '../validation.js'
import { processUpload } from '../image.js'
import { uploadMediaFiles } from '../upload.js'

const router = Router()
router.use(requireAuth)

router.get(
  '/projects',
  asyncRoute(async (req, res) => {
    const [projects, media] = await Promise.all([listProjects(), mediaMap()])
    const items = projects
      .slice()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((project) => publicProject(project, media))
    res.json({ items })
  }),
)

router.post(
  '/projects',
  asyncRoute(async (req, res) => {
    const allowed = new Set((await listMedia()).map((item) => item.id))
    const project = validateProject(req.body, allowed)
    project.id = newId()
    await insertProject(project)
    res.status(201).json({ project: publicProject(project, await mediaMap()) })
  }),
)

router.put(
  '/projects/:id',
  asyncRoute(async (req, res, next) => {
    const existing = await getProjectById(req.params.id)
    if (!existing) return next(notFound('Proyek tidak ditemukan.'))
    const allowed = new Set((await listMedia()).map((item) => item.id))
    const updated = validateProject(req.body, allowed, existing)
    await updateProject(req.params.id, updated)
    res.json({ project: publicProject(updated, await mediaMap()) })
  }),
)

router.delete(
  '/projects/:id',
  asyncRoute(async (req, res, next) => {
    const existing = await getProjectById(req.params.id)
    if (!existing) return next(notFound('Proyek tidak ditemukan.'))
    await deleteProject(req.params.id)
    res.json({ ok: true })
  }),
)

router.get(
  '/media',
  asyncRoute(async (req, res) => {
    const items = (await listMedia()).map(publicMedia)
    res.json({ items })
  }),
)

router.post(
  '/media',
  uploadMediaFiles,
  asyncRoute(async (req, res, next) => {
    const files = req.files || []
    if (!files.length) return next(badRequest('Tidak ada file yang diterima.'))

    const processed = []
    const errors = []

    for (const file of files) {
      const limit = file.mimetype.startsWith('image/')
        ? config.maxImageBytes
        : file.mimetype.startsWith('video/')
          ? config.maxVideoBytes
          : config.maxPdfBytes
      if (file.buffer.length > limit) {
        errors.push(`${file.originalname}: ukuran melebihi batas.`)
        continue
      }
      try {
        const result = await processUpload(file.buffer, file.mimetype)
        processed.push({ file, result })
      } catch (error) {
        errors.push(`${file.originalname}: ${error.message}`)
      }
    }

    if (!processed.length) {
      return next(badRequest(errors.join(' ') || 'Semua file gagal diproses.'))
    }

    const entries = processed.map(({ file, result }) => {
      const filename = `${randomUUID()}.${result.extension}`
      const thumbFilename = result.thumbBuffer ? `thumb-${randomUUID()}.webp` : null
      return {
        id: newId(),
        name: path.basename(file.originalname).replace(/[^a-zA-Z0-9._\- ()]/g, '_').slice(0, 120),
        url: mediaUrl(filename),
        thumbUrl: thumbFilename ? mediaUrl(thumbFilename) : null,
        type: result.type,
        size: result.buffer.length,
        width: result.width,
        height: result.height,
        filename,
        thumbFilename,
        data: result.buffer,
        thumbData: result.thumbBuffer,
        createdAt: new Date().toISOString(),
      }
    })

    await insertMedia(entries)
    res.status(201).json({ items: entries.map(publicMedia), errors })
  }),
)

router.delete(
  '/media/:id',
  asyncRoute(async (req, res, next) => {
    const item = await findMedia(req.params.id)
    if (!item) return next(notFound('Media tidak ditemukan.'))
    await removeMedia(req.params.id)
    res.json({ ok: true })
  }),
)

router.get(
  '/settings',
  asyncRoute(async (req, res) => {
    res.json({ settings: await getSettings() })
  }),
)

router.put(
  '/settings',
  asyncRoute(async (req, res) => {
    const settings = validateSettings(req.body)
    await saveSettings(settings)
    res.json({ settings })
  }),
)

export default router
