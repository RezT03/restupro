import { randomBytes, scryptSync, createHash, timingSafeEqual } from 'node:crypto'
import { config } from './config.js'
import { forbidden, unauthorized } from './http.js'

const sessions = new Map()
const COOKIE = config.isProduction ? '__Host-restupro_session' : 'restupro_session'

const cleanup = setInterval(() => {
  const now = Date.now()
  for (const [key, session] of sessions) if (session.expiresAt <= now) sessions.delete(key)
}, 15 * 60 * 1000)
cleanup.unref()

export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `scrypt$${salt}$${derived}`
}

const DUMMY_HASH = hashPassword('dummy-password-for-timing-only')

export function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$')
  const validFormat = parts.length === 3 && parts[0] === 'scrypt'
  const salt = validFormat ? parts[1] : 'invalid-salt'
  const expected = validFormat ? Buffer.from(parts[2], 'hex') : Buffer.from(DUMMY_HASH.split('$')[2], 'hex')
  const actual = scryptSync(password, salt, expected.length)
  return validFormat && actual.length === expected.length && timingSafeEqual(actual, expected)
}

function parseCookies(header = '') {
  const result = {}
  for (const pair of header.split(';')) {
    const index = pair.indexOf('=')
    if (index === -1) continue
    const key = pair.slice(0, index).trim()
    try {
      result[key] = decodeURIComponent(pair.slice(index + 1).trim())
    } catch {
      result[key] = ''
    }
  }
  return result
}

const hashToken = (token) => createHash('sha256').update(token).digest('hex')

export function createSession(res, data = {}) {
  const token = randomBytes(32).toString('base64url')
  const csrfToken = randomBytes(24).toString('base64url')
  sessions.set(hashToken(token), {
    ...data,
    csrfToken,
    expiresAt: Date.now() + config.sessionTtlMs,
  })

  const attributes = [
    `${COOKIE}=${token}`,
    'HttpOnly',
    'SameSite=Strict',
    `Path=/`,
    `Max-Age=${Math.floor(config.sessionTtlMs / 1000)}`,
  ]
  if (config.isProduction) attributes.push('Secure')
  res.setHeader('Set-Cookie', attributes.join('; '))
  return csrfToken
}

export function destroySession(req, res) {
  const token = parseCookies(req.headers.cookie)[COOKIE]
  if (token) sessions.delete(hashToken(token))
  res.setHeader(
    'Set-Cookie',
    `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${config.isProduction ? '; Secure' : ''}`,
  )
}

export function requireAuth(req, res, next) {
  const token = parseCookies(req.headers.cookie)[COOKIE]
  const session = token ? sessions.get(hashToken(token)) : null

  if (!session || session.expiresAt <= Date.now()) {
    if (session) sessions.delete(hashToken(token))
    return next(unauthorized())
  }

  if (req.method !== 'GET' && req.get('x-csrf-token') !== session.csrfToken) {
    return next(forbidden('Token keamanan tidak cocok. Silakan muat ulang halaman.'))
  }

  req.session = session
  req.sessionToken = token
  next()
}

/** Dipanggil sesaat setelah login/me supaya klien mendapat CSRF token baru. */
export function rotateCsrf(req) {
  const next = randomBytes(24).toString('base64url')
  req.session.csrfToken = next
  return next
}
