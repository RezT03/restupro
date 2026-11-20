<script setup>
import { computed } from 'vue'
import { siteSettings, whatsappLink } from '../utils/settings'

const wa = computed(() => whatsappLink())
const phoneList = computed(() => siteSettings.value.phones || [])
</script>

<template>
  <section id="contact" class="contact">
    <div class="wrap contact__grid">
      <div class="contact__lead" v-reveal>
        <p class="eyebrow contact__eyebrow">04 / Kontak</p>
        <h2 class="h2">Ceritakan acara Anda.<br />Kami bantu siapkan alatnya.</h2>
        <p>
          Konsultasi awal tidak berbayar. Sebutkan tanggal dan lokasi acara, kami akan bantu
          menyesuaikan perlengkapan yang dibutuhkan.
        </p>
        <a :href="wa" target="_blank" rel="noopener noreferrer" class="btn btn--light contact__cta">
          Chat via WhatsApp <span class="btn__arrow" aria-hidden="true">↗</span>
        </a>
      </div>

      <div class="contact__details" v-reveal>
        <div class="contact__row">
          <span class="contact__label">Email</span>
          <a :href="`mailto:${siteSettings.email}`" class="contact__value">{{ siteSettings.email }}</a>
        </div>
        <div v-for="phone in phoneList" :key="phone.number" class="contact__row">
          <span class="contact__label">{{ phone.label || 'Telepon' }}</span>
          <a
            v-if="phone.whatsapp"
            :href="`https://wa.me/${String(phone.number).replace(/\D/g, '')}`"
            target="_blank"
            rel="noopener noreferrer"
            class="contact__value"
          >
            {{ phone.display || phone.number }}
          </a>
          <a v-else :href="`tel:${phone.number}`" class="contact__value">
            {{ phone.display || phone.number }}
          </a>
        </div>
        <div class="contact__row">
          <span class="contact__label">Lokasi</span>
          <a :href="siteSettings.mapsUrl" target="_blank" rel="noopener noreferrer" class="contact__value">
            {{ siteSettings.location }} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div v-if="siteSettings.socials?.length" class="contact__socials">
          <a
            v-for="social in siteSettings.socials"
            :key="social.url"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ social.platform }} ↗
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped src="./css/ContactSection.css"></style>
