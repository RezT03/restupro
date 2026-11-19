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

<style scoped>
.contact {
  background: #102748;
  color: #fff;
  padding-block: var(--section-y);
}

.contact__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
  gap: clamp(2.5rem, 8vw, 8rem);
}

.contact__eyebrow {
  color: rgba(255, 255, 255, 0.65);
}

.contact__eyebrow::before {
  background: var(--accent);
}

.contact__lead h2 {
  color: #fff;
  margin-block: 1.2rem 1.4rem;
}

.contact__lead > p {
  color: rgba(255, 255, 255, 0.7);
  max-width: 46ch;
  font-size: 0.95rem;
}

.contact__cta {
  margin-top: 2rem;
}

.contact__details {
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  align-self: center;
}

.contact__row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 1rem;
  padding-block: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  align-items: baseline;
}

.contact__label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.5);
}

.contact__value {
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.contact__value:hover {
  color: #8db8ff;
}

.contact__socials {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-top: 1.6rem;
}

.contact__socials a {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  padding-bottom: 2px;
}

.contact__socials a:hover {
  color: #fff;
}

@media (max-width: 820px) {
  .contact__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .contact__row {
    grid-template-columns: 1fr;
    gap: 0.2rem;
  }

  .contact__cta {
    width: 100%;
  }
}
</style>
