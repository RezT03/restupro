<script setup>
import { computed, onMounted } from 'vue'
import { useSeo } from '@/utils/seo'
import { loadSettings, whatsappLink } from '@/utils/settings'

useSeo({
  title: 'Tentang Kami',
  description:
    'Kenali Restu Production: penyedia perlengkapan event di Wonosobo yang mengutamakan alat terawat, tim yang siap di lokasi, dan proses yang transparan.',
  path: '/about',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Tentang Restu Production',
    url: 'https://restuproduction.com/about',
    isPartOf: { '@id': 'https://restuproduction.com/#website' },
  },
})

onMounted(() => loadSettings())
const wa = computed(() => whatsappLink())
</script>

<template>
  <div class="about">
    <header class="about__hero">
      <div class="wrap">
        <p class="eyebrow" v-reveal>Tentang kami</p>
        <h1 class="display" v-reveal>Kami percaya acara yang baik dimulai dari persiapan yang rapi.</h1>
      </div>
    </header>

    <section class="wrap about__story">
      <div v-reveal>
        <p class="eyebrow">Siapa kami</p>
        <h2 class="h2">Restu Production</h2>
      </div>
      <div class="about__story-text" v-reveal>
        <p>
          Kami adalah penyedia perlengkapan event yang berbasis di Wonosobo. Kami menangani kebutuhan
          audio, lighting, panggung, LED screen, genset, barikade, tenda, kusri, dan perlengkapan event lainnya untuk berbagai jenis acara,
          dari konser dan festival hingga seminar dan kegiatan perusahaan.
        </p>
        <p>
          Pendekatan kami sederhana: pahami dulu kebutuhan acara, lalu siapkan alat yang memang
          diperlukan. Tim kami menemani proses dari persiapan, setup di lokasi, sampai acara selesai.
        </p>
      </div>
    </section>

    <section class="about__values">
      <div class="wrap about__values-grid">
        <article v-reveal>
          <span>01</span>
          <h3>Alat terawat</h3>
          <p>Semua unit dirawat dan diuji sebelum dikirim, supaya tidak ada kejutan saat acara berlangsung.</p>
        </article>
        <article v-reveal>
          <span>02</span>
          <h3>Harga jelas</h3>
          <p>Kami sampaikan rincian biaya di awal. Tidak ada biaya tersembunyi setelah acara selesai.</p>
        </article>
        <article v-reveal>
          <span>03</span>
          <h3>Tim di lokasi</h3>
          <p>Operator kami datang bersama alat, memasang, dan siap membantu selama acara berjalan.</p>
        </article>
      </div>
    </section>

    <section class="wrap about__closing" v-reveal>
      <h2 class="h2">Mau diskusi kebutuhan acara Anda?</h2>
      <p class="lead">Ceritakan rencana Anda. Kami bantu tentukan perlengkapan yang paling pas.</p>
      <a :href="wa" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
        Hubungi kami <span class="btn__arrow" aria-hidden="true">↗</span>
      </a>
    </section>
  </div>
</template>

<style scoped src="./css/AboutView.css"></style>
