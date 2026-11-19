import { ref } from 'vue'
import { publicApi } from './api'

/** Fallback dipakai sebelum data admin termuat atau saat API belum tersedia. */
export const defaultSettings = {
  email: 'info@restuproduction.com',
  location: 'Wonosobo, Jawa Tengah',
  mapsUrl: 'https://maps.app.goo.gl/Ro1H2okwg6SGZ1tKA',
  whatsappMessage:
    'Hai Restu Production, saya ingin konsultasi perlengkapan event. Bisa dibantu?',
  phones: [
    {
      label: 'WhatsApp',
      number: '+6282145632380',
      display: '+62 821-4563-2380',
      whatsapp: true,
    },
  ],
  socials: [],
}

export const siteSettings = ref({ ...defaultSettings })
let pending

export function loadSettings(force = false) {
  if (pending && !force) return pending
  pending = publicApi
    .settings()
    .then((data) => {
      // Endpoint mengembalikan { settings: {...} }, bukan objek settings langsung.
      siteSettings.value = { ...defaultSettings, ...(data?.settings || data) }
      return siteSettings.value
    })
    .catch(() => siteSettings.value)
    .finally(() => {
      pending = undefined
    })
  return pending
}

export function whatsappLink(settings = siteSettings.value, text) {
  const phone = settings.phones?.find((item) => item.whatsapp) || settings.phones?.[0]
  if (!phone) return '#contact'
  const digits = String(phone.number).replace(/\D/g, '')
  const message = encodeURIComponent(text || settings.whatsappMessage || 'Hai Restu Production')
  return `https://wa.me/${digits}?text=${message}`
}

const CHANNEL_NAME = 'restupro-settings'
const canBroadcast = () =>
  typeof window !== 'undefined' && typeof window.BroadcastChannel !== 'undefined'

/** Beri tahu tab lain bahwa pengaturan berubah sehingga ikut memuat ulang. */
export function notifySettingsChanged() {
  if (!canBroadcast()) return
  const channel = new BroadcastChannel(CHANNEL_NAME)
  channel.postMessage('changed')
  channel.close()
}

if (canBroadcast()) {
  const channel = new BroadcastChannel(CHANNEL_NAME)
  channel.addEventListener('message', () => loadSettings(true))
}
