export class HttpError extends Error {
  constructor(status, message, details) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.details = details
  }
}

export const badRequest = (message, details) => new HttpError(400, message, details)
export const unauthorized = (message = 'Sesi tidak valid. Silakan masuk kembali.') =>
  new HttpError(401, message)
export const forbidden = (message = 'Akses ditolak.') => new HttpError(403, message)
export const notFound = (message = 'Data tidak ditemukan.') => new HttpError(404, message)
export const tooMany = (message = 'Terlalu banyak permintaan. Coba lagi nanti.') =>
  new HttpError(429, message)

export function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}
