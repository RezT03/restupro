<script setup>
defineProps({
  label: { type: String, default: 'Belum ada sampul' },
})
</script>

<template>
  <div class="blank-thumb" role="img" :aria-label="label">
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="8" y="12" width="48" height="40" rx="5" />
      <circle cx="23" cy="26" r="4" />
      <path d="M13 46l13-13 9 9 7-7 9 11" />
    </svg>
    <span>{{ label }}</span>
  </div>
</template>

<style scoped src="./css/BlankThumbnail.css"></style>
