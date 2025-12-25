<script setup>
const features = [
  {
    id: 1,
    title: 'Kualitas Profesional',
    description:
      'Semua perlengkapan kami adalah produk profesional yang telah terbukti kualitasnya',
    icon: 'star',
  },
  {
    id: 2,
    title: 'Harga Kompetitif',
    description: 'Dapatkan harga terbaik tanpa mengorbankan kualitas perlengkapan event Anda',
    icon: 'attach_money',
  },
  {
    id: 3,
    title: 'Tepat Waktu',
    description:
      'Kami siap mengantarkan perlengkapan ke lokasi event Anda dengan aman dan tepat waktu',
    icon: 'local_shipping',
  },
  {
    id: 4,
    title: 'Tim Profesional',
    description: 'Tim ahli kami siap membantu setup dan troubleshooting selama event Anda',
    icon: 'verified',
  },
  {
    id: 5,
    title: 'Support 24/7',
    description: 'Dukungan pelanggan siap melayani Anda kapan saja diperlukan',
    icon: 'headset_mic',
  },
  {
    id: 6,
    title: 'Garansi Kepuasan',
    description: 'Kami menjamin kepuasan Anda dengan layanan purna jual terbaik',
    icon: 'verified_user',
  },
]
</script>

<template>
  <section id="features" class="features-section">
    <div class="features-container">
      <div class="section-header">
        <h2>Mengapa Memilih Kami?</h2>
        <p>Komitmen kami adalah kesuksesan event Anda</p>
      </div>

      <div class="features-grid">
        <div v-for="feature in features" :key="feature.id" class="feature-card">
          <div class="feature-icon">
            <span class="material-icons">{{ feature.icon }}</span>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, var(--light-bg), #ffffff);
  transition: background 0.3s ease;
}

:root.dark-mode .features-section {
  background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  font-size: 2.5rem;
  color: var(--text-dark);
  margin-bottom: 0.8rem;
}

.section-header p {
  font-size: 1.1rem;
  color: var(--text-light);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

:root.dark-mode .feature-card {
  background-color: #1a1a1a;
  border-color: #333333;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--primary-color);
}

:root.dark-mode .feature-card:hover {
  box-shadow: 0 12px 24px rgba(64, 129, 242, 0.2);
}

.feature-icon {
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0f4ff, #ffffff);
  color: #4081f2;
  transition: all 0.3s ease;
}

.feature-icon .material-icons {
  font-size: 2.5rem;
  line-height: 1;
}

:root.dark-mode .feature-icon {
  background: linear-gradient(135deg, #2a3a5a, #1f2e45);
  color: #7ab8ff;
}

.feature-card:hover .feature-icon {
  background: linear-gradient(135deg, #4081f2, #3568e0);
  color: #ffffff;
  transform: scale(1.1);
}

:root.dark-mode .feature-card:hover .feature-icon {
  background: linear-gradient(135deg, #5a9fff, #4081f2);
  color: #ffffff;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: var(--text-dark);
}

.feature-card p {
  color: var(--text-light);
  line-height: 1.6;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .features-section {
    padding: 4rem 0;
  }

  .features-container {
    padding: 0 1.5rem;
  }

  .section-header h2 {
    font-size: 1.8rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-icon {
    font-size: 2.5rem;
    width: 60px;
    height: 60px;
  }
}
</style>
