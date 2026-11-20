<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  modelValue: { type: Number, default: -1 },
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', -1)
}

function step(direction) {
  const next = (props.modelValue + direction + props.items.length) % props.items.length
  emit('update:modelValue', next)
}

function onKey(event) {
  if (props.modelValue < 0) return
  if (event.key === 'Escape') close()
  if (event.key === 'ArrowRight') step(1)
  if (event.key === 'ArrowLeft') step(-1)
}

watch(
  () => props.modelValue,
  (value) => {
    document.body.style.overflow = value >= 0 ? 'hidden' : ''
  },
)

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue >= 0 && items[modelValue]" class="viewer" role="dialog" aria-modal="true" aria-label="Penampil gambar" @click.self="close">
      <button type="button" class="viewer__close" aria-label="Tutup" @click="close">×</button>
      <button v-if="items.length > 1" type="button" class="viewer__nav viewer__nav--prev" aria-label="Gambar sebelumnya" @click="step(-1)">←</button>
      <figure @click.self="close">
        <img :src="items[modelValue].url" :alt="items[modelValue].alt || 'Dokumentasi proyek'" />
        <figcaption>
          {{ items[modelValue].alt || 'Dokumentasi proyek' }}
          <span>{{ modelValue + 1 }} / {{ items.length }}</span>
        </figcaption>
      </figure>
      <button v-if="items.length > 1" type="button" class="viewer__nav viewer__nav--next" aria-label="Gambar berikutnya" @click="step(1)">→</button>
    </div>
  </Teleport>
</template>

<style scoped src="./css/MediaViewer.css"></style>
