<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Restu Production</h3>
          <p>Penyedia perlengkapan event profesional dengan kualitas terbaik</p>
        </div>

        <div class="footer-section">
          <h4>Perlengkapan</h4>
          <ul>
            <li><a href="#equipment">Audio System</a></li>
            <li><a href="#equipment">Lighting</a></li>
            <li><a href="#equipment">Stage</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Layanan</h4>
          <ul>
            <li><a href="https://invoice.restuproduction.com" target="_blank">Cek Invoice</a></li>
            <li><a href="#features">Tentang Kami</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Hubungi Kami</h4>
          <p>Email: info@restuproduction.com</p>
          <div class="social-links">
            <a href="#" title="Instagram">Instagram</a>
            <a href="https://wa.me/6282145632380?text=Hai Restu Production. Saya sedang membutuhkan perlengkapan event, bisakah saya mendapatkan detail harga dan cara penyewaan?" title="WhatsApp" target="_blank">WhatsApp</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Restu Production. Semua hak dilindungi.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--text-dark);
  color: #ffffff;
  padding: 3rem 0 0;
  margin-top: 5rem;
  transition: background-color 0.3s ease;
}

:root.dark-mode .footer {
  background-color: #000000;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 3rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-section h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.footer-section h4 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.footer-section p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin-bottom: 0.5rem;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.8rem;
}

.footer-section a {
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.footer-section a:hover {
  color: var(--primary-color);
  padding-left: 5px;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-links a {
  display: inline-flex;
  width: 40px;
  height: 40px;
  background-color: var(--primary-color);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.social-links a:hover {
  background-color: var(--secondary-color);
  transform: translateY(-3px);
  padding-left: 0;
}

.footer-bottom {
  padding: 2rem 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-container {
    padding: 0 1.5rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
