import { Router } from 'express'
import {
  getProjectBySlug,
  getSettings,
  listProjects,
  mediaMap,
  publicProject,
} from '../store.js'
import { asyncRoute, notFound } from '../http.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() })
})

router.get(
  '/projects',
  asyncRoute(async (req, res) => {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 60)
    const category =
      typeof req.query.category === 'string' ? req.query.category.trim().toLowerCase() : ''

    const [projects, media] = await Promise.all([
      listProjects({ publishedOnly: true, category, limit }),
      mediaMap(),
    ])
    const items = projects.map((project) => publicProject(project, media))
    res.json({ items, total: items.length })
  }),
)

router.get(
  '/projects/:slug',
  asyncRoute(async (req, res, next) => {
    const project = await getProjectBySlug(req.params.slug, true)
    if (!project) return next(notFound('Proyek tidak ditemukan.'))
    res.json({ project: publicProject(project, await mediaMap()) })
  }),
)

router.get(
  '/settings',
  asyncRoute(async (req, res) => {
    res.json({ settings: await getSettings() })
  }),
)

export default router
