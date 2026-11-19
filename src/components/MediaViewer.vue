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

<style scoped>
.viewer {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(8, 12, 20, 0.94);
  display: grid;
  place-items: center;
  padding: 4rem 1.5rem 2rem;
}

.viewer figure {
  margin: 0;
  max-width: min(1100px, 100%);
  width: 100%;
}

.viewer img {
  width: 100%;
  max-height: 78vh;
  object-fit: contain;
  border-radius: 4px;
}

.viewer figcaption {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  margin-top: 0.8rem;
}

.viewer__close,
.viewer__nav {
  position: absolute;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 1.3rem;
  display: grid;
  place-items: center;
  transition: background-color 0.2s ease;
}

.viewer__close:hover,
.viewer__nav:hover {
  background: var(--brand);
}

.viewer__close {
  top: 1.2rem;
  right: 1.2rem;
}

.viewer__nav {
  top: 50%;
  transform: translateY(-50%);
}

.viewer__nav--prev {
  left: 1.2rem;
}

.viewer__nav--next {
  right: 1.2rem;
}

@media (max-width: 640px) {
  .viewer__nav {
    top: auto;
    bottom: 1.2rem;
    transform: none;
  }
}
</style>
