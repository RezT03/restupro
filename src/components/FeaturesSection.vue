<script setup>
import { RouterLink } from 'vue-router'

const steps = [
  {
    title: 'Ceritakan kebutuhan Anda',
    text: 'Kami tanya jenis acara, lokasi, dan perkiraan jumlah tamu. Dari situ kami sarankan paket yang paling pas, bukan yang paling mahal.',
  },
  {
    title: 'Kami siapkan dan uji alat',
    text: 'Perlengkapan dicek, dibersihkan, dan diuji sebelum berangkat. Anda bisa datang melihat langsung bila mau.',
  },
  {
    title: 'Datang, pasang, dan dampingi',
    text: 'Tim kami tiba di lokasi lebih awal untuk setup. Saat acara berlangsung, kami tetap siap jika ada yang perlu disesuaikan.',
  },
  {
    title: 'Beres acara, beres alat',
    text: 'Setelah acara selesai, kami bongkar dan membawa perlengkapan kembali. Anda tidak perlu repot mengembalikan.',
  },
]
</script>

<template>
  <section id="approach" class="section approach">
    <div class="wrap approach__grid">
      <div class="approach__panel" v-reveal>
        <p class="eyebrow">02 / Cara kerja</p>
        <h2 class="h2">Tidak cuma menyewakan alat. Kami ikut memastikan acara berjalan.</h2>
        <p class="lead">
          Prosesnya sederhana dan transparan. Anda tahu apa yang Anda dapat, kapan alat tiba, dan
          siapa yang bisa dihubungi.
        </p>
        <RouterLink to="/about" class="text-link">Lebih tentang kami <span aria-hidden="true">→</span></RouterLink>
      </div>

      <ol class="approach__list">
        <li v-for="(step, i) in steps" :key="step.title" v-reveal :style="{ '--delay': `${i * 80}ms` }">
          <span class="approach__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped src="./css/FeaturesSection.css"></style>
