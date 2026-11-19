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
            <a href="https://invoice.restuproduction.com" target="_blank" rel="noopener noreferrer">
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

<style scoped>
.footer {
  background: var(--footer-bg);
  color: var(--footer-fg);
  padding-block: clamp(4rem, 8vw, 6.5rem) 2rem;
  /* margin-top: var(--section-y); */
}

.footer__eyebrow {
  color: var(--footer-muted);
}

.footer__eyebrow::before {
  background: var(--accent);
}

.footer__top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
  gap: 3rem;
  padding-bottom: 3.5rem;
  border-bottom: 1px solid var(--footer-line);
}

.footer__line {
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 3.6vw, 3.1rem);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.045em;
  margin-block: 1.4rem 1.6rem;
}

.footer__socials {
  display: flex;
  gap: 0.75rem;
}

.footer__social {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--footer-social-border);
  border-radius: 50%;
  color: var(--footer-fg);
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease,
    transform 0.25s var(--ease);
}

.footer__social svg {
  width: 20px;
  height: 20px;
}

.footer__social--ig:hover,
.footer__social--ig:focus-visible {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
  transform: translateY(-3px);
}

.footer__social--tiktok:hover,
.footer__social--tiktok:focus-visible {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  transform: translateY(-3px);
}

.footer__mail {
  color: var(--brand);
  font-size: 0.95rem;
  border-bottom: 1px solid currentColor;
  padding-bottom: 2px;
}

.footer__cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.footer__cols h3 {
  color: var(--footer-muted);
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 1.3rem;
}

.footer__cols a {
  display: block;
  width: fit-content;
  color: var(--footer-link);
  font-size: 0.9rem;
  margin-bottom: 0.85rem;
  transition: color 0.2s ease, transform 0.25s var(--ease);
}

.footer__cols a:hover {
  color: var(--brand);
  transform: translateX(3px);
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.8rem;
  font-size: 0.78rem;
  color: var(--footer-muted);
}

@media (max-width: 820px) {
  .footer__top {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 560px) {
  .footer__cols {
    grid-template-columns: 1fr 1fr;
    row-gap: 2rem;
  }

  .footer__bottom {
    flex-direction: column;
  }
}
</style>
