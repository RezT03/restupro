import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { SERVER_ROOT, config } from './config.js'
import { db, initDb, withTransaction } from './db.js'

export const DATA_DIR = path.join(SERVER_ROOT, 'data')
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')

export const defaultSettings = () => ({
  email: 'info@restuproduction.com',
  location: 'Wonosobo, Jawa Tengah',
  mapsUrl: 'https://maps.app.goo.gl/Ro1H2okwg6SGZ1tKA',
  whatsappMessage: 'Hai Restu Production, saya ingin konsultasi perlengkapan event. Bisa dibantu?',
  phones: [
    {
      label: 'WhatsApp',
      number: '+6282145632380',
      display: '+62 821-4563-2380',
      whatsapp: true,
    },
  ],
  socials: [],
})

export async function initStore() {
  await initDb()
  await db().query(
    'INSERT IGNORE INTO settings (id, data) VALUES (1, ?)',
    [JSON.stringify(defaultSettings())],
  )
}

function parseJson(value, fallback) {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function rowToProject(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    client: row.client,
    location: row.location,
    eventDate: row.event_date || '',
    excerpt: row.excerpt,
    content: row.content,
    status: row.status,
    featured: Boolean(row.featured),
    coverId: row.cover_id || '',
    galleryIds: parseJson(row.gallery_ids, []),
    mediaIds: parseJson(row.media_ids, []),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const MEDIA_COLUMNS =
  'id, name, url, thumb_url, type, size, width, height, filename, thumb_filename, created_at'

function rowToMedia(row) {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    thumbUrl: row.thumb_url || null,
    type: row.type,
    size: Number(row.size) || 0,
    width: row.width ?? null,
    height: row.height ?? null,
    filename: row.filename,
    thumbFilename: row.thumb_filename || null,
    createdAt: row.created_at,
  }
}

export const publicMedia = ({ id, name, url, thumbUrl, type, size, width, height, createdAt }) => ({
  id,
  name,
  url,
  thumbUrl,
  type,
  size,
  width,
  height,
  createdAt,
})

export function mediaUrl(filename) {
  return `/media/${encodeURIComponent(filename)}`
}

export function newId() {
  return randomUUID()
}

export function publicProject(project, mediaById = new Map()) {
  const attach = (id) => {
    const item = mediaById.get(id)
    if (!item) return null
    return {
      id: item.id,
      url: item.url,
      thumbUrl: item.thumbUrl,
      name: item.name,
      alt: item.name,
      type: item.type,
    }
  }
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    category: project.category,
    client: project.client,
    location: project.location,
    eventDate: project.eventDate,
    excerpt: project.excerpt,
    content: project.content,
    featured: Boolean(project.featured),
    status: project.status,
    cover: attach(project.coverId),
    gallery: (project.galleryIds || []).map(attach).filter(Boolean),
    media: (project.mediaIds || []).map(attach).filter(Boolean),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }
}

export async function mediaMap() {
  const items = await listMedia()
  return new Map(items.map((item) => [item.id, item]))
}

/* ---------------------------------- settings --------------------------------- */

export async function getSettings() {
  const [rows] = await db().query('SELECT data FROM settings WHERE id = 1')
  if (!rows.length) return defaultSettings()
  return { ...defaultSettings(), ...parseJson(rows[0].data, {}) }
}

export async function saveSettings(settings) {
  const json = JSON.stringify(settings)
  await db().query('INSERT INTO settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = ?', [
    json,
    json,
  ])
  return settings
}

/* ---------------------------------- projects --------------------------------- */

export async function listProjects({ publishedOnly = false, category = '', limit = 60 } = {}) {
  const conditions = []
  const params = []

  if (publishedOnly) conditions.push("status = 'published'")
  if (category) {
    conditions.push('LOWER(category) = ?')
    params.push(String(category).toLowerCase())
  }

  const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : ''
  const [rows] = await db().query(
    `SELECT * FROM projects${where} ORDER BY event_date DESC, created_at DESC LIMIT ?`,
    [...params, limit],
  )
  return rows.map(rowToProject)
}

export async function getProjectById(id) {
  const [rows] = await db().query('SELECT * FROM projects WHERE id = ? LIMIT 1', [id])
  return rows.length ? rowToProject(rows[0]) : null
}

export async function getProjectBySlug(slug, publishedOnly = false) {
  const sql = publishedOnly
    ? 'SELECT * FROM projects WHERE slug = ? AND status = \'published\' LIMIT 1'
    : 'SELECT * FROM projects WHERE slug = ? LIMIT 1'
  const [rows] = await db().query(sql, [slug])
  return rows.length ? rowToProject(rows[0]) : null
}

const projectValues = (project) => [
  project.id,
  project.slug,
  project.title,
  project.category,
  project.client || '',
  project.location || '',
  project.eventDate || null,
  project.excerpt,
  project.content || '',
  project.status,
  project.featured ? 1 : 0,
  project.coverId || null,
  JSON.stringify(project.galleryIds || []),
  JSON.stringify(project.mediaIds || []),
  project.createdAt,
  project.updatedAt,
]

const PROJECT_COLUMNS =
  'id, slug, title, category, client, location, event_date, excerpt, content, status, featured, cover_id, gallery_ids, media_ids, created_at, updated_at'

export async function insertProject(project) {
  const placeholders = Array(16).fill('?').join(', ')
  await db().query(`INSERT INTO projects (${PROJECT_COLUMNS}) VALUES (${placeholders})`, projectValues(project))
  return project
}

export async function updateProject(id, project) {
  const values = projectValues(project)
  const pairs = PROJECT_COLUMNS.split(', ')
    .map((column, index) => ({ column, value: values[index] }))
    .filter(({ column }) => column !== 'id' && column !== 'created_at')
  const assignments = pairs.map(({ column }) => `${column} = ?`).join(', ')
  const params = pairs.map(({ value }) => value)
  await db().query(`UPDATE projects SET ${assignments} WHERE id = ?`, [...params, id])
  return project
}

export async function deleteProject(id) {
  await db().query('DELETE FROM projects WHERE id = ?', [id])
}

/* ------------------------------------ media ---------------------------------- */

export async function listMedia() {
  const [rows] = await db().query(`SELECT ${MEDIA_COLUMNS} FROM media ORDER BY created_at DESC`)
  return rows.map(rowToMedia)
}

export async function findMedia(id) {
  const [rows] = await db().query(`SELECT ${MEDIA_COLUMNS} FROM media WHERE id = ? LIMIT 1`, [id])
  return rows.length ? rowToMedia(rows[0]) : null
}

export async function insertMedia(entries) {
  await withTransaction(async (connection) => {
    for (const entry of entries) {
      await connection.query(
        `INSERT INTO media
          (id, name, url, thumb_url, type, size, width, height, filename, thumb_filename, data, thumb_data, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          entry.id,
          entry.name,
          entry.url,
          entry.thumbUrl || null,
          entry.type,
          entry.size,
          entry.width ?? null,
          entry.height ?? null,
          entry.filename,
          entry.thumbFilename || null,
          entry.data,
          entry.thumbData || null,
          entry.createdAt,
        ],
      )
    }
  })
  return entries
}

export async function deleteMedia(id) {
  await withTransaction(async (connection) => {
    await connection.query('DELETE FROM media WHERE id = ?', [id])

    const [rows] = await connection.query('SELECT id, cover_id, gallery_ids, media_ids FROM projects')
    for (const row of rows) {
      const gallery = (parseJson(row.gallery_ids, []) || []).filter((item) => item !== id)
      const extra = (parseJson(row.media_ids, []) || []).filter((item) => item !== id)
      const cover = row.cover_id === id ? null : row.cover_id
      const changed =
        gallery.length !== (parseJson(row.gallery_ids, []) || []).length ||
        extra.length !== (parseJson(row.media_ids, []) || []).length ||
        cover !== row.cover_id
      if (!changed) continue
      await connection.query(
        'UPDATE projects SET cover_id = ?, gallery_ids = ?, media_ids = ? WHERE id = ?',
        [cover, JSON.stringify(gallery), JSON.stringify(extra), row.id],
      )
    }
  })
}

export async function getMediaFile(filename) {
  const [rows] = await db().query(
    'SELECT type, data, thumb_filename FROM media WHERE filename = ? OR thumb_filename = ? LIMIT 1',
    [filename, filename],
  )
  if (!rows.length) return null
  return { type: rows[0].type, data: rows[0].data }
}

export const uploadLimits = {
  files: config.maxUploads,
  fields: 30,
  parts: 40,
  fieldSize: 1024 * 1024,
}
