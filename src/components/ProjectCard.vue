<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { formatDate, truncate } from '../utils/format'
import BlankThumbnail from './BlankThumbnail.vue'

const props = defineProps({
  project: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

// Tanpa media sampul yang dipilih, tampilkan placeholder kosong — bukan gambar
// acak dari folder aset.
const cover = computed(() => props.project.cover?.url || props.project.cover || '')
</script>

<template>
  <RouterLink :to="`/project/${project.slug}`" class="card" v-reveal>
    <div class="card__media">
      <img
        v-if="cover"
        :src="cover"
        :alt="project.cover?.alt || project.title"
        loading="lazy"
        decoding="async"
        width="800"
        height="500"
      />
      <BlankThumbnail v-else />
      <span v-if="project.featured" class="card__flag">Unggulan</span>
    </div>
    <div class="card__body">
      <div class="card__meta">
        <span>{{ project.category || 'Proyek' }}</span>
        <span v-if="project.eventDate">{{ formatDate(project.eventDate) }}</span>
      </div>
      <h3>{{ project.title }}</h3>
      <p>{{ truncate(project.excerpt || project.content, 130) }}</p>
      <span class="card__more">Baca ceritanya <span aria-hidden="true">↗</span></span>
    </div>
  </RouterLink>
</template>

<style scoped src="./css/ProjectCard.css"></style>
