<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { siteSettings, whatsappLink } from '../utils/settings'

const year = new Date().getFullYear()
const wa = computed(() => whatsappLink())

// Isi tautan di sini, atau lewat Panel Admin → Kontak → Media sosial.
const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/',
  tiktok: 'https://www.tiktok.com/',
}

const socialUrl = (keyword, domain) =>
  siteSettings.value.socials?.find((item) => {
    const platform = String(item.platform).toLowerCase()
    const url = String(item.url).toLowerCase()
    return platform.includes(keyword) || url.includes(domain)
  })?.url || SOCIAL_LINKS[keyword]

const instagramUrl = computed(() => socialUrl('instagram', 'instagram.com'))
const tiktokUrl = computed(() => socialUrl('tiktok', 'tiktok.com'))
</script>

<template>
  <footer class="footer">
    <div class="wrap">
      <div class="footer__top">
        <div class="footer__intro">
          <p class="eyebrow footer__eyebrow">Restu Production</p>
          <p class="footer__line">Acara berjalan lancar,<br />kami urus alatnya.</p>
          <div class="footer__socials">
            <a
              class="footer__social footer__social--ig"
              :href="instagramUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Restu Production"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              class="footer__social footer__social--tiktok"
              :href="tiktokUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Restu Production"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.6 5.8A4.6 4.6 0 0 1 15.4 2h-3v13.1a2.6 2.6 0 1 1-2.6-2.6c.3 0 .6 0 .8.1V9.2a5.6 5.6 0 1 0 4.8 5.5V8.1a7.5 7.5 0 0 0 4.3 1.4V6.4a4.6 4.6 0 0 1-3.3-.6Z" />
              </svg>
            </a>
          </div>
        </div>

        <div class="footer__cols">
          <div>
            <h3>Jelajahi</h3>
            <RouterLink to="/">Beranda</RouterLink>
            <RouterLink to="/project">Proyek</RouterLink>
            <RouterLink to="/about">Tentang kami</RouterLink>
          </div>
          <div>
            <h3>Layanan</h3>
            <RouterLink to="/#equipment">Sewa perlengkapan</RouterLink>
            <RouterLink to="/#approach">Cara kerja</RouterLink>
            <a href="https://e-invoice.restuproduction.com" target="_blank" rel="noopener noreferrer">
              Cek invoice ↗
            </a>
          </div>
          <div>
            <h3>Terhubung</h3>
            <a v-for="item in siteSettings.socials" :key="item.url" :href="item.url" target="_blank" rel="noopener noreferrer">
              {{ item.platform }} ↗
            </a>
            <a :href="wa" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <span>© {{ year }} Restu Production. Semua hak dilindungi.</span>
        <span>{{ siteSettings.location }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped src="./css/Footer.css"></style>
