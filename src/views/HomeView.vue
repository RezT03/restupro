<script setup>
import HeroSection from '@/components/HeroSection.vue'
import EquipmentList from '@/components/EquipmentList.vue'
import FeaturesSection from '@/components/FeaturesSection.vue'
import ContactSection from '@/components/ContactSection.vue'
</script>

<template>
  <main class="home">
    <HeroSection />
    <EquipmentList />
    <FeaturesSection />
    <ContactSection />
  </main>
</template>

<style scoped>
.home {
  width: 100%;
}
</style>
