<script setup>
const equipments = [
  {
    id: 1,
    name: 'Audio System',
    image: '/images/midas.png',
    description: 'Sistem audio profesional dengan kualitas suara terbaik untuk event Anda',
    features: ['Speaker berkualitas', 'Microphone profesional', 'Mixing console'],
  },
  {
    id: 2,
    name: 'Lighting',
    image: '/images/lighting.png',
    description: 'Pencahayaan profesional untuk menciptakan suasana sempurna',
    features: ['LED lights', 'Spotlight', 'Control system'],
  },
  {
    id: 3,
    name: 'Panggung',
    image: '/images/stage.png',
    description: 'Panggung berkualitas tinggi dengan desain yang menarik',
    features: ['Modular design', 'Sturdy construction', 'Custom sizing'],
  },
  {
    id: 4,
    name: 'Generator',
    image: '/images/genset.png',
    description: 'Generator daya untuk menjamin keandalan listrik event Anda',
    features: ['Fuel efficient', 'Low noise', 'Portable'],
  },
  {
    id: 5,
    name: 'Barikade',
    image: '/images/barikade.png',
    description: 'Barisan penahan keamanan untuk kontrol kerumunan yang efektif',
    features: ['Sturdy design', 'Easy setup', 'Safety certified'],
  },
  {
    id: 6,
    name: 'LED Screen',
    image: '/images/led.png',
    description: 'Layar LED dengan resolusi tinggi untuk tampilan maksimal',
    features: ['High resolution', 'Brightness control', 'Easy installation'],
  },
]
</script>

<template>
  <section id="equipment" class="equipment-section">
    <div class="equipment-container">
      <div class="section-header">
        <h2>Perlengkapan Event Kami</h2>
        <p>Koleksi lengkap perlengkapan event berkualitas profesional</p>
      </div>

      <div class="equipment-grid">
        <div v-for="equipment in equipments" :key="equipment.id" class="equipment-card">
          <div class="equipment-image-container">
            <img :src="equipment.image" :alt="equipment.name" class="equipment-image" />
          </div>
          <div class="equipment-content">
            <h3>{{ equipment.name }}</h3>
            <p class="equipment-description">{{ equipment.description }}</p>
            <ul class="equipment-features">
              <li v-for="(feature, idx) in equipment.features" :key="idx">
                <i class="fas fa-check"></i> {{ feature }}
              </li>
            </ul>
            <button class="equipment-btn">Lihat Detail</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.equipment-section {
  padding: 6rem 0;
  background-color: #ffffff;
  transition: background-color 0.3s ease;
}

:root.dark-mode .equipment-section {
  background-color: #0f0f0f;
}

.equipment-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
  z-index: 1000;
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

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.equipment-card {
  background-color: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

:root.dark-mode .equipment-card {
  background-color: #1a1a1a;
  border-color: #333333;
}

.equipment-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary-color);
  box-shadow: 0 12px 24px rgba(64, 129, 242, 0.15);
}

.equipment-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f4ff, #f8f9fa);
  display: flex;
  align-items: center;
  justify-content: center;
}

:root.dark-mode .equipment-image-container {
  background: linear-gradient(135deg, #2a2a3a, #1f1f2e);
}

.equipment-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.equipment-content {
  padding: 2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.equipment-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.8rem;
  color: var(--text-dark);
}

.equipment-description {
  color: var(--text-light);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
  flex-grow: 1;
}

.equipment-features {
  list-style: none;
  text-align: left;
  margin-bottom: 1.5rem;
}

.equipment-features li {
  padding: 0.4rem 0;
  color: var(--text-light);
  font-size: 0.9rem;
}

.equipment-features i {
  color: var(--primary-color);
  font-weight: bold;
  margin-right: 0.6rem;
}

.equipment-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, var(--primary-color), #3568e0);
  color: #ffffff;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.equipment-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 129, 242, 0.3);
}

@media (max-width: 768px) {
  .equipment-section {
    padding: 4rem 0;
  }

  .equipment-container {
    padding: 0 1.5rem;
  }

  .section-header h2 {
    font-size: 1.8rem;
  }

  .equipment-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .equipment-image-container {
    height: 250px;
  }
}
</style>
