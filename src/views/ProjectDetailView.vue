<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { publicApi } from '@/utils/api'
import { formatDate } from '@/utils/format'
import { loadSettings, whatsappLink } from '@/utils/settings'
import { useSeo, absoluteUrl } from '@/utils/seo'
import MediaViewer from '@/components/MediaViewer.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import BlankThumbnail from '@/components/BlankThumbnail.vue'

const route = useRoute()
const project = ref(null)
const related = ref([])
const loading = ref(true)
const notFound = ref(false)
const viewerIndex = ref(-1)

// Informasi proyek: fixed setelah posisi aslinya tercapai, memudar sebelum footer.
const asideEl = ref(null)
const asideSlot = ref(null)
const asideFixed = ref(false)
const asideHidden = ref(false)
const asideSlotHeight = ref(0)
let asideNaturalTop = 0
let asideFrame = 0
let asideNeedsMeasure = false

function measureAside() {
  const el = asideEl.value
  if (!el || asideFixed.value) return
  asideSlotHeight.value = el.offsetHeight
  asideNaturalTop = el.getBoundingClientRect().top + window.scrollY
}

function updateAside() {
  const el = asideEl.value
  if (!el || !project.value || window.innerWidth <= 960) {
    asideFixed.value = false
    asideHidden.value = false
    return
  }
  if (!asideSlotHeight.value) measureAside()

  const top = 110
  // Jangan pernah fixed sampul masih berada di area panel (mis. setelah resize
  // atau saat posisi restored), supaya panel tidak menutupi gambar proyek.
  const cover = document.querySelector('.detail__cover')
  const coverBottom = cover ? cover.getBoundingClientRect().bottom : -Infinity
  const shouldFix = window.scrollY >= asideNaturalTop - top && coverBottom <= top - 8
  asideFixed.value = shouldFix

  const footer = document.querySelector('.footer')
  const footerTop = footer ? footer.getBoundingClientRect().top : Infinity
  asideHidden.value = shouldFix && footerTop < top + asideSlotHeight.value + 24
}

function onAsideScroll() {
  if (asideFrame) return
  asideFrame = requestAnimationFrame(() => {
    asideFrame = 0
    if (asideNeedsMeasure) {
      asideNeedsMeasure = false
      asideFixed.value = false
      measureAside()
    }
    updateAside()
  })
}

function onAsideResize() {
  asideNeedsMeasure = true
  onAsideScroll()
}

const gallery = computed(() => project.value?.gallery || [])
const otherMedia = computed(() => project.value?.media || [])
// Sampul kosong tidak diisi dengan gambar acak; placeholder ditampilkan di template.
const cover = computed(() => project.value?.cover?.url || project.value?.cover || '')
const wa = computed(() =>
  whatsappLink(undefined, `Hai Restu Production, saya tertarik dengan proyek "${project.value?.title || ''}". Bisa saya konsultasikan kebutuhan serupa?`),
)

function applySeo(item) {
  const description = item.excerpt || item.content?.slice(0, 155) || ''
  useSeo({
    title: item.title,
    description,
    path: `/project/${item.slug}`,
    image: cover.value || null,
    type: 'article',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: item.title,
      description,
      ...(cover.value ? { image: absoluteUrl(cover.value) } : {}),
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
  asideFixed.value = false
  asideHidden.value = false
  asideSlotHeight.value = 0
  asideNaturalTop = 0
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
    nextTick(() => {
      measureAside()
      updateAside()
    })
  }
}

onMounted(() => {
  loadSettings()
  window.addEventListener('scroll', onAsideScroll, { passive: true })
  window.addEventListener('resize', onAsideResize, { passive: true })
  load(route.params.slug)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onAsideScroll)
  window.removeEventListener('resize', onAsideResize)
  if (asideFrame) cancelAnimationFrame(asideFrame)
})

watch(() => route.params.slug, (slug) => slug && load(slug))
</script>

<template>
  <article class="detail">
    <div v-if="loading" class="wrap detail__loading">
      <div class="skeleton skeleton--eyebrow"></div>
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--cover"></div>
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

      <div v-if="cover" class="wrap detail__cover">
        <img :src="cover" :alt="project.cover?.alt || project.title" width="1400" height="800" decoding="async" />
      </div>
      <div v-else class="wrap detail__cover detail__cover--blank">
        <BlankThumbnail :label="`Belum ada sampul untuk ${project.title}`" />
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

        <div
          ref="asideSlot"
          class="detail__aside-slot"
          :style="asideSlotHeight ? { minHeight: `${asideSlotHeight}px` } : undefined"
        >
          <aside
            ref="asideEl"
            class="detail__aside"
            :class="{ 'is-fixed': asideFixed, 'is-hidden': asideHidden }"
          >
            <h2>Informasi proyek</h2>
            <dl>
              <div v-if="project.client"><dt>Klien</dt><dd>{{ project.client }}</dd></div>
              <div v-if="project.location"><dt>Lokasi</dt><dd>{{ project.location }}</dd></div>
              <div v-if="project.eventDate"><dt>Tanggal</dt><dd>{{ formatDate(project.eventDate) }}</dd></div>
              <div><dt>Kategori</dt><dd>{{ project.category || 'Proyek' }}</dd></div>
            </dl>
          </aside>
        </div>

        <!-- Berada di dalam grid yang sama dengan aside agar aside tetap menempel
             sampai melewati bagian proyek terkait, bukan berhenti di body saja. -->
        <section v-if="related.length" class="detail__related">
          <h2 class="h2">Proyek lainnya</h2>
          <div class="detail__related-grid">
            <ProjectCard v-for="(item, i) in related" :key="item.id" :project="item" :index="i" />
          </div>
        </section>
      </div>

      <MediaViewer v-model="viewerIndex" :items="gallery" />
    </template>
  </article>
</template>

<style scoped src="./css/ProjectDetailView.css"></style>
