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

<style scoped>
.equipment {
  background: var(--surface);
  border-block: 1px solid var(--line);
}

.equipment__head {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2rem;
  align-items: end;
  margin-bottom: 2.8rem;
}

.equipment__head h2 {
  margin-top: 1.1rem;
}

.equipment__aside {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  padding-bottom: 0.25rem;
}

.equipment__aside p {
  font-size: 0.92rem;
  max-width: 34ch;
}

.equipment__controls {
  display: flex;
  gap: 0.5rem;
  flex: none;
}

.equipment__controls button {
  width: 42px;
  height: 42px;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  background: transparent;
  color: var(--ink);
  font-size: 1.05rem;
  transition: all 0.2s ease;
}

.equipment__controls button:hover:not(:disabled) {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}

.equipment__controls button:disabled {
  opacity: 0.32;
  cursor: not-allowed;
}

.equipment__track {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 1px;
  padding-bottom: 1.1rem;
  scrollbar-width: none;
}

.equipment__track::-webkit-scrollbar {
  display: none;
}

.equip {
  flex: 0 0 clamp(260px, 30vw, 350px);
  display: flex;
  flex-direction: column;
  scroll-snap-align: start;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--paper);
  transition: border-color 0.3s ease, transform 0.4s var(--ease);
}

.equip:hover {
  border-color: var(--brand);
  transform: translateY(-4px);
}

.equip:nth-child(even) {
  margin-top: 1.4rem;
}

.equip__media {
  position: relative;
  height: 190px;
  overflow: hidden;
  background: var(--brand-soft);
}

.equip__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease);
}

.equip:hover .equip__media img {
  transform: scale(1.06);
}

.equip__index {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
  background: var(--surface);
  border-radius: 3px;
  padding: 0.2rem 0.5rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--brand);
}

.equip__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1.4rem;
}

.equip__body h3 {
  font-size: 1.18rem;
  margin-bottom: 0.6rem;
}

.equip__body p {
  font-size: 0.86rem;
  color: var(--ink-soft);
  min-height: 4.2em;
}

.equip__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-block: 1.1rem;
}

.equip__tags li {
  font-size: 0.68rem;
  padding: 0.22rem 0.55rem;
  border: 1px solid var(--line);
  border-radius: 99px;
  color: var(--ink-faint);
}

.equip__link {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
  align-self: flex-start;
  margin-top: auto;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--brand);
}

.equip__link span {
  transition: transform 0.25s var(--ease);
}

.equip__link:hover span {
  transform: translate(3px, -3px);
}

.equipment__progress {
  height: 2px;
  background: var(--line);
  margin-top: 0.5rem;
}

.equipment__progress span {
  display: block;
  height: 100%;
  background: var(--accent);
  transition: width 0.15s linear;
}

@media (max-width: 820px) {
  .equipment__head {
    grid-template-columns: 1fr;
    gap: 1.4rem;
  }

  .equipment__aside {
    align-items: center;
  }

  .equip {
    flex-basis: min(78vw, 320px);
  }
}

@media (max-width: 480px) {
  .equipment__aside {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .equip:nth-child(even) {
    margin-top: 0;
  }
}
</style>
