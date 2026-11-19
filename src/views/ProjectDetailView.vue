<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { publicApi } from '@/utils/api'
import { formatDate } from '@/utils/format'
import { loadSettings, whatsappLink } from '@/utils/settings'
import { useSeo, absoluteUrl } from '@/utils/seo'
import MediaViewer from '@/components/MediaViewer.vue'
import ProjectCard from '@/components/ProjectCard.vue'

const route = useRoute()
const project = ref(null)
const related = ref([])
const loading = ref(true)
const notFound = ref(false)
const viewerIndex = ref(-1)

const gallery = computed(() => project.value?.gallery || [])
const otherMedia = computed(() => project.value?.media || [])
const fallbackCover = '/images/stage.png'
const cover = computed(() => project.value?.cover?.url || project.value?.cover || fallbackCover)
const wa = computed(() =>
  whatsappLink(undefined, `Hai Restu Production, saya tertarik dengan proyek "${project.value?.title || ''}". Bisa saya konsultasikan kebutuhan serupa?`),
)

function applySeo(item) {
  const description = item.excerpt || item.content?.slice(0, 155) || ''
  useSeo({
    title: item.title,
    description,
    path: `/project/${item.slug}`,
    image: cover.value,
    type: 'article',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: item.title,
      description,
      image: absoluteUrl(cover.value),
      datePublished: item.createdAt,
      dateModified: item.updatedAt || item.createdAt,
      author: { '@id': 'https://restuproduction.com/#organization' },
      publisher: { '@id': 'https://restuproduction.com/#organization' },
      mainEntityOfPage: absoluteUrl(`/project/${item.slug}`),
    },
  })
}

async function load(slug) {
  loading.value = true
  notFound.value = false
  project.value = null
  related.value = []
  try {
    const data = await publicApi.project(slug)
    project.value = data.project
    applySeo(data.project)
    const list = await publicApi.projects({ limit: 20 })
    related.value = (list.items || []).filter((item) => item.id !== data.project.id).slice(0, 3)
  } catch {
    notFound.value = true
    useSeo({
      title: 'Proyek tidak ditemukan',
      path: `/project/${slug}`,
      noindex: true,
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSettings()
  load(route.params.slug)
})

watch(() => route.params.slug, (slug) => slug && load(slug))
</script>

<template>
  <article class="detail">
    <div v-if="loading" class="wrap detail__loading">
      <div class="skeleton" style="height: 1rem; width: 30%"></div>
      <div class="skeleton" style="height: 4rem; width: 80%; margin-top: 1.5rem"></div>
      <div class="skeleton" style="height: 22rem; margin-top: 2.5rem"></div>
    </div>

    <div v-else-if="notFound" class="wrap detail__missing">
      <p class="eyebrow">404</p>
      <h1 class="h2">Proyek tidak ditemukan.</h1>
      <p class="lead">Tautan mungkin sudah berubah. Kembali lihat dokumentasi proyek lainnya.</p>
      <RouterLink to="/project" class="btn btn--primary">Lihat semua proyek</RouterLink>
    </div>

    <template v-else-if="project">
      <header class="detail__header">
        <div class="wrap">
          <RouterLink to="/project" class="detail__back">← Semua proyek</RouterLink>
          <p class="eyebrow">{{ project.category || 'Proyek' }}<span v-if="project.eventDate"> · {{ formatDate(project.eventDate) }}</span></p>
          <h1 class="display detail__title">{{ project.title }}</h1>
          <p v-if="project.excerpt" class="lead detail__excerpt">{{ project.excerpt }}</p>
        </div>
      </header>

      <div class="wrap detail__cover">
        <img :src="cover" :alt="project.cover?.alt || project.title" width="1400" height="800" decoding="async" />
      </div>

      <div class="wrap detail__layout">
        <div class="detail__body">
          <p class="detail__content">{{ project.content || project.excerpt }}</p>

          <div v-if="gallery.length" class="detail__gallery">
            <h2>Dokumentasi</h2>
            <div class="detail__gallery-grid">
              <button
                v-for="(image, i) in gallery"
                :key="image.id || image.url"
                type="button"
                class="detail__thumb"
                :aria-label="`Buka gambar ${i + 1}`"
                @click="viewerIndex = i"
              >
                <img :src="image.url" :alt="image.alt || project.title" loading="lazy" decoding="async" width="600" height="400" />
              </button>
            </div>
          </div>

          <div v-if="otherMedia.length" class="detail__media">
            <h2>Media lainnya</h2>
            <ul>
              <li v-for="item in otherMedia" :key="item.id">
                <a :href="item.url" target="_blank" rel="noopener noreferrer">
                  <span class="detail__media-type">{{ item.type?.split('/')[1]?.toUpperCase() || 'FILE' }}</span>
                  {{ item.name || 'Unduh media' }} <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>

          <div class="detail__cta">
            <div>
              <h3>Ingin acara Anda seperti ini?</h3>
              <p>Ceritakan kebutuhan Anda, kami bantu susun perlengkapannya.</p>
            </div>
            <a :href="wa" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
              Konsultasi <span class="btn__arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <aside class="detail__aside">
          <h2>Informasi proyek</h2>
          <dl>
            <div v-if="project.client"><dt>Klien</dt><dd>{{ project.client }}</dd></div>
            <div v-if="project.location"><dt>Lokasi</dt><dd>{{ project.location }}</dd></div>
            <div v-if="project.eventDate"><dt>Tanggal</dt><dd>{{ formatDate(project.eventDate) }}</dd></div>
            <div><dt>Kategori</dt><dd>{{ project.category || 'Proyek' }}</dd></div>
          </dl>
        </aside>
      </div>

      <section v-if="related.length" class="section detail__related">
        <div class="wrap">
          <h2 class="h2">Proyek lainnya</h2>
          <div class="detail__related-grid">
            <ProjectCard v-for="(item, i) in related" :key="item.id" :project="item" :index="i" />
          </div>
        </div>
      </section>

      <MediaViewer v-model="viewerIndex" :items="gallery" />
    </template>
  </article>
</template>

<style scoped>
.detail__loading,
.detail__missing {
  min-height: 60vh;
  padding-block: 5rem;
}

.detail__missing .lead {
  margin-block: 1rem 2rem;
}

.detail__header {
  padding-block: clamp(2.5rem, 6vw, 5rem) 2.5rem;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}

.detail__back {
  display: inline-block;
  color: var(--brand);
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
}

.detail__header .eyebrow {
  color: var(--brand);
}

.detail__title {
  margin-block: 1.1rem 1.2rem;
  max-width: 22ch;
}

.detail__excerpt {
  max-width: 65ch;
}

.detail__cover {
  margin-block: 2rem;
}

.detail__cover img {
  width: 100%;
  max-height: 520px;
  aspect-ratio: 16 / 8;
  object-fit: cover;
  border-radius: var(--radius-lg);
  background: var(--brand-soft);
}

.detail__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 270px;
  gap: clamp(2rem, 6vw, 6rem);
  padding-top: 1.5rem;
}

.detail__content {
  white-space: pre-line;
  font-size: 1.02rem;
  line-height: 1.9;
  color: var(--ink-soft);
  max-width: 68ch;
}

.detail__gallery,
.detail__media {
  margin-top: 3.5rem;
}

.detail__gallery h2,
.detail__media h2,
.detail__aside h2 {
  font-size: 1.15rem;
  margin-bottom: 1.2rem;
}

.detail__gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
}

.detail__thumb {
  border: 0;
  padding: 0;
  background: var(--brand-soft);
  border-radius: var(--radius);
  overflow: hidden;
  aspect-ratio: 4 / 3;
}

.detail__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s var(--ease);
}

.detail__thumb:hover img {
  transform: scale(1.06);
}

.detail__media ul {
  border-top: 1px solid var(--line);
}

.detail__media li {
  border-bottom: 1px solid var(--line);
}

.detail__media a {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-block: 0.9rem;
  font-size: 0.9rem;
  color: var(--brand);
}

.detail__media-type {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
  border: 1px solid var(--line);
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
}

.detail__aside {
  align-self: start;
  position: sticky;
  top: 110px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.detail__aside dl div {
  padding-block: 0.8rem;
  border-top: 1px solid var(--line);
}

.detail__aside dt {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ink-faint);
}

.detail__aside dd {
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 0.2rem;
}

.detail__cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 3.5rem;
  padding: 1.8rem;
  background: var(--brand-soft);
  border-radius: var(--radius-lg);
}

.detail__cta h3 {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

.detail__cta p {
  font-size: 0.88rem;
  color: var(--ink-soft);
}

.detail__related {
  margin-top: var(--section-y);
  border-top: 1px solid var(--line);
  padding-top: var(--section-y);
}

.detail__related h2 {
  margin-bottom: 2rem;
}

.detail__related-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

@media (max-width: 960px) {
  .detail__layout {
    grid-template-columns: 1fr;
  }

  .detail__aside {
    position: static;
    order: -1;
  }

  .detail__related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .detail__gallery-grid,
  .detail__related-grid {
    grid-template-columns: 1fr 1fr;
  }

  .detail__cta .btn {
    width: 100%;
  }
}
</style>
