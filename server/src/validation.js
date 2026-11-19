import { randomBytes } from 'node:crypto'
import { badRequest } from './http.js'

function sanitize(value, preserveNewlines = false) {
  const text = String(value ?? '')
    .replace(/<[^>]*>/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
  return preserveNewlines ? text.replace(/[ \t]+/g, ' ').trim() : text.replace(/\s+/g, ' ').trim()
}

function field(input, key, { max = 200, required = false, preserveNewlines = false, fallback = '' } = {}) {
  const value = sanitize(input[key], preserveNewlines)
  if (required && !value) throw badRequest(`Kolom ${key} wajib diisi.`)
  if (value.length > max) throw badRequest(`Kolom ${key} terlalu panjang (maks. ${max} karakter).`)
  return value || fallback
}

export function slugify(text) {
  const base = sanitize(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
  return `${base || 'proyek'}-${randomBytes(3).toString('hex')}`
}

export function isSafeUrl(value) {
  if (!value) return true
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password
  } catch {
    return false
  }
}

function mediaIds(input, key, allowed, max) {
  const raw = Array.isArray(input[key]) ? input[key] : []
  if (raw.length > max) throw badRequest(`Terlalu banyak media pada ${key} (maks. ${max}).`)
  return [...new Set(raw.map(String))].filter((id) => allowed.has(id)).slice(0, max)
}

export function validateProject(input, allowedMediaIds = new Set(), existing = null) {
  if (!input || typeof input !== 'object') throw badRequest('Data proyek tidak valid.')

  const status = input.status === 'published' ? 'published' : 'draft'
  let eventDate = field(input, 'eventDate', { max: 10 })
  if (eventDate && (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate) || Number.isNaN(Date.parse(eventDate)))) {
    throw badRequest('Tanggal acara tidak valid.')
  }
  if (eventDate) eventDate = new Date(`${eventDate}T00:00:00Z`).toISOString().slice(0, 10)

  return {
    id: existing?.id,
    slug: existing?.slug || slugify(field(input, 'title', { required: true, max: 140 })),
    title: field(input, 'title', { required: true, max: 140 }),
    category: field(input, 'category', { max: 60, fallback: 'Proyek' }),
    client: field(input, 'client', { max: 120 }),
    location: field(input, 'location', { max: 120 }),
    eventDate,
    excerpt: field(input, 'excerpt', { required: true, max: 300 }),
    content: field(input, 'content', { max: 12000, preserveNewlines: true }),
    status,
    featured: input.featured === true || input.featured === 'true',
    coverId: mediaIds({ coverId: input.coverId ? [input.coverId] : [] }, 'coverId', allowedMediaIds, 1)[0] || '',
    galleryIds: mediaIds(input, 'galleryIds', allowedMediaIds, 24),
    mediaIds: mediaIds(input, 'mediaIds', allowedMediaIds, 12),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function validateSettings(input) {
  const data = input?.settings ?? input
  if (!data || typeof data !== 'object') throw badRequest('Data pengaturan tidak valid.')

  const email = field(data, 'email', { max: 160, required: true })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw badRequest('Alamat email tidak valid.')

  const mapsUrl = field(data, 'mapsUrl', { max: 500 })
  if (!isSafeUrl(mapsUrl)) throw badRequest('Tautan Google Maps tidak valid.')

  const rawPhones = Array.isArray(data.phones) ? data.phones : []
  if (rawPhones.length > 10) throw badRequest('Maksimal 10 nomor telepon.')
  const phones = rawPhones
    .map((phone, index) => {
      const number = sanitize(phone?.number).replace(/[\s()-]/g, '')
      if (!number) return null
      if (!/^\+?\d{8,16}$/.test(number)) throw badRequest(`Nomor telepon ke-${index + 1} tidak valid.`)
      return {
        label: sanitize(phone.label).slice(0, 40) || 'Telepon',
        number,
        display: sanitize(phone.display).slice(0, 40) || number,
        whatsapp: phone.whatsapp === true || phone.whatsapp === 'true',
      }
    })
    .filter(Boolean)

  const rawSocials = Array.isArray(data.socials) ? data.socials : []
  if (rawSocials.length > 10) throw badRequest('Maksimal 10 tautan media sosial.')
  const socials = rawSocials
    .map((social, index) => {
      const platform = sanitize(social?.platform).slice(0, 40)
      const url = sanitize(social?.url).slice(0, 500)
      if (!platform || !url) return null
      if (!isSafeUrl(url)) throw badRequest(`Tautan media sosial ke-${index + 1} tidak valid.`)
      return { platform, url }
    })
    .filter(Boolean)

  return {
    email,
    location: field(data, 'location', { max: 120 }),
    mapsUrl,
    whatsappMessage: field(data, 'whatsappMessage', { max: 300 }),
    phones,
    socials,
  }
}
