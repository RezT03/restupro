<script setup>
// import { RouterLink } from 'vue-router'
</script>

<template>
  <section id="contact" class="contact-section">
    <div class="contact-container">
      <div class="contact-content">
        <h2>Siap untuk mengadakan Acara?</h2>
        <p>Hubungi kami hari ini untuk mengetahui lebih lanjut tentang perlengkapan event kami</p>

        <div class="contact-methods">
          <div class="contact-method">
            <span class="method-icon material-icons">mail</span>
            <div>
              <h4>Email</h4>
              <p>info@restuproduction.com</p>
            </div>
          </div>

          <div class="contact-method">
            <span class="method-icon material-icons">chat</span>
            <div>
              <a href="http://wa.me/6282145632380?text=Hai Restu Production. Saya sedang membutuhkan perlengkapan event, bisakah saya mendapatkan detail harga dan cara penyewaan?" target="_blank">
                <h4>WhatsApp</h4>
                <p>+62 <i>klik ini lalu chat saja, nanti kami balas</i></p>
              </a>
            </div>
          </div>

          <div class="contact-method">
            <span class="method-icon material-icons">location_on</span>
            <div>
                <a href="https://maps.app.goo.gl/Ro1H2okwg6SGZ1tKA">
                <h4>Lokasi</h4>
                <p>Wonosobo, Indonesia</p>
              </a>
              </div>
          </div>
        </div>

        <!-- <div class="contact-cta">
          <RouterLink to="/invoice" class="btn btn-primary">Buat Invoice Sekarang</RouterLink>
          <a href="#features" class="btn btn-secondary">Pelajari Lebih Lanjut</a>
        </div> -->
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, var(--primary-color), #3568e0);
  color: #ffffff;
  transition: background 0.3s ease;
}

:root.dark-mode .contact-section {
  background: linear-gradient(135deg, #1a3a6f, #1e2a5f);
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.contact-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.contact-content > p {
  font-size: 1.1rem;
  margin-bottom: 3rem;
  opacity: 0.95;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.contact-method:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.method-icon {
  font-size: 2rem;
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-method h4 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.contact-method p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.contact-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.9rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-block;
  border: 2px solid transparent;
}

.btn-primary {
  background-color: #ffffff;
  color: var(--primary-color);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  color: #ffffff;
  border-color: #ffffff;
  background-color: transparent;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .contact-section {
    padding: 4rem 0;
  }

  .contact-container {
    padding: 0 1.5rem;
  }

  .contact-content h2 {
    font-size: 1.8rem;
  }

  .contact-methods {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .contact-cta {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
