<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { whatsappLink } from '../utils/settings'

const wa = computed(() =>
  whatsappLink(undefined, 'Hai Restu Production, saya ingin konsultasi perlengkapan untuk acara saya.'),
)

const marquee = ['Audio System', 'Lighting', 'Panggung & Truss', 'LED Screen', 'Genset', 'Barikade']

const facts = [
  { value: '6', label: 'kategori perlengkapan' },
  { value: '1', label: 'tempat, semua kebutuhan' },
  { value: '✓', label: 'tim setup di lokasi' },
]
</script>

<template>
  <section class="hero">
    <div class="wrap hero__grid">
      <div class="hero__copy" v-reveal>
        <p class="eyebrow">Sewa perlengkapan event · Wonosobo</p>
        <h1 class="display hero__title">
          Fokus ke acara Anda.<br /><em>Urusan alat, serahkan pada kami.</em>
        </h1>
        <p class="lead hero__lead">
          Dari tata suara sampai panggung, Restu Production menyiapkan perlengkapan event yang
          sesuai kebutuhan — lengkap, terawat, dan siap pakai saat Anda membutuhkannya.
        </p>
        <div class="hero__actions">
          <a :href="wa" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
            Konsultasi gratis <span class="btn__arrow" aria-hidden="true">↗</span>
          </a>
          <RouterLink to="/project" class="btn btn--ghost">Lihat hasil kerja kami</RouterLink>
        </div>
        <dl class="hero__facts">
          <div v-for="fact in facts" :key="fact.label">
            <dt>{{ fact.value }}</dt>
            <dd>{{ fact.label }}</dd>
          </div>
        </dl>
      </div>

      <div class="hero__visual" v-reveal>
        <div class="hero__frame">
          <img
            src="/images/hero.png"
            alt="Tata suara dan perlengkapan panggung yang disiapkan Restu Production"
            width="752"
            height="502"
            fetchpriority="high"
            decoding="async"
          />
        </div>
        <div class="hero__tag">
          <span class="hero__dot" aria-hidden="true"></span>
          <div>
            <strong>Siap pakai</strong>
            <small>Setiap alat dicek sebelum acara</small>
          </div>
        </div>
        <p class="hero__caption">Dokumentasi perlengkapan Restu Production</p>
      </div>
    </div>

    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        <span v-for="(item, i) in [...marquee, ...marquee]" :key="`${item}-${i}`">
          {{ item }} <b>◆</b>
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped src="./css/HeroSection.css"></style>
