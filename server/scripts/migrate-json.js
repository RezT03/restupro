import fs from 'node:fs/promises'
import path from 'node:path'
import { SERVER_ROOT } from '../src/config.js'
import { db, initDb, withTransaction } from '../src/db.js'
import { defaultSettings } from '../src/store.js'

const DATA_DIR = path.join(SERVER_ROOT, 'data')
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')
const CONTENT_FILE = path.join(DATA_DIR, 'content.json')

const asJson = (value, fallback) => {
  if (value === null || value === undefined) return JSON.stringify(fallback)
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

async function readLegacy() {
  try {
    return JSON.parse(await fs.readFile(CONTENT_FILE, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

async function readBlob(filename) {
  if (!filename) return null
  try {
    return await fs.readFile(path.join(UPLOADS_DIR, path.basename(filename)))
  } catch {
    console.warn(`  ! file tidak ditemukan: ${filename}`)
    return Buffer.alloc(0)
  }
}

await initDb()
const legacy = await readLegacy()

if (!legacy) {
  console.log('Tidak ada server/data/content.json — tidak ada yang dimigrasikan.')
  console.log('Database restupro sudah siap dengan pengaturan bawaan.')
  await db().end()
  process.exit(0)
}

let mediaCount = 0
let projectCount = 0

await withTransaction(async (connection) => {
  const settings = { ...defaultSettings(), ...(legacy.settings || {}) }
  const settingsJson = JSON.stringify(settings)
  await connection.query(
    'INSERT INTO settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = ?',
    [settingsJson, settingsJson],
  )

  for (const item of legacy.media || []) {
    await connection.query(
      `INSERT INTO media
        (id, name, url, thumb_url, type, size, width, height, filename, thumb_filename, data, thumb_data, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE id = id`,
      [
        item.id,
        item.name,
        item.url,
        item.thumbUrl || null,
        item.type,
        item.size || 0,
        item.width ?? null,
        item.height ?? null,
        item.filename,
        item.thumbFilename || null,
        await readBlob(item.filename),
        await readBlob(item.thumbFilename),
        item.createdAt || new Date().toISOString(),
      ],
    )
    mediaCount += 1
  }

  for (const project of legacy.projects || []) {
    await connection.query(
      `INSERT INTO projects
        (id, slug, title, category, client, location, event_date, excerpt, content,
         status, featured, cover_id, gallery_ids, media_ids, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE id = id`,
      [
        project.id,
        project.slug,
        project.title,
        project.category || 'Proyek',
        project.client || '',
        project.location || '',
        project.eventDate || null,
        project.excerpt,
        project.content || '',
        project.status || 'draft',
        project.featured ? 1 : 0,
        project.coverId || null,
        asJson(project.galleryIds, []),
        asJson(project.mediaIds, []),
        project.createdAt || new Date().toISOString(),
        project.updatedAt || new Date().toISOString(),
      ],
    )
    projectCount += 1
  }
})

console.log(`Migrasi selesai: ${mediaCount} media, ${projectCount} proyek, 1 pengaturan.`)
console.log('Data lama di server/data/ sengaja tidak dihapus (disimpan sebagai backup).')
await db().end()
