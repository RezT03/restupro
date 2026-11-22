<script setup>
defineProps({
  label: { type: String, default: 'Belum ada sampul' },
})
</script>

<template>
  <div class="blank-thumb" role="img" :aria-label="label">
    <i class="fa-solid fa-image blank-thumb__icon" aria-hidden="true"></i>
    <span>{{ label }}</span>
  </div>
</template>

<style scoped src="./css/BlankThumbnail.css"></style>
