<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const invoiceNumber = ref('')
const isLoading = ref(false)

const checkInvoice = () => {
  if (!invoiceNumber.value.trim()) return

  // Redirect ke external invoice website
  window.open(`https://invoice.restuproduction.com/check/${invoiceNumber.value}`, '_blank')

  // Reset input
  invoiceNumber.value = ''
}

const goToCreateInvoice = () => {
  // Redirect ke external invoice website untuk create
  window.open('https://invoice.restuproduction.com/create', '_blank')
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    checkInvoice()
  }
}
</script>

<template>
  <div class="invoice-page">
    <div class="invoice-header">
      <h1>Kelola Invoice Anda</h1>
      <p>Buat invoice baru atau cek status invoice Anda dengan mudah</p>
    </div>

    <div class="invoice-container">
      <div class="invoice-content">
        <!-- Hero Section -->
        <div class="invoice-hero">
          <div class="hero-card create-card">
            <div class="hero-icon">📋</div>
            <h2>Buat Invoice Baru</h2>
            <p>Buat invoice untuk penyewaan perlengkapan event Anda</p>
            <button @click="goToCreateInvoice" class="btn btn-primary">Buat Invoice</button>
          </div>

          <div class="hero-card check-card">
            <div class="hero-icon">🔍</div>
            <h2>Cek Status Invoice</h2>
            <p>Cek status dan detail invoice Anda dengan nomor invoice</p>
            <button class="btn btn-secondary">Cek Sekarang</button>
          </div>
        </div>

        <!-- Check Invoice Form -->
        <div class="check-invoice-section">
          <div class="section-title">
            <h3>Cek Invoice Anda</h3>
            <p>Masukkan nomor invoice untuk melihat detail dan statusnya</p>
          </div>

          <div class="check-form">
            <div class="form-group">
              <label for="invoiceNumber">Nomor Invoice</label>
              <div class="input-wrapper">
                <input
                  v-model="invoiceNumber"
                  @keypress="handleKeyPress"
                  type="text"
                  id="invoiceNumber"
                  placeholder="Contoh: INV-2025-001"
                  class="invoice-input"
                />
                <button
                  @click="checkInvoice"
                  :disabled="!invoiceNumber.trim()"
                  class="btn btn-primary search-btn"
                >
                  {{ isLoading ? 'Mencari...' : 'Cari Invoice' }}
                </button>
              </div>
              <p class="helper-text">
                Nomor invoice dapat dilihat di email konfirmasi atau dokumen invoice Anda
              </p>
            </div>
          </div>

          <!-- Info Section -->
          <div class="info-section">
            <div class="info-card">
              <h4>📧 Butuh Bantuan?</h4>
              <p>
                Jika Anda tidak menemukan nomor invoice Anda, hubungi kami melalui email atau
                WhatsApp
              </p>
              <a href="mailto:info@restuproduction.com" class="info-link">
                info@restuproduction.com
              </a>
            </div>

            <div class="info-card">
              <h4>⏱️ Proses Invoice</h4>
              <p>Invoice biasanya diproses dalam 1-2 jam kerja setelah konfirmasi pesanan</p>
            </div>

            <div class="info-card">
              <h4>💾 Simpan Invoice</h4>
              <p>Anda dapat mengunduh invoice dalam format PDF untuk arsip Anda</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="invoice-back">
      <RouterLink to="/" class="btn btn-secondary">← Kembali ke Home</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.invoice-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--light-bg), #ffffff);
  padding: 2rem 0;
  transition: background 0.3s ease;
}

:global(.dark-mode) .invoice-page {
  background: linear-gradient(135deg, #1a1a1a, #222222);
}

.invoice-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  margin-bottom: 3rem;
}

.invoice-header h1 {
  font-size: 2.5rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  font-weight: 700;
}

:global(.dark-mode) .invoice-header h1 {
  color: #ffffff;
}

.invoice-header p {
  color: var(--text-light);
  font-size: 1.1rem;
}

:global(.dark-mode) .invoice-header p {
  color: #cccccc;
}

.invoice-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.invoice-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Hero Section */
.invoice-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.hero-card {
  background: #ffffff;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

:global(.dark-mode) .hero-card {
  background: #2a2a2a;
  border-color: #444444;
}

.hero-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 8px 24px rgba(64, 129, 242, 0.15);
  transform: translateY(-4px);
}

.hero-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-card h2 {
  font-size: 1.5rem;
  color: var(--text-dark);
  margin-bottom: 0.8rem;
}

:global(.dark-mode) .hero-card h2 {
  color: #ffffff;
}

.hero-card p {
  color: var(--text-light);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
}

:global(.dark-mode) .hero-card p {
  color: #cccccc;
}

/* Check Invoice Section */
.check-invoice-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: background 0.3s ease;
}

:global(.dark-mode) .check-invoice-section {
  background: #2a2a2a;
}

.section-title {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title h3 {
  font-size: 1.8rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

:global(.dark-mode) .section-title h3 {
  color: #ffffff;
}

.section-title p {
  color: var(--text-light);
  font-size: 1rem;
}

:global(.dark-mode) .section-title p {
  color: #cccccc;
}

.check-form {
  max-width: 600px;
  margin: 0 auto 3rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 1rem;
}

:global(.dark-mode) .form-group label {
  color: #ffffff;
}

.input-wrapper {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.invoice-input {
  flex: 1;
  min-width: 200px;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  color: var(--text-dark);
  background: #ffffff;
}

:global(.dark-mode) .invoice-input {
  background-color: #333333;
  border-color: #444444;
  color: #ffffff;
}

.invoice-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(64, 129, 242, 0.1);
}

:global(.dark-mode) .invoice-input:focus {
  box-shadow: 0 0 0 3px rgba(64, 129, 242, 0.2);
}

.search-btn {
  min-width: 150px;
  white-space: nowrap;
}

.helper-text {
  font-size: 0.85rem;
  color: var(--text-light);
  margin-top: 0.5rem;
}

:global(.dark-mode) .helper-text {
  color: #999999;
}

/* Info Section */
.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid var(--border-light);
}

:global(.dark-mode) .info-section {
  border-top-color: #444444;
}

.info-card {
  padding: 1.5rem;
  background: var(--light-bg);
  border-radius: 8px;
  transition: all 0.3s ease;
}

:global(.dark-mode) .info-card {
  background: #333333;
}

.info-card:hover {
  background: #f0f4ff;
  transform: translateY(-2px);
}

:global(.dark-mode) .info-card:hover {
  background: #3a3a4a;
}

.info-card h4 {
  font-size: 1.1rem;
  color: var(--text-dark);
  margin-bottom: 0.8rem;
}

:global(.dark-mode) .info-card h4 {
  color: #ffffff;
}

.info-card p {
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

:global(.dark-mode) .info-card p {
  color: #cccccc;
}

.info-link {
  color: var(--primary-color);
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.info-link:hover {
  opacity: 0.8;
}

.btn {
  padding: 0.9rem 2rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), #3568e0);
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 129, 242, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.invoice-back {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .invoice-page {
    padding: 1rem 0;
  }

  .invoice-header {
    padding: 0 1.5rem;
    margin-bottom: 2rem;
  }

  .invoice-header h1 {
    font-size: 1.8rem;
  }

  .invoice-header p {
    font-size: 1rem;
  }

  .invoice-container {
    padding: 0 1.5rem;
  }

  .invoice-hero {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .hero-card {
    padding: 1.5rem;
  }

  .hero-icon {
    font-size: 2.5rem;
  }

  .hero-card h2 {
    font-size: 1.3rem;
  }

  .check-invoice-section {
    padding: 1.5rem;
  }

  .section-title h3 {
    font-size: 1.5rem;
  }

  .input-wrapper {
    flex-direction: column;
  }

  .invoice-input {
    min-width: unset;
  }

  .search-btn {
    width: 100%;
  }

  .info-section {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 2rem;
  }

  .invoice-back {
    padding: 0 1.5rem;
  }
}
</style>
