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
          audio, lighting, panggung, LED screen, genset, dan barikade untuk berbagai jenis acara —
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

<style scoped>
.about__hero {
  padding-block: clamp(3.5rem, 8vw, 7rem) clamp(2.5rem, 5vw, 4rem);
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}

.about__hero h1 {
  margin-top: 1.2rem;
  max-width: 22ch;
}

.about__story {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
  gap: 3rem;
  padding-block: var(--section-y);
}

.about__story h2 {
  margin-top: 1rem;
}

.about__story-text p {
  color: var(--ink-soft);
  line-height: 1.9;
  max-width: 64ch;
}

.about__story-text p + p {
  margin-top: 1.3rem;
}

.about__values {
  background: var(--surface);
  border-block: 1px solid var(--line);
  padding-block: var(--section-y);
}

.about__values-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.about__values-grid article {
  padding: 1.8rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.about__values-grid span {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent);
}

.about__values-grid h3 {
  font-size: 1.3rem;
  margin-block: 1rem 0.6rem;
}

.about__values-grid p {
  font-size: 0.9rem;
  color: var(--ink-soft);
}

.about__closing {
  padding-block: var(--section-y);
  text-align: center;
}

.about__closing h2 {
  margin-bottom: 1rem;
}

.about__closing .lead {
  margin: 0 auto 2rem;
}

@media (max-width: 820px) {
  .about__story,
  .about__values-grid {
    grid-template-columns: 1fr;
  }
}
</style>
