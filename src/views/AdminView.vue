<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { adminApi, setCsrfToken, ApiError } from '@/utils/api'
import { useSeo } from '@/utils/seo'
import { formatBytes } from '@/utils/format'
import { loadSettings, notifySettingsChanged } from '@/utils/settings'

useSeo({ title: 'Panel Kontrol', path: '/admin', noindex: true })

const checking = ref(true)
const authenticated = ref(false)
const busy = ref(false)
const error = ref('')
const notice = ref('')
const activeTab = ref('projects')
const credentials = reactive({ email: '', password: '' })

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
    const data = await adminApi.login(credentials.email.trim(), credentials.password)
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

const imageMedia = computed(() => media.value.filter((item) => item.type?.startsWith('image/')))
const fileMedia = computed(() => media.value.filter((item) => !item.type?.startsWith('image/')))
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
        <p class="eyebrow">Area terbatas</p>
        <h1 class="h2">Panel Kontrol</h1>
        <p class="muted">Masuk untuk mengelola proyek, media, dan informasi kontak situs.</p>
        <form @submit.prevent="login">
          <label>Email
            <input v-model="credentials.email" type="email" autocomplete="username" required placeholder="admin@domain.com" />
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
                  <option v-for="item in imageMedia" :key="item.id" :value="item.id">{{ item.name }}</option>
                </select>
              </label>

              <fieldset>
                <legend>Galeri gambar</legend>
                <div class="drawer__checks">
                  <label v-for="item in imageMedia" :key="item.id" class="admin__check">
                    <input v-model="form.galleryIds" type="checkbox" :value="item.id" /> {{ item.name }}
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

<style scoped>
.admin {
  min-height: 100vh;
}

.admin__center {
  display: grid;
  place-items: center;
  min-height: 70vh;
  color: var(--ink-soft);
}

.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1.25rem;
  background: var(--paper);
}

.login__panel {
  width: min(100%, 420px);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 2.2rem;
}

.login__panel img {
  margin-bottom: 2rem;
}

.login__panel h1 {
  margin-block: 0.8rem 0.5rem;
}

.login__panel > .muted {
  font-size: 0.88rem;
  margin-bottom: 1.8rem;
}

.login__panel form {
  display: grid;
  gap: 1rem;
}

.login__back {
  display: inline-block;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--brand);
}

.admin__header {
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}

.admin__header-inner {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.admin__header-inner > div {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin__badge {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  color: var(--brand);
  border-left: 1px solid var(--line);
  padding-left: 1rem;
}

.admin__header-actions {
  gap: 1.2rem !important;
}

.admin__body {
  padding-block: 2.5rem 5rem;
}

.admin__tabs {
  display: flex;
  gap: 1.5rem;
  border-bottom: 1px solid var(--line);
  margin-bottom: 2.5rem;
}

.admin__tabs button {
  background: none;
  border: 0;
  border-bottom: 2px solid transparent;
  padding: 0.8rem 0;
  color: var(--ink-soft);
  font-weight: 600;
  font-size: 0.9rem;
}

.admin__tabs button.is-active {
  color: var(--brand);
  border-bottom-color: var(--brand);
}

.admin__panel-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.8rem;
}

.admin__panel-head h1 {
  margin-bottom: 0.4rem;
}

.admin__panel-head p {
  font-size: 0.88rem;
}

.admin__table-wrap {
  overflow-x: auto;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.admin__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.86rem;
  min-width: 640px;
}

.admin__table th,
.admin__table td {
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid var(--line);
}

.admin__table th {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
}

.admin__table td small {
  display: block;
  color: var(--ink-faint);
  font-size: 0.72rem;
}

.admin__row-actions {
  white-space: nowrap;
}

.admin__row-actions button,
.media-item__actions button {
  background: none;
  border: 0;
  color: var(--brand);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
}

button.is-danger {
  color: var(--accent) !important;
}

.admin__status {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.25rem 0.55rem;
  border-radius: 3px;
  border: 1px solid var(--line-strong);
}

.admin__status.is-published {
  color: #1c8a54;
  border-color: #1c8a54;
}

.admin__empty {
  text-align: center !important;
  color: var(--ink-faint);
  padding: 2.5rem !important;
}

.dropzone {
  display: grid;
  place-items: center;
  gap: 0.4rem;
  border: 1.5px dashed var(--line-strong);
  border-radius: var(--radius-lg);
  padding: 2.5rem 1rem;
  text-align: center;
  cursor: pointer;
  background: var(--surface);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.dropzone:hover {
  border-color: var(--brand);
  background: var(--brand-soft);
}

.dropzone input {
  display: none;
}

.dropzone small {
  color: var(--ink-faint);
  font-size: 0.78rem;
}

.admin__media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.media-item {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);
}

.media-item__preview {
  aspect-ratio: 4 / 3;
  background: var(--brand-soft);
  display: grid;
  place-items: center;
}

.media-item__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-item__file {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--brand);
}

.media-item__info {
  padding: 0.8rem;
}

.media-item__info strong {
  display: block;
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.media-item__info small {
  color: var(--ink-faint);
  font-size: 0.68rem;
}

.media-item__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--ink-soft);
}

input[type='text'],
input[type='email'],
input[type='url'],
input[type='tel'],
input[type='date'],
input[type='password'],
select,
textarea {
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  padding: 0.6rem 0.7rem;
  font-size: 0.86rem;
  color: var(--ink);
  width: 100%;
  font-weight: 400;
}

input:focus,
select:focus,
textarea:focus {
  outline: 0;
  border-color: var(--brand);
}

.admin__form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.admin__full {
  grid-column: 1 / -1;
}

.admin__subhead {
  font-size: 1rem;
  margin: 2rem 0 0.8rem;
}

.admin__repeater {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.4fr auto auto;
  gap: 0.6rem;
  align-items: center;
  margin-bottom: 0.6rem;
}

.admin__repeater:has(.admin__span-3),
.admin__repeater:has(.admin__check) {
  grid-template-columns: 1fr 2fr auto auto;
}

.admin__check {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  font-size: 0.8rem;
}

.admin__check input,
input[type='checkbox'] {
  width: auto;
}

.admin__error {
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius);
  font-size: 0.85rem;
  margin-block: 1rem;
}

.admin__notice {
  background: var(--brand-soft);
  color: var(--brand);
  border: 1px solid color-mix(in srgb, var(--brand) 30%, transparent);
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius);
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 250;
  background: rgba(8, 12, 20, 0.55);
  display: flex;
  justify-content: flex-end;
}

.drawer {
  width: min(100%, 580px);
  height: 100%;
  overflow-y: auto;
  background: var(--paper);
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.15);
}

.drawer__head {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.5rem;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}

.drawer__head h2 {
  font-size: 1.2rem;
}

.drawer__head button {
  background: none;
  border: 0;
  font-size: 1.6rem;
  color: var(--ink-soft);
}

.drawer__form {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
}

.drawer__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.drawer fieldset {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1rem;
}

.drawer legend {
  font-size: 0.78rem;
  font-weight: 700;
  padding-inline: 0.4rem;
}

.drawer__checks {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 1.2rem;
  max-height: 170px;
  overflow-y: auto;
}

.drawer__checks .muted {
  font-size: 0.8rem;
}

.drawer__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  padding-bottom: 2rem;
}

@media (max-width: 700px) {
  .admin__form-grid,
  .drawer__row {
    grid-template-columns: 1fr;
  }

  .admin__repeater,
  .admin__repeater:has(.admin__span-3),
  .admin__repeater:has(.admin__check) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
