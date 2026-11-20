/**
 * Pengelola head ringan untuk SPA.
 * index.html sudah memuat meta default + JSON-LD Organization; modul ini
 * mengganti judul, deskripsi, canonical, OG, Twitter, dan structured data
 * setiap kali rute berubah.
 */

const SITE_URL = 'https://restuproduction.com'
const DEFAULT_IMAGE = '/images/hero.png'
const DEFAULT_DESCRIPTION =
  'Restu Production menyewakan perlengkapan event profesional: audio, lighting, panggung, LED screen, genset, dan barikade.'

function ensureMeta(key, value, attributes = {}) {
  let el = document.head.querySelector(`meta[${key}="${value}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(key, value)
    document.head.appendChild(el)
  }
  Object.entries(attributes).forEach(([attr, content]) => el.setAttribute(attr, content))
  return el
}

function ensureLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  return el
}

export function absoluteUrl(path) {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function useSeo(options = {}) {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    path = '/',
    image = DEFAULT_IMAGE,
    type = 'website',
    noindex = false,
    structuredData,
  } = options

  const fullTitle = title
    ? `${title} — Restu Production`
    : 'Restu Production — Sewa Perlengkapan Event Profesional'
  const url = absoluteUrl(path)
  const imageUrl = image === null ? '' : absoluteUrl(image)

  document.title = fullTitle
  ensureMeta('name', 'description', { name: 'description', content: description })
  ensureMeta('name', 'robots', {
    name: 'robots',
    content: noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
  })
  ensureMeta('property', 'og:title', { property: 'og:title', content: fullTitle })
  ensureMeta('property', 'og:description', { property: 'og:description', content: description })
  ensureMeta('property', 'og:url', { property: 'og:url', content: url })
  ensureMeta('property', 'og:type', { property: 'og:type', content: type })
  ensureMeta('name', 'twitter:title', { name: 'twitter:title', content: fullTitle })
  ensureMeta('name', 'twitter:description', { name: 'twitter:description', content: description })
  if (image === null) {
    // Halaman tanpa gambar sampul tidak boleh memakai gambar default acak.
    document.head.querySelector('meta[property="og:image"]')?.remove()
    document.head.querySelector('meta[name="twitter:image"]')?.remove()
  } else {
    ensureMeta('property', 'og:image', { property: 'og:image', content: imageUrl })
    ensureMeta('name', 'twitter:image', { name: 'twitter:image', content: imageUrl })
  }
  ensureLink('canonical', url)

  let ld = document.getElementById('route-jsonld')
  if (structuredData) {
    if (!ld) {
      ld = document.createElement('script')
      ld.id = 'route-jsonld'
      ld.type = 'application/ld+json'
      document.head.appendChild(ld)
    }
    ld.textContent = JSON.stringify(structuredData)
  } else if (ld) {
    ld.remove()
  }
}
