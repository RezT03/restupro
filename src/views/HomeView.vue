<script setup>
import { onMounted } from 'vue'
import HeroSection from '@/components/HeroSection.vue'
import EquipmentList from '@/components/EquipmentList.vue'
import FeaturesSection from '@/components/FeaturesSection.vue'
import ProjectPreview from '@/components/ProjectPreview.vue'
import ContactSection from '@/components/ContactSection.vue'
import { useSeo } from '@/utils/seo'
import { loadSettings } from '@/utils/settings'

useSeo({
  path: '/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Restu Production — Sewa Perlengkapan Event',
    url: 'https://restuproduction.com/',
    isPartOf: { '@id': 'https://restuproduction.com/#website' },
  },
})

onMounted(() => loadSettings())
</script>

<template>
  <div class="home">
    <HeroSection />
    <EquipmentList />
    <FeaturesSection />
    <ProjectPreview />
    <ContactSection />
  </div>
</template>
