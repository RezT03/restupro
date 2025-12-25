<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

onMounted(() => {
  // Check if dark mode is enabled in localStorage
  const isDarkMode = localStorage.getItem('darkMode') === 'true'
  if (isDarkMode) {
    document.documentElement.classList.add('dark-mode')
  }
})
</script>

<template>
  <Navbar />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

<style>
:root {
  --primary-color: #4081f2;
  --secondary-color: #f23d4c;
  --dark-bg: #0f0f0f;
  --light-bg: #f8f9fa;
  --text-dark: #1a1a1a;
  --text-light: #666666;
  --border-light: #e5e5e5;
}

:root.dark-mode {
  --text-dark: #ffffff;
  --text-light: #cccccc;
  --light-bg: #1a1a1a;
  --dark-bg: #0f0f0f;
  --border-light: #333333;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  color: var(--text-dark);
  background-color: #ffffff;
  line-height: 1.6;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

:root.dark-mode body {
  background-color: #0f0f0f;
}

main {
  min-height: 100vh;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  border: none;
}
</style>
