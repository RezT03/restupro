<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useSeo } from '@/utils/seo'
import { loadSettings, siteSettings } from '@/utils/settings'

useSeo({
  title: 'Invoice',
  description: 'Buat invoice baru atau cek status invoice penyewaan perlengkapan event Restu Production.',
  path: '/invoice',
})

const invoiceNumber = ref('')
const input = ref(null)

onMounted(() => loadSettings())

function openInvoice(path) {
  window.open(`https://invoice.restuproduction.com${path}`, '_blank', 'noopener,noreferrer')
}

function checkInvoice() {
  const value = invoiceNumber.value.trim()
  if (!value) return
  openInvoice(`/check/${encodeURIComponent(value)}`)
  invoiceNumber.value = ''
}
</script>

<template>
  <div class="invoice">
    <header class="invoice__hero">
      <div class="wrap">
        <p class="eyebrow" v-reveal>Layanan invoice</p>
        <h1 class="display" v-reveal>Administrasi yang rapi,<br /><em>acara tetap fokus.</em></h1>
        <p class="lead" v-reveal>
          Buat invoice penyewaan atau cek statusnya. Sistem invoice kami berjalan di layanan terpisah
          dan akan terbuka di tab baru.
        </p>
      </div>
    </header>

    <div class="wrap invoice__body">
      <div class="invoice__cards">
        <article class="invoice__card" v-reveal>
          <span class="invoice__num">01</span>
          <h2>Buat invoice baru</h2>
          <p>Isi detail penyewaan Anda dan dapatkan invoice untuk keperluan administrasi.</p>
          <button class="btn btn--primary" type="button" @click="openInvoice('/create')">
            Buat invoice <span aria-hidden="true">↗</span>
          </button>
        </article>

        <article class="invoice__card" v-reveal>
          <span class="invoice__num">02</span>
          <h2>Cek status invoice</h2>
          <p>Masukkan nomor invoice yang dikirimkan ke email konfirmasi Anda.</p>
          <button class="btn btn--ghost" type="button" @click="input?.focus()">Cek invoice</button>
        </article>
      </div>

      <section class="invoice__check" v-reveal>
        <h2>Lacak invoice Anda</h2>
        <form class="invoice__form" @submit.prevent="checkInvoice">
          <label for="invoiceNumber" class="sr-only">Nomor invoice</label>
          <input
            id="invoiceNumber"
            ref="input"
            v-model="invoiceNumber"
            type="text"
            placeholder="Contoh: INV-2026-001"
            autocomplete="off"
          />
          <button class="btn btn--primary" type="submit" :disabled="!invoiceNumber.trim()">Cari</button>
        </form>
        <p class="muted">Nomor invoice dapat dilihat di email konfirmasi atau dokumen invoice Anda.</p>
      </section>

      <div class="invoice__help">
        <p>
          Butuh bantuan menemukan invoice?
          <a :href="`mailto:${siteSettings.email}`" class="text-link">{{ siteSettings.email }}</a>
        </p>
        <RouterLink to="/" class="text-link">← Kembali ke beranda</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.invoice__hero {
  padding-block: clamp(3.5rem, 8vw, 7rem) clamp(2.5rem, 5vw, 4rem);
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}

.invoice__hero h1 {
  margin-block: 1.2rem 1.5rem;
}

.invoice__hero h1 em {
  font-style: normal;
  color: var(--brand);
}

.invoice__body {
  padding-block: clamp(2.5rem, 5vw, 4rem) 1rem;
}

.invoice__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.invoice__card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: clamp(1.5rem, 3vw, 2.5rem);
}

.invoice__card h2 {
  font-size: 1.5rem;
  margin-block: 1.2rem 0.7rem;
}

.invoice__card p {
  color: var(--ink-soft);
  font-size: 0.9rem;
  max-width: 42ch;
  margin-bottom: 1.8rem;
}

.invoice__num {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent);
}

.invoice__check {
  margin-top: 2rem;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.invoice__check h2 {
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
}

.invoice__form {
  display: flex;
  gap: 0.7rem;
  margin-bottom: 0.9rem;
}

.invoice__form input {
  flex: 1;
  min-width: 0;
  height: 48px;
  padding-inline: 1rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--ink);
  font-size: 0.9rem;
}

.invoice__form input:focus {
  outline: 0;
  border-color: var(--brand);
}

.invoice__check .muted {
  font-size: 0.82rem;
}

.invoice__help {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
  font-size: 0.88rem;
  color: var(--ink-soft);
}

@media (max-width: 680px) {
  .invoice__cards {
    grid-template-columns: 1fr;
  }

  .invoice__form {
    flex-direction: column;
  }
}
</style>
