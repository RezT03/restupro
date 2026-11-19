import sharp from 'sharp'
import { badRequest } from './http.js'

function matches(buffer, offset, bytes) {
  if (buffer.length < offset + bytes.length) return false
  return bytes.every((byte, index) => buffer[offset + index] === byte)
}

const ascii = (text) => [...text].map((char) => char.charCodeAt(0))

/** Deteksi tipe dari magic bytes — bukan dari nama atau MIME yang dikirim klien. */
export function detectMime(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null
  if (matches(buffer, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png'
  if (matches(buffer, 0, [0xff, 0xd8, 0xff])) return 'image/jpeg'
  if (ascii('RIFF').every((b, i) => buffer[i] === b) && ascii('WEBP').every((b, i) => buffer[i + 8] === b))
    return 'image/webp'
  if (ascii('GIF87a').every((b, i) => buffer[i] === b) || ascii('GIF89a').every((b, i) => buffer[i] === b))
    return 'image/gif'
  if (matches(buffer, 4, ascii('ftyp'))) {
    const brand = buffer.subarray(8, 12).toString('ascii')
    if (['avif', 'avis'].includes(brand)) return 'image/avif'
    if (['mp42', 'isom', 'avc1', 'mp41', 'M4V '].includes(brand)) return 'video/mp4'
  }
  if (matches(buffer, 0, [0x1a, 0x45, 0xdf, 0xa3])) return 'video/webm'
  if (matches(buffer, 0, ascii('%PDF-'))) return 'application/pdf'
  return null
}

function category(mime) {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime === 'application/pdf') return 'pdf'
  return 'unknown'
}

/**
 * Gambar besar dikompres ke WebP (maks. 1920px) dan dibuat versi thumb 800px.
 * Metadata dihapus oleh sharp secara default.
 */
export async function processUpload(buffer, declaredMime) {
  const mime = detectMime(buffer)
  if (!mime) throw badRequest('Format file tidak dikenali atau file rusak.')

  if (category(mime) !== category(declaredMime)) {
    throw badRequest('Jenis file tidak sesuai dengan isi file sebenarnya.')
  }

  if (!mime.startsWith('image/')) {
    return { buffer, type: mime, extension: mime === 'video/mp4' ? 'mp4' : mime === 'video/webm' ? 'webm' : 'pdf', width: null, height: null, thumbBuffer: null }
  }

  try {
    const pipeline = sharp(buffer, { failOn: 'error', limitInputPixels: 50_000_000 }).rotate()
    const metadata = await pipeline.metadata()
    const resize = (instance, width) =>
      instance.resize({ width, height: width, fit: 'inside', withoutEnlargement: true })

    let full = await resize(pipeline.clone(), 1920).webp({ quality: 80, effort: 4 }).toBuffer()
    if (full.length > buffer.length) {
      const smaller = await resize(pipeline.clone(), 1920).webp({ quality: 62, effort: 4 }).toBuffer()
      if (smaller.length < full.length) full = smaller
    }
    const thumb = await resize(pipeline.clone(), 800).webp({ quality: 72, effort: 4 }).toBuffer()

    return {
      buffer: full,
      type: 'image/webp',
      extension: 'webp',
      width: metadata.width || null,
      height: metadata.height || null,
      thumbBuffer: thumb,
    }
  } catch {
    throw badRequest('Gambar tidak dapat diproses. Coba format JPG, PNG, atau WebP lain.')
  }
}
