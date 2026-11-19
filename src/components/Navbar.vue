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
  { label: 'Proyek', to: { path: '/', hash: '#project' } },
  { label: 'Tentang', to: { path: '/', hash: '#approach' } },
  { label: 'Kontak', to: { path: '/', hash: '#contact' } },
]

/** Highlight dihitung dari posisi scroll, bukan dari hash di URL. */
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
          <svg v-if="dark" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.7" />
            <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
          </svg>
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

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid transparent;
  transition: background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
}

.nav--scrolled {
  background: var(--paper);
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom-color: var(--line);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  min-height: 78px;
}

.nav__brand {
  display: block;
  flex: none;
  transition: opacity 0.2s ease;
}

.nav__brand:hover {
  opacity: 0.72;
}

.nav__brand img {
  height: 34px;
  width: auto;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: clamp(1.25rem, 2.6vw, 2.4rem);
  margin-left: auto;
}

.nav__link {
  position: relative;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--ink-soft);
  padding-block: 0.4rem;
  transition: color 0.2s ease;
}

.nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 1.5px;
  width: 100%;
  background: var(--brand);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease);
}

.nav__link:hover,
.nav__link.is-active,
.nav__link.is-active::after,
.nav__link:hover::after {
  color: var(--brand);
}

.nav__link.is-active::after,
.nav__link:hover::after {
  transform: scaleX(1);
}

.nav__link--cta {
  color: var(--ink);
  font-weight: 600;
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
}

.nav__link--cta span {
  color: var(--accent);
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-btn {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: transparent;
  color: var(--ink-soft);
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
}

.icon-btn:hover {
  color: var(--brand);
  border-color: var(--brand);
  background: var(--brand-soft);
}

.nav__burger {
  display: none;
}

.nav__burger span {
  position: absolute;
  width: 16px;
  height: 1.5px;
  background: currentColor;
  transition: transform 0.25s ease;
}

.nav__burger span:first-child {
  transform: translateY(-3px);
}

.nav__burger span:last-child {
  transform: translateY(3px);
}

.nav__burger span:first-child.is-open {
  transform: rotate(45deg);
}

.nav__burger span:last-child.is-open {
  transform: rotate(-45deg);
}

@media (max-width: 860px) {
  .nav__burger {
    display: grid;
  }

  .nav__links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    margin: 0;
    padding: 0 var(--gutter);
    background: var(--paper);
    border-bottom: 1px solid var(--line);
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.35s var(--ease), opacity 0.25s ease, padding 0.35s var(--ease);
  }

  .nav__links.is-open {
    max-height: 420px;
    opacity: 1;
    padding-block: 1rem 1.5rem;
  }

  .nav__link {
    padding-block: 0.85rem;
    border-bottom: 1px solid var(--line);
    font-size: 1rem;
  }

  .nav__link::after {
    display: none;
  }

  .nav__link--cta {
    border-bottom: 0;
    margin-top: 0.5rem;
  }
}
</style>
