<script setup>
import { computed, onMounted, ref } from 'vue'
import { useSeo } from '@/utils/seo'
import { publicApi } from '@/utils/api'
import { loadSettings } from '@/utils/settings'
import ProjectCard from '@/components/ProjectCard.vue'

useSeo({
  title: 'Proyek',
  description:
    'Lihat dokumentasi acara yang telah ditangani Restu Production: konser, seminar, pameran, dan acara lainnya di Wonosobo dan sekitarnya.',
  path: '/project',
  image: '/images/stage.png',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Proyek Restu Production',
    url: 'https://restuproduction.com/project',
    isPartOf: { '@id': 'https://restuproduction.com/#website' },
  },
})

const projects = ref([])
const loading = ref(true)
const failed = ref(false)
const query = ref('')
const category = ref('Semua')
const sort = ref('newest')

const categories = computed(() => [
  'Semua',
  ...new Set(projects.value.map((item) => item.category).filter(Boolean)),
])

/** Tanggal acara (bukan tanggal input) dipakai sebagai dasar urutan. */
const sorted = computed(() => {
  const direction = sort.value === 'oldest' ? 1 : -1
  return [...projects.value].sort((a, b) => {
    const dateA = String(a.eventDate || '')
    const dateB = String(b.eventDate || '')
    // Proyek tanpa tanggal acara selalu diletakkan di akhir, berapa pun arah urutannya.
    if (!dateA && !dateB) return 0
    if (!dateA) return 1
    if (!dateB) return -1
    const byDate = dateA.localeCompare(dateB)
    if (byDate) return byDate * direction
    // Tanggal sama → yang lebih baru dibuat muncul lebih dulu.
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
  })
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return sorted.value.filter((item) => {
    const matchCategory = category.value === 'Semua' || item.category === category.value
    const haystack = `${item.title} ${item.excerpt} ${item.location || ''} ${item.client || ''}`.toLowerCase()
    return matchCategory && (!q || haystack.includes(q))
  })
})

onMounted(async () => {
  loadSettings()
  try {
    const data = await publicApi.projects({ limit: 60 })
    projects.value = data.items || []
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="projects">
    <header class="projects__hero">
      <div class="wrap">
        <p class="eyebrow" v-reveal>Karya kami</p>
        <h1 class="display" v-reveal>Setiap acara punya cerita.<br /><em>Ini beberapa di antaranya.</em></h1>
        <p class="lead" v-reveal>
          Dokumentasi proyek yang kami dukung, mulai dari konser dan festival sampai seminar dan
          acara company. Pilih kategori atau cari berdasarkan nama acara.
        </p>
      </div>
    </header>

    <section class="wrap projects__content">
      <div class="projects__tools" v-reveal>
        <div class="projects__controls">
          <label class="search">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.7" />
              <path d="m16 16 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
            <span class="sr-only">Cari proyek</span>
            <input v-model="query" type="search" placeholder="Cari nama acara atau lokasi…" />
          </label>
          <label class="sort">
            <span class="sr-only">Urutkan berdasarkan tanggal acara</span>
            <select v-model="sort">
              <option value="newest">Tanggal acara: terbaru</option>
              <option value="oldest">Tanggal acara: terlama</option>
            </select>
            <span class="sort__caret" aria-hidden="true">▾</span>
          </label>
        </div>
        <div class="chips" role="group" aria-label="Filter kategori">
          <button
            v-for="item in categories"
            :key="item"
            type="button"
            class="chip"
            :class="{ 'is-active': category === item }"
            :aria-pressed="category === item"
            @click="category = item"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <p v-if="loading" class="projects__status">Memuat dokumentasi proyek…</p>
      <p v-else-if="failed" class="projects__status">
        Dokumentasi belum bisa dimuat. Silakan coba beberapa saat lagi atau
        <a href="/#contact" class="text-link">hubungi kami</a>.
      </p>

      <div v-else-if="filtered.length" class="projects__grid">
        <ProjectCard v-for="(project, i) in filtered" :key="project.id" :project="project" :index="i" />
      </div>

      <div v-else class="projects__empty">
        <h2>{{ projects.length ? 'Tidak ada proyek yang cocok.' : 'Belum ada proyek dipublikasikan.' }}</h2>
        <p>
          {{ projects.length ? 'Coba kata kunci atau kategori lain.' : 'Tim kami sedang menyiapkan dokumentasi proyek terbaru.' }}
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped src="./css/ProjectView.css"></style>
