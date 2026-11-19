<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { loadSettings } from './utils/settings'

const route = useRoute()
const bare = computed(() => Boolean(route.meta.bare))
const progress = ref(0)
let ticking = false

function updateProgress() {
  const height = document.documentElement.scrollHeight - window.innerHeight
  progress.value = height > 0 ? Math.min((window.scrollY / height) * 100, 100) : 0
  ticking = false
}

function onScroll() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(updateProgress)
  }
}

/** ScrollBehavior router kelewatan saat pindah halaman + transisi, jadi dibantu di sini. */
function scrollToHash() {
  if (!route.hash) return
  const id = decodeURIComponent(route.hash.slice(1))
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 84
  if (Math.abs(window.scrollY - top) < 4) return
  window.scrollTo({ top, behavior: 'smooth' })
}

let hashTimer

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    scrollToHash()
    clearTimeout(hashTimer)
    // Tunggu transisi halaman selesai sebelum elemen tujuan tersedia.
    hashTimer = setTimeout(scrollToHash, 300)
  },
)

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  updateProgress()
  loadSettings()
  scrollToHash()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  clearTimeout(hashTimer)
})
</script>

<template>
  <a class="skip-link" href="#main">Lewati ke konten</a>
  <div class="scroll-progress" :style="{ transform: `scaleX(${progress / 100})` }" aria-hidden="true" />

  <Navbar v-if="!bare" />

  <main id="main">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>

  <Footer v-if="!bare" />
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  inset: 0 0 auto;
  height: 2px;
  z-index: 120;
  background: var(--brand);
  transform-origin: left center;
  pointer-events: none;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
}
</style>
