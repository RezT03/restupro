import { randomBytes } from 'node:crypto'
import { config } from './config.js'
import { db } from './db.js'
import { hashPassword } from './auth.js'

const USERNAME_RE = /^[a-z0-9_.-]{3,50}$/
const HASH_RE = /^scrypt\$[a-f0-9]+\$[a-f0-9]+$/i

let ready = false

/**
 * Menyiapkan akun admin di MySQL.
 * Variabel ADMIN_USERNAME + ADMIN_PASSWORD_HASH di .env hanya dipakai SEKALI
 * saat tabel admins masih kosong (bootstrap / migrasi). Selanjutnya sumber
 * kebenaran ada di database.
 */
export async function initAdminAuth() {
  const [rows] = await db().query('SELECT COUNT(*) AS total FROM admins')
  if (Number(rows[0].total) > 0) {
    ready = true
    return
  }

  const username = config.adminUsername || 'admin'
  if (!USERNAME_RE.test(username)) {
    throw new Error('ADMIN_USERNAME harus 3–50 karakter: huruf kecil, angka, titik, garis bawah, atau tanda hubung.')
  }

  let passwordHash = config.adminPasswordHash
  if (passwordHash && !HASH_RE.test(passwordHash)) {
    throw new Error('ADMIN_PASSWORD_HASH tidak valid. Buat dengan: npm run hash-password')
  }

  if (!passwordHash && config.adminPassword) {
    if (config.adminPassword.length < 12) {
      throw new Error('ADMIN_PASSWORD minimal 12 karakter.')
    }
    passwordHash = hashPassword(config.adminPassword)
  }

  if (!passwordHash && config.isProduction) {
    throw new Error(
      'Production memerlukan ADMIN_PASSWORD_HASH (atau ADMIN_PASSWORD) untuk bootstrap admin pertama.',
    )
  }

  let temporary = ''
  if (!passwordHash) {
    temporary = randomBytes(12).toString('base64url')
    passwordHash = hashPassword(temporary)
  }

  const now = new Date().toISOString()
  await db().query(
    'INSERT INTO admins (username, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?)',
    [username, passwordHash, now, now],
  )

  if (temporary) {
    console.warn('\n[Admin pertama dibuat di MySQL]')
    console.warn(`Username : ${username}`)
    console.warn(`Password : ${temporary}`)
    console.warn('Ganti dengan: npm run admin -- password\n')
  } else {
    console.log(`Admin "${username}" dimigrasikan dari .env ke MySQL.`)
  }

  ready = true
}

export function assertAdminReady() {
  if (!ready) throw new Error('Admin auth belum diinisialisasi.')
}

/** Cari akun admin by username. Selalu async agar tidak bergantung pada env. */
export async function findAdminByUsername(username) {
  assertAdminReady()
  const [rows] = await db().query(
    'SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1',
    [String(username).toLowerCase()],
  )
  return rows[0] || null
}
