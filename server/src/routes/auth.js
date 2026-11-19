import { Router } from 'express'
import { createSession, destroySession, requireAuth, verifyPassword } from '../auth.js'
import { findAdminByEmail } from '../admin-auth.js'
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
    const email = String(req.body?.email || '').trim().toLowerCase()
    const password = String(req.body?.password || '')
    if (!email || !password || password.length > 200) {
      return next(badRequest('Email dan kata sandi wajib diisi.'))
    }

    const admin = await findAdminByEmail(email)
    // Verifikasi tetap dijalankan dengan hash dummy agar respons tidak membocorkan
    // apakah email terdaftar atau tidak (timing attack).
    const passwordMatches = verifyPassword(password, admin?.password_hash || '')
    if (!admin || !passwordMatches) {
      await delay(400)
      return next(unauthorized('Email atau kata sandi salah.'))
    }

    const csrfToken = createSession(res, { email: admin.email, adminId: admin.id })
    res.json({ ok: true, csrfToken, email: admin.email })
  }),
)

router.get('/me', requireAuth, (req, res) => {
  res.json({
    authenticated: true,
    csrfToken: req.session.csrfToken,
    email: req.session.email || '',
  })
})

router.post('/logout', requireAuth, (req, res) => {
  destroySession(req, res)
  res.json({ ok: true })
})

export default router
