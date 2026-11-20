import { Router } from 'express'
import { createSession, destroySession, requireAuth, verifyPassword } from '../auth.js'
import { findAdminByUsername } from '../admin-auth.js'
import { asyncRoute, badRequest, unauthorized } from '../http.js'
import { createRateLimiter } from '../security.js'

const router = Router()

const loginLimiter = createRateLimiter({
  prefix: 'login',
  windowMs: 15 * 60 * 1000,
  max: 10,
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

router.post(
  '/login',
  loginLimiter,
  asyncRoute(async (req, res, next) => {
    const username = String(req.body?.username || '')
      .trim()
      .toLowerCase()
    const password = String(req.body?.password || '')
    if (!username || !password || password.length > 200) {
      return next(badRequest('Username dan kata sandi wajib diisi.'))
    }

    const admin = await findAdminByUsername(username)
    // Verifikasi tetap dijalankan dengan hash dummy agar respons tidak membocorkan
    // apakah username terdaftar atau tidak (timing attack).
    const passwordMatches = verifyPassword(password, admin?.password_hash || '')
    if (!admin || !passwordMatches) {
      await delay(400)
      return next(unauthorized('Username atau kata sandi salah.'))
    }

    const csrfToken = createSession(res, { username: admin.username, adminId: admin.id })
    res.json({ ok: true, csrfToken, username: admin.username })
  }),
)

router.get('/me', requireAuth, (req, res) => {
  res.json({
    authenticated: true,
    csrfToken: req.session.csrfToken,
    username: req.session.username || '',
  })
})

router.post('/logout', requireAuth, (req, res) => {
  destroySession(req, res)
  res.json({ ok: true })
})

export default router
