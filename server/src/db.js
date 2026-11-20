import mysql from 'mysql2/promise'
import { config } from './config.js'

let pool = null

function databaseName() {
  const name = String(config.dbName || 'restupro')
  if (!/^[A-Za-z0-9_]+$/.test(name)) {
    throw new Error('DB_NAME hanya boleh berisi huruf, angka, dan garis bawah.')
  }
  return name
}

const connectionOptions = () => ({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  charset: 'utf8mb4',
  connectTimeout: 10000,
})

/** Membuat database + tabel bila belum ada, lalu menyiapkan pool koneksi. */
export async function initDb() {
  const name = databaseName()
  const bootstrap = await mysql.createConnection(connectionOptions())
  try {
    await bootstrap.query(
      `CREATE DATABASE IF NOT EXISTS \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
  } catch (error) {
    // Shared hosting (cPanel/hPanel) umumnya melarang CREATE DATABASE walaupun
    // database sudah dibuat lewat panel. Kalau databasenya memang sudah ada
    // dan bisa dibuka, lanjutkan saja.
    const canCreate = error.code !== 'ER_DB_CREATE_EXISTS' && error.code !== 'ER_ACCESS_DENIED_ERROR'
    if (canCreate) throw error

    const probe = await mysql.createConnection({ ...connectionOptions(), database: name })
    try {
      await probe.query('SELECT 1')
    } catch (probeError) {
      throw new Error(
        `Database "${name}" tidak bisa dibuat/diakses. Buat database itu lewat panel hosting, ` +
          `lalu pastikan DB_USER/DB_PASSWORD memiliki hak pada database tersebut. ` +
          `(${probeError.code || probeError.message})`,
      )
    } finally {
      await probe.end()
    }
  } finally {
    await bootstrap.end()
  }

  pool = mysql.createPool({
    ...connectionOptions(),
    database: name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
    multipleStatements: false,
  })

  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
      data JSON NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at VARCHAR(30) NOT NULL,
      updated_at VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // Upgrade instalasi lama yang masih memakai kolom email sebagai identitas admin.
  const [legacyColumn] = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'admins' AND COLUMN_NAME = 'email'`,
    [name],
  )
  if (legacyColumn.length) {
    await pool.query('ALTER TABLE admins CHANGE COLUMN email username VARCHAR(100) NOT NULL')
    try {
      await pool.query('ALTER TABLE admins RENAME INDEX email TO username')
    } catch {
      // Index sudah bernama username atau tidak ada — tidak masalah.
    }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS media (
      id CHAR(36) NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      url VARCHAR(512) NOT NULL,
      thumb_url VARCHAR(512) NULL,
      type VARCHAR(100) NOT NULL,
      size BIGINT UNSIGNED NOT NULL DEFAULT 0,
      width INT NULL,
      height INT NULL,
      filename VARCHAR(255) NOT NULL UNIQUE,
      thumb_filename VARCHAR(255) NULL,
      data LONGBLOB NOT NULL,
      thumb_data LONGBLOB NULL,
      created_at VARCHAR(30) NOT NULL,
      INDEX idx_media_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id CHAR(36) NOT NULL PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      client VARCHAR(255) NOT NULL DEFAULT '',
      location VARCHAR(255) NOT NULL DEFAULT '',
      event_date DATE NULL,
      excerpt VARCHAR(500) NOT NULL,
      content TEXT NOT NULL,
      status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
      featured TINYINT(1) NOT NULL DEFAULT 0,
      cover_id CHAR(36) NULL,
      gallery_ids JSON NOT NULL,
      media_ids JSON NOT NULL,
      created_at VARCHAR(30) NOT NULL,
      updated_at VARCHAR(30) NOT NULL,
      INDEX idx_projects_status (status),
      INDEX idx_projects_event (event_date),
      INDEX idx_projects_updated (updated_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    /* cover_id sengaja tanpa FOREIGN KEY: shared hosting sering mencabut hak
       REFERENCES. deleteMedia() sudah membersihkan referensi secara manual. */
  `)
}

export function db() {
  if (!pool) throw new Error('Database belum diinisialisasi.')
  return pool
}

export async function withTransaction(handler) {
  const connection = await db().getConnection()
  try {
    await connection.beginTransaction()
    const result = await handler(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function closeDb() {
  if (!pool) return
  await pool.end()
  pool = null
}
