import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import compression from 'compression'
import { config, PROJECT_ROOT } from './config.js'
import { initAdminAuth } from './admin-auth.js'
import { getMediaFile, initStore } from './store.js'
import { HttpError, asyncRoute, notFound } from './http.js'
import { createRateLimiter, originGuard, securityHeaders } from './security.js'
import { normalizeUploadError } from './upload.js'
import publicRoutes from './routes/public.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'

const app = express()
app.disable('x-powered-by')
if (config.trustProxy) app.set('trust proxy', 1)

/* LiteSpeed mem-require startup file, jadi modul ESM ini tidak boleh punya
   top-level await. Inisialisasi DB dijalankan sebagai promise dan request
   ditunda sampai selesai. */
const ready = initStore()
  .then(() => initAdminAuth())
  .catch((error) => {
    console.error('[server] Inisialisasi gagal:', error)
    throw error
  })
ready.catch(() => {})

app.use((req, res, next) => {
  ready.then(() => next(), next)
})

const parseJson = express.json({ limit: '1mb', strict: true })

app.use(securityHeaders)
app.use(compression({ threshold: 1024 }))
// Multipart ditangani multer di route upload; jangan pernah dikirim ke body-parser JSON.
app.use((req, res, next) => {
  if (req.is('multipart/form-data')) return next()
  parseJson(req, res, next)
})
app.use(originGuard)
app.use(createRateLimiter({ prefix: 'api', windowMs: 15 * 60 * 1000, max: 400 }))

app.use('/api', publicRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', (req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan.' }))

// File media kini disimpan sebagai blob di MySQL, bukan lagi di folder uploads/.
app.get(
  '/media/:filename',
  asyncRoute(async (req, res, next) => {
    const filename = String(req.params.filename)
    if (!/^[A-Za-z0-9._-]+$/.test(filename)) return next(notFound('Media tidak ditemukan.'))
    const file = await getMediaFile(filename)
    if (!file || !file.data?.length) return next(notFound('Media tidak ditemukan.'))

    res.setHeader('Content-Type', file.type)
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox")
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(file.data)
  }),
)
app.use('/media', (req, res, next) => next(notFound('Media tidak ditemukan.')))

const distDir = path.join(PROJECT_ROOT, 'dist')
const configuredDir = config.staticDir ? path.resolve(PROJECT_ROOT, config.staticDir) : null
const distIndex = path.join(distDir, 'index.html')

/* Pilih folder yang benar-benar punya index.html. Folder dist/ kosong tidak boleh
   mengalahkan index.html yang sudah dibongkar ke public_html/. */
const staticDir =
  configuredDir && fs.existsSync(path.join(configuredDir, 'index.html'))
    ? configuredDir
    : fs.existsSync(distIndex)
      ? distDir
      : PROJECT_ROOT
const indexFile = path.join(staticDir, 'index.html')

if (fs.existsSync(indexFile)) {
  /* Saat isi dist/ dibongkar langsung ke public_html/, static root = induk server/.
     Tutup akses ke source, env, dan dump database. */
  if (staticDir === PROJECT_ROOT) {
    const blockedDirs = new Set(['server', 'node_modules', 'nodevenv', '.git', 'src', 'scripts', 'docs', 'e2e'])
    app.use((req, res, next) => {
      let relative
      try {
        relative = decodeURIComponent(req.path).replace(/^\/+/, '')
      } catch {
        return res.status(400).end()
      }
      if (!relative) return next()
      const first = relative.split('/')[0].toLowerCase()
      if (
        blockedDirs.has(first) ||
        relative.startsWith('.env') ||
        /\.(sql|log|env)$/i.test(relative) ||
        ['package.json', 'package-lock.json'].includes(relative.toLowerCase())
      ) {
        return res.status(404).end()
      }
      next()
    })
  }

  app.use(express.static(staticDir, { index: false, maxAge: '1h' }))
  app.get('*', (req, res) => res.sendFile(indexFile))
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Server API Restu Production berjalan. Jalankan Vite untuk tampilan frontend.',
      endpoints: ['/api/health', '/api/projects', '/api/settings'],
    })
  })
}

app.use((error, req, res, next) => {
  const normalized = normalizeUploadError(error) || error
  const status = normalized instanceof HttpError ? normalized.status : 500
  if (status >= 500) console.error('[server]', error)
  if (res.headersSent) return next(error)
  res.status(status).json({
    error: status >= 500 ? 'Terjadi kesalahan pada server.' : normalized.message || 'Permintaan gagal.',
  })
})

export default app
