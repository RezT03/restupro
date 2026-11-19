import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const SERVER_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const PROJECT_ROOT = path.resolve(SERVER_ROOT, '..')

/** Pembaca .env tanpa dependensi tambahan (variabel lingkungan asli tetap menang). */
function loadEnv() {
  const file = path.join(SERVER_ROOT, '.env')
  if (!fs.existsSync(file)) return
  const content = fs.readFileSync(file, 'utf8')
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const index = line.indexOf('=')
    if (index === -1) continue
    const key = line.slice(0, index).trim()
    let value = line.slice(index + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

loadEnv()

const int = (value, fallback) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const config = {
  port: int(process.env.PORT, 3510),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  siteUrl: (process.env.SITE_URL || 'https://restuproduction.com').replace(/\/$/, ''),
  adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  sessionTtlMs: int(process.env.SESSION_TTL_HOURS, 8) * 60 * 60 * 1000,
  trustProxy: process.env.TRUST_PROXY === 'true',
  dbHost: process.env.DB_HOST || '127.0.0.1',
  dbPort: int(process.env.DB_PORT, 3306),
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'restupro',
  maxUploads: int(process.env.MAX_UPLOADS, 8),
  maxImageBytes: int(process.env.MAX_IMAGE_MB, 15) * 1024 * 1024,
  maxVideoBytes: int(process.env.MAX_VIDEO_MB, 60) * 1024 * 1024,
  maxPdfBytes: int(process.env.MAX_PDF_MB, 10) * 1024 * 1024,
}
