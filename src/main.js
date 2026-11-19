import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { reveal } from './utils/reveal'

// Terapkan tema sebelum mount agar Navbar membaca kondisi yang benar dan tidak berkedip.
try {
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark-mode')
  }
} catch {
  /* localStorage bisa diblokir; abaikan */
}

createApp(App).use(router).directive('reveal', reveal).mount('#app')
