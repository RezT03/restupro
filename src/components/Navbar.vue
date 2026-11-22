<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const menuOpen = ref(false)
const dark = ref(false)
const scrolled = ref(false)
const activeSection = ref('')

const SECTION_IDS = ['equipment', 'approach', 'project', 'contact']

const links = [
  { label: 'Beranda', to: '/' },
  { label: 'Perlengkapan', to: { path: '/', hash: '#equipment' } },
  { label: 'Tentang', to: { path: '/', hash: '#approach' } },
  { label: 'Proyek', to: { path: '/', hash: '#project' } },
  { label: 'Kontak', to: { path: '/', hash: '#contact' } },
]

const isActive = (to) => {
  if (route.path !== '/') return typeof to === 'string' && route.path === to
  if (typeof to === 'string') return to === '/' && activeSection.value === 'home'
  return activeSection.value === String(to.hash || '').replace('#', '')
}

function updateActiveSection() {
  if (route.path !== '/') {
    activeSection.value = ''
    return
  }

  const offset = 120 // tinggi nav sticky + sedikit ruang
  let current = 'home'
  let lastVisible = 'home'

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    lastVisible = id
    if (el.getBoundingClientRect().top <= offset) current = id
  }

  // Saat halaman digulir sampai bawah (termasuk area footer),
  // section terakhir yang tetap disorot.
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
  activeSection.value = atBottom ? lastVisible : current
}

/** Supaya highlight langsung berpindah saat menu diklik, sebelum scroll selesai. */
function activateTarget(to) {
  if (typeof to === 'string') {
    activeSection.value = to === '/' ? 'home' : ''
  } else {
    activeSection.value = String(to.hash || '').replace('#', '') || 'home'
  }
}

let frame

onMounted(() => {
  dark.value = document.documentElement.classList.contains('dark-mode')
  window.addEventListener('scroll', onScroll, { passive: true })
  nextTick(updateActiveSection)
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (frame) cancelAnimationFrame(frame)
})

watch(
  () => route.path,
  () => nextTick(updateActiveSection),
)

function onScroll() {
  scrolled.value = window.scrollY > 12
  if (!frame) {
    frame = requestAnimationFrame(() => {
      frame = undefined
      updateActiveSection()
    })
  }
}

function toggleTheme() {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark-mode', dark.value)
  localStorage.setItem('darkMode', String(dark.value))
}
</script>

<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled }">
    <div class="wrap nav__inner">
      <RouterLink to="/" class="nav__brand" aria-label="Restu Production, ke beranda" @click="menuOpen = false">
        <img src="/images/RESPRO LOGO-exc.svg" alt="Restu Production" width="126" height="43" />
      </RouterLink>

      <nav class="nav__links" :class="{ 'is-open': menuOpen }" aria-label="Navigasi utama">
        <RouterLink
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          class="nav__link"
          :class="{ 'is-active': isActive(link.to) }"
          @click="activateTarget(link.to); menuOpen = false"
        >
          {{ link.label }}
        </RouterLink>
        <RouterLink
          class="nav__link nav__link--cta"
          :to="{ path: '/', hash: '#contact' }"
          @click="activateTarget({ path: '/', hash: '#contact' }); menuOpen = false"
        >
          Konsultasi <span aria-hidden="true">↗</span>
        </RouterLink>
      </nav>

      <div class="nav__actions">
        <button
          class="icon-btn"
          type="button"
          :aria-label="dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'"
          :title="dark ? 'Mode terang' : 'Mode gelap'"
          @click="toggleTheme"
        >
          <i v-if="dark" class="fa-solid fa-sun" aria-hidden="true"></i>
          <i v-else class="fa-solid fa-moon" aria-hidden="true"></i>
        </button>
        <button
          class="icon-btn nav__burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-label="Buka menu"
          @click="menuOpen = !menuOpen"
        >
          <span :class="{ 'is-open': menuOpen }"></span>
          <span :class="{ 'is-open': menuOpen }"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped src="./css/Navbar.css"></style>
