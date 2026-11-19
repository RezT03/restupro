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

const categories = computed(() => [
  'Semua',
  ...new Set(projects.value.map((item) => item.category).filter(Boolean)),
])

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return projects.value.filter((item) => {
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
        <label class="search">
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.7" />
            <path d="m16 16 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          <span class="sr-only">Cari proyek</span>
          <input v-model="query" type="search" placeholder="Cari nama acara atau lokasi…" />
        </label>
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

<style scoped>
.projects__hero {
  padding-block: clamp(3.5rem, 8vw, 7rem) clamp(2.5rem, 5vw, 4rem);
  border-bottom: 1px solid var(--line);
  background: var(--surface);
}

.projects__hero h1 {
  margin-block: 1.2rem 1.5rem;
  max-width: 20ch;
}

.projects__hero h1 em {
  font-style: normal;
  color: var(--brand);
}

.projects__content {
  padding-block: clamp(2.5rem, 5vw, 4rem) 1rem;
}

.projects__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 2.5rem;
}

.search {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: var(--surface);
  padding: 0 0.9rem;
  min-width: min(320px, 100%);
  height: 44px;
  color: var(--ink-faint);
}

.search:focus-within {
  border-color: var(--brand);
}

.search input {
  border: 0;
  outline: 0;
  background: transparent;
  width: 100%;
  font-size: 0.88rem;
  color: var(--ink);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  border: 1px solid var(--line-strong);
  background: transparent;
  color: var(--ink-soft);
  border-radius: 99px;
  padding: 0.4rem 0.9rem;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.chip:hover {
  border-color: var(--brand);
  color: var(--brand);
}

.chip.is-active {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}

.projects__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.projects__grid :deep(.card:nth-child(3n + 2)) {
  margin-top: 1.5rem;
}

.projects__status,
.projects__empty {
  padding-block: 4rem;
  text-align: center;
  color: var(--ink-soft);
}

.projects__empty h2 {
  font-size: 1.6rem;
  margin-bottom: 0.7rem;
  color: var(--ink);
}

@media (max-width: 950px) {
  .projects__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .projects__grid :deep(.card:nth-child(3n + 2)) {
    margin-top: 0;
  }
}

@media (max-width: 620px) {
  .projects__grid {
    grid-template-columns: 1fr;
  }
}
</style>
