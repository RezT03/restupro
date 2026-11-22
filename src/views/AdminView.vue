<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { adminApi, setCsrfToken, ApiError } from '@/utils/api'
import { useSeo } from '@/utils/seo'
import { formatBytes, formatDate } from '@/utils/format'
import { loadSettings, notifySettingsChanged } from '@/utils/settings'

useSeo({ title: 'Panel Kontrol', path: '/admin', noindex: true })

const checking = ref(true)
const authenticated = ref(false)
const busy = ref(false)
const error = ref('')
const notice = ref('')
const activeTab = ref('projects')
const credentials = reactive({ username: '', password: '' })

const projects = ref([])
const media = ref([])
const settingsForm = reactive({
  email: '',
  location: '',
  mapsUrl: '',
  whatsappMessage: '',
  phones: [],
  socials: [],
})

const editorOpen = ref(false)
const editingId = ref(null)
const form = reactive(blankProject())
const uploading = ref(false)

function blankProject() {
  return {
    title: '',
    category: '',
    client: '',
    location: '',
    eventDate: '',
    excerpt: '',
    content: '',
    status: 'draft',
    featured: false,
    coverId: '',
    galleryIds: [],
    mediaIds: [],
  }
}

function message(text) {
  notice.value = text
  setTimeout(() => (notice.value = ''), 4500)
}

async function checkAuth() {
  try {
    const data = await adminApi.me()
    setCsrfToken(data.csrfToken)
    authenticated.value = true
    await loadData()
  } catch {
    authenticated.value = false
  } finally {
    checking.value = false
  }
}

async function login() {
  busy.value = true
  error.value = ''
  try {
    const data = await adminApi.login(credentials.username.trim(), credentials.password)
    setCsrfToken(data.csrfToken)
    authenticated.value = true
    credentials.password = ''
    await loadData()
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Login gagal.'
  } finally {
    busy.value = false
  }
}

async function logout() {
  try {
    await adminApi.logout()
  } catch {
    /* tetap keluar secara lokal */
  }
  setCsrfToken('')
  authenticated.value = false
  projects.value = []
  media.value = []
}

async function loadData() {
  const [projectData, mediaData, settingsData] = await Promise.all([
    adminApi.projects(),
    adminApi.media(),
    adminApi.getSettings(),
  ])
  projects.value = projectData.items || []
  media.value = mediaData.items || []
  Object.assign(settingsForm, {
    email: settingsData.settings?.email || '',
    location: settingsData.settings?.location || '',
    mapsUrl: settingsData.settings?.mapsUrl || '',
    whatsappMessage: settingsData.settings?.whatsappMessage || '',
    phones: settingsData.settings?.phones?.length ? settingsData.settings.phones : [{ label: 'WhatsApp', number: '', display: '', whatsapp: true }],
    socials: settingsData.settings?.socials?.length ? settingsData.settings.socials : [{ platform: 'Instagram', url: '' }],
  })
}

function openEditor(project) {
  Object.assign(form, blankProject())
  editingId.value = project?.id || null
  if (project) {
    Object.keys(form).forEach((key) => {
      if (project[key] !== undefined && project[key] !== null) form[key] = project[key]
    })
    form.coverId = project.cover?.id || project.coverId || ''
    form.galleryIds = (project.gallery || []).map((item) => item.id || item)
    form.mediaIds = (project.media || []).map((item) => item.id || item)
  }
  editorOpen.value = true
  error.value = ''
}

function closeEditor() {
  editorOpen.value = false
  editingId.value = null
}

async function saveProject() {
  busy.value = true
  error.value = ''
  const wasEditing = Boolean(editingId.value)
  try {
    await adminApi.saveProject({ ...form }, editingId.value)
    closeEditor()
    const data = await adminApi.projects()
    projects.value = data.items || []
    message(wasEditing ? 'Proyek diperbarui.' : 'Proyek baru disimpan.')
  } catch (err) {
    error.value = err.message || 'Gagal menyimpan proyek.'
  } finally {
    busy.value = false
  }
}

async function removeProject(project) {
  if (!window.confirm(`Hapus proyek "${project.title}"? Tindakan ini tidak bisa dibatalkan.`)) return
  try {
    await adminApi.deleteProject(project.id)
    projects.value = projects.value.filter((item) => item.id !== project.id)
    message('Proyek dihapus.')
  } catch (err) {
    error.value = err.message
  }
}

async function uploadFiles(fileList) {
  const files = Array.from(fileList || [])
  if (!files.length) return
  uploading.value = true
  error.value = ''
  try {
    const result = await adminApi.uploadMedia(files)
    const data = await adminApi.media()
    media.value = data.items || []
    message(`${result.items?.length || files.length} file berhasil diunggah. Gambar dikompres otomatis.`)
  } catch (err) {
    error.value = err.message || 'Unggah gagal.'
  } finally {
    uploading.value = false
  }
}

function onDrop(event) {
  uploadFiles(event.dataTransfer?.files)
}

async function removeMedia(item) {
  if (!window.confirm(`Hapus media "${item.name}"?`)) return
  try {
    await adminApi.deleteMedia(item.id)
    media.value = media.value.filter((entry) => entry.id !== item.id)
    if (form.coverId === item.id) form.coverId = ''
    form.galleryIds = form.galleryIds.filter((id) => id !== item.id)
    message('Media dihapus.')
  } catch (err) {
    error.value = err.message
  }
}

async function copyUrl(item) {
  try {
    await navigator.clipboard.writeText(`${location.origin}${item.url}`)
    message('Tautan media disalin.')
  } catch {
    error.value = 'Browser tidak mengizinkan penyalinan otomatis.'
  }
}

function addPhone() {
  settingsForm.phones.push({ label: 'Telepon', number: '', display: '', whatsapp: false })
}

function addSocial() {
  settingsForm.socials.push({ platform: '', url: '' })
}

async function saveSettings() {
  busy.value = true
  error.value = ''
  try {
    await adminApi.saveSettings({
      email: settingsForm.email,
      location: settingsForm.location,
      mapsUrl: settingsForm.mapsUrl,
      whatsappMessage: settingsForm.whatsappMessage,
      phones: settingsForm.phones,
      socials: settingsForm.socials,
    })
    await loadSettings(true)
    notifySettingsChanged()
    message('Informasi kontak diperbarui.')
  } catch (err) {
    error.value = err.message || 'Gagal menyimpan kontak.'
  } finally {
    busy.value = false
  }
}

/** Upload terbaru (berdasarkan createdAt) muncul paling atas. */
const byNewest = (a, b) =>
  String(b.createdAt || '').localeCompare(String(a.createdAt || '')) ||
  String(a.name || '').localeCompare(String(b.name || ''))
const imageMedia = computed(() =>
  media.value.filter((item) => item.type?.startsWith('image/')).slice().sort(byNewest),
)
const fileMedia = computed(() =>
  media.value.filter((item) => !item.type?.startsWith('image/')).slice().sort(byNewest),
)
const tabs = [
  { id: 'projects', label: 'Proyek' },
  { id: 'media', label: 'Media' },
  { id: 'contact', label: 'Kontak' },
]

onMounted(checkAuth)
</script>

<template>
  <div class="admin">
    <div v-if="checking" class="admin__center">Memeriksa sesi…</div>

    <div v-else-if="!authenticated" class="login">
      <div class="login__panel">
        <img src="/images/RESPRO LOGO-exc.svg" alt="Restu Production" width="130" height="44" />
        <p class="eyebrow">Restricted Area</p>
        <h1 class="h2">Panel Kontrol</h1>
        <p class="muted">Masuk untuk mengelola proyek, media, dan informasi kontak situs.</p>
        <form @submit.prevent="login">
          <label>Username
            <input v-model="credentials.username" type="text" autocomplete="username" required placeholder="username" />
          </label>
          <label>Kata sandi
            <input v-model="credentials.password" type="password" autocomplete="current-password" required placeholder="••••••••" />
          </label>
          <p v-if="error" class="admin__error" role="alert">{{ error }}</p>
          <button class="btn btn--primary btn--block" type="submit" :disabled="busy">
            {{ busy ? 'Memeriksa…' : 'Masuk' }}
          </button>
        </form>
        <RouterLink to="/" class="login__back">← Kembali ke situs</RouterLink>
      </div>
    </div>

    <template v-else>
      <header class="admin__header">
        <div class="wrap admin__header-inner">
          <div>
            <img src="/images/RESPRO LOGO-exc.svg" alt="Restu Production" width="112" height="38" />
            <span class="admin__badge">Panel Kontrol</span>
          </div>
          <div class="admin__header-actions">
            <RouterLink to="/" class="text-link">Lihat situs ↗</RouterLink>
            <button class="btn btn--ghost btn--sm" type="button" @click="logout">Keluar</button>
          </div>
        </div>
      </header>

      <div class="wrap admin__body">
        <p v-if="notice" class="admin__notice" role="status">{{ notice }}</p>
        <p v-if="error" class="admin__error" role="alert">{{ error }}</p>

        <nav class="admin__tabs" aria-label="Bagian panel kontrol">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            :class="{ 'is-active': activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </nav>

        <!-- PROYEK -->
        <section v-if="activeTab === 'projects'" class="admin__panel">
          <div class="admin__panel-head">
            <div>
              <h1 class="h2">Proyek</h1>
              <p class="muted">Tambah atau ubah dokumentasi proyek yang tampil di halaman /project.</p>
            </div>
            <button class="btn btn--primary" type="button" @click="openEditor(null)">+ Proyek baru</button>
          </div>

          <div class="admin__table-wrap">
            <table class="admin__table">
              <thead>
                <tr><th>Judul</th><th>Kategori</th><th>Status</th><th>Diperbarui</th><th></th></tr>
              </thead>
              <tbody>
                <tr v-for="project in projects" :key="project.id">
                  <td><strong>{{ project.title }}</strong><small>{{ project.slug }}</small></td>
                  <td>{{ project.category || '—' }}</td>
                  <td><span class="admin__status" :class="`is-${project.status}`">{{ project.status }}</span></td>
                  <td>{{ new Date(project.updatedAt).toLocaleDateString('id-ID') }}</td>
                  <td class="admin__row-actions">
                    <button type="button" @click="openEditor(project)">Ubah</button>
                    <button type="button" class="is-danger" @click="removeProject(project)">Hapus</button>
                  </td>
                </tr>
                <tr v-if="!projects.length">
                  <td colspan="5" class="admin__empty">Belum ada proyek. Klik “Proyek baru” untuk menambah.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- MEDIA -->
        <section v-else-if="activeTab === 'media'" class="admin__panel">
          <div class="admin__panel-head">
            <div>
              <h1 class="h2">Media</h1>
              <p class="muted">
                Gambar otomatis dikompres dan disimpan sebagai WebP (maks. 1920px). Video MP4/WebM
                dan PDF juga didukung.
              </p>
            </div>
          </div>

          <label
            class="dropzone"
            @dragover.prevent
            @drop.prevent="onDrop"
          >
            <input type="file" multiple accept="image/*,video/mp4,video/webm,application/pdf" :disabled="uploading" @change="uploadFiles($event.target.files); $event.target.value = ''" />
            <strong>{{ uploading ? 'Memproses & mengompres…' : 'Tarik file ke sini atau klik untuk memilih' }}</strong>
            <small>Gambar ≤ 15 MB · Video ≤ 60 MB · PDF ≤ 10 MB</small>
          </label>

          <div class="admin__media-grid">
            <article v-for="item in media" :key="item.id" class="media-item">
              <div class="media-item__preview">
                <img v-if="item.type?.startsWith('image/')" :src="item.url" :alt="item.name" loading="lazy" />
                <span v-else class="media-item__file">{{ item.type?.split('/')[1]?.toUpperCase() || 'FILE' }}</span>
              </div>
              <div class="media-item__info">
                <strong :title="item.name">{{ item.name }}</strong>
                <small>{{ formatBytes(item.size) }} · {{ item.width ? `${item.width}×${item.height}` : item.type }}</small>
                <div class="media-item__actions">
                  <button type="button" @click="copyUrl(item)">Salin URL</button>
                  <button type="button" class="is-danger" @click="removeMedia(item)">Hapus</button>
                </div>
              </div>
            </article>
            <p v-if="!media.length" class="admin__empty">Belum ada media terunggah.</p>
          </div>
        </section>

        <!-- KONTAK -->
        <section v-else class="admin__panel">
          <div class="admin__panel-head">
            <div>
              <h1 class="h2">Informasi Kontak</h1>
              <p class="muted">Nomor telepon dan tautan media sosial yang ditampilkan di situs.</p>
            </div>
            <button class="btn btn--primary" type="button" :disabled="busy" @click="saveSettings">Simpan perubahan</button>
          </div>

          <div class="admin__form-grid">
            <label>Email<input v-model="settingsForm.email" type="email" /></label>
            <label>Lokasi<input v-model="settingsForm.location" type="text" /></label>
            <label class="admin__full">Tautan Google Maps<input v-model="settingsForm.mapsUrl" type="url" placeholder="https://maps.app.goo.gl/…" /></label>
            <label class="admin__full">Pesan WhatsApp default<textarea v-model="settingsForm.whatsappMessage" rows="2"></textarea></label>
          </div>

          <h3 class="admin__subhead">Nomor telepon</h3>
          <div v-for="(phone, i) in settingsForm.phones" :key="i" class="admin__repeater">
            <input v-model="phone.label" type="text" placeholder="Label (WhatsApp)" />
            <input v-model="phone.number" type="tel" placeholder="6282145632380" />
            <input v-model="phone.display" type="text" placeholder="Tampilan (+62 821-…)" />
            <label class="admin__check"><input v-model="phone.whatsapp" type="checkbox" /> WA</label>
            <button type="button" class="is-danger" @click="settingsForm.phones.splice(i, 1)">×</button>
          </div>
          <button type="button" class="btn btn--ghost btn--sm" @click="addPhone">+ Tambah nomor</button>

          <h3 class="admin__subhead">Media sosial</h3>
          <div v-for="(social, i) in settingsForm.socials" :key="i" class="admin__repeater">
            <input v-model="social.platform" type="text" placeholder="Instagram" />
            <input v-model="social.url" type="url" placeholder="https://instagram.com/…" class="admin__span-3" />
            <button type="button" class="is-danger" @click="settingsForm.socials.splice(i, 1)">×</button>
          </div>
          <button type="button" class="btn btn--ghost btn--sm" @click="addSocial">+ Tambah media sosial</button>
        </section>
      </div>

      <!-- EDITOR PROYEK -->
      <Teleport to="body">
        <div v-if="editorOpen" class="drawer-backdrop" @click.self="closeEditor">
          <aside class="drawer" role="dialog" aria-modal="true" aria-label="Editor proyek">
            <div class="drawer__head">
              <h2>{{ editingId ? 'Ubah proyek' : 'Proyek baru' }}</h2>
              <button type="button" aria-label="Tutup" @click="closeEditor">×</button>
            </div>
            <form class="drawer__form" @submit.prevent="saveProject">
              <label>Judul acara *<input v-model="form.title" type="text" required maxlength="140" /></label>
              <div class="drawer__row">
                <label>Kategori<input v-model="form.category" type="text" placeholder="Konser" maxlength="60" /></label>
                <label>Klien<input v-model="form.client" type="text" maxlength="100" /></label>
              </div>
              <div class="drawer__row">
                <label>Lokasi<input v-model="form.location" type="text" maxlength="120" /></label>
                <label>Tanggal acara<input v-model="form.eventDate" type="date" /></label>
              </div>
              <label>Ringkasan singkat *<textarea v-model="form.excerpt" rows="3" required maxlength="300"></textarea></label>
              <label>Cerita proyek<textarea v-model="form.content" rows="6" maxlength="12000"></textarea></label>

              <label>Gambar sampul
                <select v-model="form.coverId">
                  <option value="">— Tidak ada —</option>
                  <option v-for="item in imageMedia" :key="item.id" :value="item.id">
                    {{ item.name }} · {{ formatDate(item.createdAt, { hour: '2-digit', minute: '2-digit' }) }}
                  </option>
                </select>
              </label>

              <fieldset>
                <legend>Galeri gambar</legend>
                <div class="drawer__media-grid">
                  <label
                    v-for="item in imageMedia"
                    :key="item.id"
                    class="media-choice"
                    :class="{ 'is-selected': form.galleryIds.includes(item.id) }"
                  >
                    <input v-model="form.galleryIds" type="checkbox" :value="item.id" class="sr-only" />
                    <img :src="item.thumbUrl || item.url" :alt="item.name" loading="lazy" decoding="async" />
                    <span class="media-choice__name">{{ item.name }}</span>
                    <span class="media-choice__date">
                      {{ formatDate(item.createdAt, { hour: '2-digit', minute: '2-digit' }) }}
                    </span>
                    <span class="media-choice__check" aria-hidden="true">✓</span>
                  </label>
                  <p v-if="!imageMedia.length" class="muted">Unggah gambar dulu di tab Media.</p>
                </div>
              </fieldset>

              <fieldset>
                <legend>Media lainnya</legend>
                <div class="drawer__checks">
                  <label v-for="item in fileMedia" :key="item.id" class="admin__check">
                    <input v-model="form.mediaIds" type="checkbox" :value="item.id" /> {{ item.name }}
                  </label>
                  <p v-if="!fileMedia.length" class="muted">Belum ada video atau PDF.</p>
                </div>
              </fieldset>

              <div class="drawer__row">
                <label>Status
                  <select v-model="form.status">
                    <option value="draft">Draft</option>
                    <option value="published">Dipublikasikan</option>
                  </select>
                </label>
                <label class="admin__check"><input v-model="form.featured" type="checkbox" /> Tandai sebagai unggulan</label>
              </div>

              <p v-if="error" class="admin__error" role="alert">{{ error }}</p>
              <div class="drawer__actions">
                <button type="button" class="btn btn--ghost" @click="closeEditor">Batal</button>
                <button type="submit" class="btn btn--primary" :disabled="busy">{{ busy ? 'Menyimpan…' : 'Simpan proyek' }}</button>
              </div>
            </form>
          </aside>
        </div>
      </Teleport>
    </template>
  </div>
</template>

<style scoped src="./css/AdminView.css"></style>
