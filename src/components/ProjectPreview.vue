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
          <div class="skeleton skeleton--thumb"></div>
          <div class="skeleton skeleton--heading"></div>
          <div class="skeleton skeleton--text"></div>
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

<style scoped src="./css/ProjectPreview.css"></style>
