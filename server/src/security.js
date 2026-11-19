import { config } from './config.js'
import { forbidden, tooMany } from './http.js'

const MUTATIONS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/** Header keamanan untuk semua respons API & statis. */
export function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  )
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self'",
      "media-src 'self'",
    ].join('; '),
  )
  if (config.isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  res.removeHeader('X-Powered-By')
  next()
}

/** CSRF lapis kedua: header khusus + Origin/Referer yang dikenal. */
export function originGuard(req, res, next) {
  if (!req.path.startsWith('/api') || !MUTATIONS.has(req.method)) return next()

  if (req.get('x-requested-with') !== 'RestuPro') {
    return next(forbidden('Permintaan tidak dikenal.'))
  }

  const origin = req.get('origin')
  const referer = req.get('referer')
  const candidate = origin || referer
  if (candidate) {
    let allowed = candidate === config.siteUrl
    if (!allowed && !config.isProduction) {
      try {
        const url = new URL(candidate)
        allowed = ['localhost', '127.0.0.1'].includes(url.hostname)
      } catch {
        allowed = false
      }
    }
    if (!allowed) return next(forbidden('Asal permintaan tidak diizinkan.'))
  }

  next()
}

/** Rate limiter in-memory; cukup untuk satu proses Express. */
export function createRateLimiter({ windowMs, max, prefix = 'general', key = (req) => req.ip }) {
  const hits = new Map()

  return function limiter(req, res, next) {
    const now = Date.now()
    const id = `${prefix}:${key(req)}`
    let entry = hits.get(id)

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs }
      hits.set(id, entry)
    }

    if (hits.size > 5000) {
      for (const [mapKey, value] of hits) if (value.resetAt <= now) hits.delete(mapKey)
    }

    entry.count += 1
    res.setHeader('X-RateLimit-Limit', String(max))
    res.setHeader('X-RateLimit-Remaining', String(Math.max(max - entry.count, 0)))

    if (entry.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)))
      return next(tooMany())
    }
    next()
  }
}
