<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { whatsappLink } from '../utils/settings'

const equipment = [
  {
    name: 'Audio System',
    image: '/images/midas.png',
    alt: 'Mixer dan sistem audio profesional',
    description: 'Suaranya jelas, dari sambutan sampai acara selesai. Mikrofon, mixer, dan speaker sudah satu paket.',
    tags: ['Mixer', 'Mikrofon', 'Speaker'],
  },
  {
    name: 'Lighting',
    image: '/images/lighting.png',
    alt: 'Rangkaian lampu panggung LED',
    description: 'Atur mood ruangan dengan pencahayaan yang pas — dari spotlight hingga efek warna.',
    tags: ['LED', 'Spotlight', 'Kontrol'],
  },
  {
    name: 'Panggung',
    image: '/images/stage.png',
    alt: 'Panggung event yang sudah dipasang',
    description: 'Rangka modular yang bisa menyesuaikan lokasi dan kebutuhan acara Anda.',
    tags: ['Modular', 'Truss', 'Custom'],
  },
  {
    name: 'Genset',
    image: '/images/genset.png',
    alt: 'Generator set untuk kebutuhan daya event',
    description: 'Cadangan daya yang tenang dan stabil agar acara tidak terhenti karena listrik.',
    tags: ['Daya stabil', 'Low noise'],
  },
  {
    name: 'Barikade',
    image: '/images/barikade.png',
    alt: 'Barikade pembatas area acara',
    description: 'Penahan kerumunan yang kokoh dan rapi untuk area konser maupun pameran.',
    tags: ['Kokoh', 'Rapi', 'Aman'],
  },
  {
    name: 'LED Screen',
    image: '/images/led.png',
    alt: 'Layar LED resolusi tinggi untuk event',
    description: 'Tampilkan visual, video, dan info acara dengan keterangan yang tetap tajam.',
    tags: ['Tajam', 'Terang', 'Mudah dipasang'],
  },
]

const track = ref(null)
const canPrev = ref(false)
const canNext = ref(true)
const percent = ref(0)
let frame

function measure() {
  const el = track.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  canPrev.value = el.scrollLeft > 4
  canNext.value = el.scrollLeft < max - 4
  percent.value = max > 0 ? (el.scrollLeft / max) * 100 : 100
  frame = undefined
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(measure)
}

function move(direction) {
  const el = track.value
  if (!el) return
  const card = el.querySelector('.equip')
  const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8
  el.scrollBy({ left: step * direction, behavior: 'smooth' })
}

function ask(item) {
  return whatsappLink(
    undefined,
    `Hai Restu Production, saya ingin bertanya tentang sewa ${item.name} untuk acara saya.`,
  )
}

onMounted(() => {
  measure()
  window.addEventListener('resize', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', onScroll)
  if (frame) cancelAnimationFrame(frame)
})

const progressStyle = computed(() => ({ width: `${Math.max(percent.value, 8)}%` }))
</script>

<template>
  <section id="equipment" class="section equipment">
    <div class="wrap">
      <div class="equipment__head" v-reveal>
        <div>
          <p class="eyebrow">01 / Perlengkapan</p>
          <h2 class="h2">Alat yang tepat,<br />suasana yang pas.</h2>
        </div>
        <div class="equipment__aside">
          <p class="muted">
            Pilih sesuai kebutuhan acara. Semua unit kami rawat dan cek sebelum dikirim ke lokasi.
          </p>
          <div class="equipment__controls">
            <button type="button" :disabled="!canPrev" aria-label="Geser ke kiri" @click="move(-1)">←</button>
            <button type="button" :disabled="!canNext" aria-label="Geser ke kanan" @click="move(1)">→</button>
          </div>
        </div>
      </div>

      <div
        ref="track"
        class="equipment__track"
        tabindex="0"
        aria-label="Daftar perlengkapan event, gunakan tombol panah untuk menggeser"
        @scroll.passive="onScroll"
        @keydown.left.prevent="move(-1)"
        @keydown.right.prevent="move(1)"
      >
        <article v-for="(item, i) in equipment" :key="item.name" class="equip" v-reveal>
          <div class="equip__media">
            <img
              :src="item.image"
              :alt="item.alt"
              :loading="i < 2 ? 'eager' : 'lazy'"
              decoding="async"
              width="560"
              height="340"
            />
            <span class="equip__index">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <div class="equip__body">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <ul class="equip__tags">
              <li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
            </ul>
            <a :href="ask(item)" target="_blank" rel="noopener noreferrer" class="equip__link">
              Tanya ketersediaan <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      </div>

      <div class="equipment__progress" aria-hidden="true">
        <span :style="progressStyle"></span>
      </div>
    </div>
  </section>
</template>

<style scoped src="./css/EquipmentList.css"></style>
