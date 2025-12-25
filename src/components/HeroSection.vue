<script setup>
// import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="hero">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">
          Perlengkapan Event Profesional
          <span class="accent">Untuk Acara Sempurna Anda</span>
        </h1>
        <p class="hero-description">
          Restu Production menyediakan perlengkapan event berkualitas tinggi dengan layanan terbaik.
          Audio, lighting, stage, dan semua kebutuhan event Anda dalam satu tempat.
        </p>
        <div class="hero-cta">
          <a href="#contact" class="btn btn-primary">Hubungi Kami</a>
          <a href="#equipment" class="btn btn-secondary">Lihat Perlengkapan</a>
        </div>
      </div>
      <div class="hero-image">
        <div class="hero-shape"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 6rem 0;
  background: linear-gradient(
    to right,
    rgba(255,255,255,1) 0%,
    rgba(255, 255, 255,1) 35%,
    rgba(255,255,255,0.95) 50%,
    rgba(255,255,255,0.5) 60%,
    rgba(255,255,255,0.3) 75%,
    rgba(119, 119, 119, 0) 85%,
    transparent
  ),
  url('/images/hero.png');
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right;
}

/*  */

:root.dark-mode .hero {
  background: linear-gradient(
    to right,
    rgb(0, 0, 0) 0%,
    rgb(0, 0, 0) 35%,
    rgba(0, 0, 0, 0.95) 50%,
    rgba(73, 73, 73, 0.6) 60%,
    rgba(145, 145, 145, 0.4) 75%,
    rgba(221, 221, 221, 0) 85%,
    transparent
  ),
  url('/images/hero.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-content {
  z-index: 2;
}

.hero-title {
  font-size: 3.5rem;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--text-dark);
  font-weight: 700;
}

.accent {
  display: block;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 0.5rem;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.8;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.9rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
  border: 2px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), #3568e0);
  color: #ffffff;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(64, 129, 242, 0.3);
}

.btn-secondary {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background-color: transparent;
}

.btn-secondary:hover {
  background-color: var(--primary-color);
  color: #ffffff;
}

.hero-image {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* .hero-shape {
  position: absolute;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: blob 8s infinite;
  opacity: 0.8;
} */

.hero-icons {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.icon-box {
  width: 60px;
  height: 60px;
  background-color: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: float 3s ease-in-out infinite;
  transition: all 0.3s ease;
}

:root.dark-mode .icon-box {
  background-color: #2a2a3a;
  box-shadow: 0 4px 12px rgba(64, 129, 242, 0.2);
}

.icon-box:nth-child(1) {
  animation-delay: 0s;
}

.icon-box:nth-child(2) {
  animation-delay: 0.3s;
}

.icon-box:nth-child(3) {
  animation-delay: 0.6s;
}

.icon-box:nth-child(4) {
  animation-delay: 0.9s;
}

@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -20px) scale(1.05);
  }
  50% {
    transform: translate(0, -30px) scale(1.1);
  }
  75% {
    transform: translate(-20px, -20px) scale(1.05);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    padding: 0 1.5rem;
  }

  .hero {
    padding: 4rem 0;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-image {
    height: 300px;
  }

  .hero-shape {
    width: 250px;
    height: 250px;
  }

  .hero-cta {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
