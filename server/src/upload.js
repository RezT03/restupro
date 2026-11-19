import multer from 'multer'
import { config } from './config.js'
import { HttpError } from './http.js'
import { uploadLimits } from './store.js'

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/mp4',
  'video/webm',
  'application/pdf',
])

const ALLOWED_EXT = /\.(jpe?g|png|webp|gif|avif|mp4|webm|pdf)$/i

const upload = multer({
  storage: multer.memoryStorage(),
  limits: uploadLimits,
  fileFilter(req, file, callback) {
    if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.test(file.originalname)) {
      return callback(new HttpError(415, `Jenis file tidak didukung: ${file.originalname}`))
    }
    callback(null, true)
  },
})

export const uploadMediaFiles = upload.array('files', config.maxUploads)

export function normalizeUploadError(error) {
  if (error instanceof HttpError) return error
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return new HttpError(413, 'Ukuran file melebihi batas yang diizinkan.')
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return new HttpError(400, `Maksimal ${config.maxUploads} file per unggahan.`)
    }
    return new HttpError(400, `Unggahan tidak valid: ${error.message}`)
  }
  return null
}
