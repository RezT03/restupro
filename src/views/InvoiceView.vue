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
  window.open(`https://e-invoice.restuproduction.com${path}`, '_blank', 'noopener,noreferrer')
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

<style scoped src="./css/InvoiceView.css"></style>
