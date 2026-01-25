<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const isMenuOpen = ref(false)
const isDarkMode = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value

  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark-mode')
    localStorage.setItem('darkMode', 'false')
  }
}

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    isMenuOpen.value = false
  }
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <RouterLink to="/" class="navbar-logo">
        <img src="/images/RESPRO LOGO-exc.svg" alt="Restu Production" class="logo-image" />
      </RouterLink>

      <div class="menu-toggle" @click="toggleMenu">
        <span :class="{ active: isMenuOpen }"></span>
        <span :class="{ active: isMenuOpen }"></span>
        <span :class="{ active: isMenuOpen }"></span>
      </div>

      <ul class="nav-menu" :class="{ active: isMenuOpen }">
        <li class="nav-item">
          <a href="#equipment" @click.prevent="scrollToSection('equipment')" class="nav-link"
            >Perlengkapan</a
          >
        </li>
        <li class="nav-item">
          <a href="#features" @click.prevent="scrollToSection('features')" class="nav-link"
            >Keunggulan</a
          >
        </li>
        <li class="nav-item">
          <a href="#contact" @click.prevent="scrollToSection('contact')" class="nav-link">Kontak</a>
        </li>
        <!-- <li class="nav-item">
          <RouterLink to="/invoice" class="nav-link nav-cta">Invoice</RouterLink>
        </li> -->
        <li class="nav-item">
          <button
            @click="toggleDarkMode"
            class="dark-mode-toggle"
            :title="isDarkMode ? 'Light Mode' : 'Dark Mode'"
          >
            <span class="material-icons">
              {{ isDarkMode ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-light);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

:root.dark-mode .navbar {
  background-color: #1a1a1a;
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 50px;
}

.navbar-logo:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.logo-image {
  height: 100%;
  width: auto;
  max-width: 180px;
  object-fit: contain;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 5px;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background-color: var(--text-dark);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.menu-toggle span.active:nth-child(1) {
  transform: rotate(45deg) translate(10px, 10px);
}

.menu-toggle span.active:nth-child(2) {
  opacity: 0;
}

.menu-toggle span.active:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2.5rem;
  align-items: center;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: var(--text-dark);
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.nav-cta {
  background: linear-gradient(135deg, var(--primary-color), #3568e0);
  color: #ffffff !important;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.nav-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 129, 242, 0.3);
  border-bottom: none;
}

.dark-mode-toggle {
  background: none;
  border: 1px solid var(--border-light);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.dark-mode-toggle:hover {
  background-color: var(--light-bg);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 1.5rem;
  }

  .menu-toggle {
    display: flex;
  }

  .nav-menu {
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background-color: #ffffff;
    flex-direction: column;
    gap: 1rem;
    padding: 0 1.5rem;
    border-bottom: 1px solid var(--border-light);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  :root.dark-mode .nav-menu {
    background-color: #1a1a1a;
  }

  .nav-menu.active {
    max-height: 400px;
    padding: 2rem 1.5rem;
  }

  .nav-item {
    width: 100%;
  }

  .nav-link {
    display: block;
    padding: 0.8rem 0;
  }

  .nav-cta {
    display: block;
    text-align: center;
  }

  .dark-mode-toggle {
    width: 100%;
    border-radius: 6px;
  }
}
</style>
