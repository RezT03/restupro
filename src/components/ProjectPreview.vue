<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { publicApi } from '../utils/api'
import ProjectCard from './ProjectCard.vue'

const projects = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await publicApi.projects({ limit: 3, featured: 'all' })
    projects.value = data.items || []
  } catch {
    projects.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section id="project" class="section preview">
    <div class="wrap">
      <div class="preview__head" v-reveal>
        <div>
          <p class="eyebrow">03 / Proyek</p>
          <h2 class="h2">Pekerjaan yang sudah kami handle.</h2>
        </div>
        <RouterLink to="/project" class="text-link">Semua proyek <span aria-hidden="true">→</span></RouterLink>
      </div>

      <div v-if="loading" class="preview__grid" aria-label="Memuat proyek">
        <div v-for="n in 3" :key="n">
          <div class="skeleton" style="aspect-ratio: 16/10"></div>
          <div class="skeleton" style="height: 1.2rem; width: 60%; margin-top: 1rem"></div>
          <div class="skeleton" style="height: 0.9rem; width: 90%; margin-top: 0.8rem"></div>
        </div>
      </div>

      <div v-else-if="projects.length" class="preview__grid">
        <ProjectCard v-for="(project, i) in projects" :key="project.id" :project="project" :index="i" />
      </div>

      <div v-else class="preview__empty" v-reveal>
        <p class="preview__empty-mark">—</p>
        <h3>Portofolio sedang disiapkan</h3>
        <p>
          Dokumentasi proyek akan tampil di sini setelah tim kami mempublikasikannya. Sementara itu,
          langsung saja konsultasikan kebutuhan acara Anda.
        </p>
        <RouterLink to="/#contact" class="btn btn--ghost">Hubungi kami</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.preview {
  background: var(--paper);
  scroll-margin-top: 90px;
}

.preview__head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2.8rem;
}

.preview__head h2 {
  margin-top: 1.1rem;
}

.preview__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.preview__empty {
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-lg);
  padding: clamp(2rem, 5vw, 4rem);
  text-align: center;
}

.preview__empty-mark {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--accent);
}

.preview__empty h3 {
  font-size: 1.5rem;
  margin-block: 0.5rem 0.8rem;
}

.preview__empty p:not(.preview__empty-mark) {
  color: var(--ink-soft);
  max-width: 46ch;
  margin: 0 auto 1.5rem;
  font-size: 0.92rem;
}

@media (max-width: 900px) {
  .preview__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .preview__head {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .preview__grid {
    grid-template-columns: 1fr;
  }
}
</style>
