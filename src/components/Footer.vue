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
              <i class="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
            <a
              class="footer__social footer__social--tiktok"
              :href="tiktokUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Restu Production"
            >
              <i class="fa-brands fa-tiktok" aria-hidden="true"></i>
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
