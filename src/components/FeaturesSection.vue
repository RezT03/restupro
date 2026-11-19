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

<style scoped>
.approach__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(2rem, 7vw, 7rem);
}

.approach__panel {
  position: sticky;
  top: 110px;
  align-self: start;
  min-width: 0;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: clamp(1.5rem, 3vw, 2.5rem);
}

.approach__panel h2 {
  margin-block: 1.2rem 1.5rem;
  max-width: 18ch;
}

.approach__panel .text-link {
  margin-top: 2rem;
}

.approach__list li {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 1rem;
  padding-block: 1.8rem;
  border-top: 1px solid var(--line);
}

.approach__list li:last-child {
  border-bottom: 1px solid var(--line);
}

.approach__num {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent);
  padding-top: 0.25rem;
}

.approach__list h3 {
  font-size: 1.25rem;
  margin-bottom: 0.55rem;
}

.approach__list p {
  color: var(--ink-soft);
  font-size: 0.92rem;
  max-width: 54ch;
}

@media (max-width: 880px) {
  .approach__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .approach__panel {
    position: static;
  }

  .approach__panel h2 {
    max-width: none;
  }
}
</style>
