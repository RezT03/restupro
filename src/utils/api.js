/**
 * Client API kecil di atas fetch.
 * - Dev: Vite mem-proxy /api dan /media ke Express (lihat vite.config.js).
 * - Prod: Express menyajikan dist/, jadi origin tetap sama.
 * - CSRF token disimpan di memory (bukan localStorage) dan dikirim lewat header.
 */

let csrfToken = ''

const MUTATIONS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

export function setCsrfToken(token) {
  csrfToken = token || ''
}

export function getCsrfToken() {
  return csrfToken
}

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, form, headers = {}, signal, ...rest } = options
  const requestHeaders = { ...headers, 'X-Requested-With': 'RestuPro' }

  if (MUTATIONS.has(method.toUpperCase()) && csrfToken) {
    requestHeaders['X-CSRF-Token'] = csrfToken
  }

  let payload = body
  if (body !== undefined && !(body instanceof FormData) && typeof body !== 'string') {
    requestHeaders['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: requestHeaders,
      body: form || payload,
      credentials: 'same-origin',
      signal,
      ...rest,
    })
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi Anda.', 0)
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(data?.error || `Permintaan gagal (${response.status})`, response.status, data)
  }

  if (data?.csrfToken) setCsrfToken(data.csrfToken)
  return data
}

export const publicApi = {
  projects: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/projects${query ? `?${query}` : ''}`)
  },
  project: (slug) => apiFetch(`/projects/${encodeURIComponent(slug)}`),
  settings: () => apiFetch('/settings'),
}

export const adminApi = {
  me: () => apiFetch('/auth/me'),
  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  projects: () => apiFetch('/admin/projects'),
  media: () => apiFetch('/admin/media'),
  saveProject: (data, id) =>
    apiFetch(id ? `/admin/projects/${id}` : '/admin/projects', {
      method: id ? 'PUT' : 'POST',
      body: data,
    }),
  deleteProject: (id) => apiFetch(`/admin/projects/${id}`, { method: 'DELETE' }),
  uploadMedia: (files) => {
    const form = new FormData()
    files.forEach((file) => form.append('files', file))
    return apiFetch('/admin/media', { method: 'POST', form })
  },
  deleteMedia: (id) => apiFetch(`/admin/media/${id}`, { method: 'DELETE' }),
  getSettings: () => apiFetch('/admin/settings'),
  saveSettings: (settings) =>
    apiFetch('/admin/settings', { method: 'PUT', body: { settings } }),
}

export default apiFetch
