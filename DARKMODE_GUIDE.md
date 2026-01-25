# 🌙 Panduan Dark Mode

## Cara Mengaktifkan Dark Mode

### 1. **Via UI (User Interface)**

- Klik tombol **Moon/Sun icon** di navbar (sebelah kanan)
- Icon akan berubah antara moon (🌙) untuk light mode dan sun (☀️) untuk dark mode
- Halaman akan **langsung berubah** dengan smooth transition 0.3s

### 2. **Preference Tersimpan**

- Pilihan dark mode disimpan di **localStorage** browser
- Saat Anda reload halaman, dark mode **tetap aktif** jika sebelumnya diaktifkan
- Setiap device/browser memiliki preferensi terpisah

---

## Implementasi Technical

### A. CSS Variables System

**Di `src/App.vue`:**

```css
:root {
  /* Light Mode (Default) */
  --primary-color: #4081f2;
  --text-dark: #1a1a1a;
  --text-light: #666666;
  --light-bg: #f8f9fa;
  --border-light: #e5e5e5;
}

:root.dark-mode {
  /* Dark Mode Overrides */
  --text-dark: #ffffff;
  --text-light: #cccccc;
  --light-bg: #1a1a1a;
  --border-light: #333333;
}
```

### B. Class-Based Theming

Ketika dark mode aktif, element `<html>` mendapat class `dark-mode`:

```html
<html class="dark-mode">
  <!-- seluruh konten halaman -->
</html>
```

Semua styles dapat menargetkan dark mode dengan:

```css
:root.dark-mode .navbar {
  background-color: #1a1a1a;
}

:root.dark-mode .feature-icon {
  background: linear-gradient(135deg, #2a3a5a, #1f2e45);
  color: #7ab8ff;
}
```

### C. JavaScript Dark Mode Toggle

**Di `src/components/Navbar.vue`:**

```javascript
const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value

  if (isDarkMode.value) {
    // Aktifkan dark mode
    document.documentElement.classList.add('dark-mode')
    localStorage.setItem('darkMode', 'true')
  } else {
    // Matikan dark mode
    document.documentElement.classList.remove('dark-mode')
    localStorage.setItem('darkMode', 'false')
  }
}
```

### D. Auto-detect Dark Mode Saat Startup

**Di `src/App.vue` (mounted):**

```javascript
onMounted(() => {
  const isDarkMode = localStorage.getItem('darkMode') === 'true'
  if (isDarkMode) {
    document.documentElement.classList.add('dark-mode')
  }
})
```

---

## Components yang Support Dark Mode

| Component        | Features                                        |
| ---------------- | ----------------------------------------------- |
| Navbar           | Background color, hamburger menu, toggle button |
| Hero Section     | Background gradient, icon boxes                 |
| Equipment List   | Card background, borders, shadows               |
| Features Section | Card background, icon colors                    |
| Contact Section  | Background gradient, card styles                |
| Footer           | Background color                                |

---

## Color Palette per Mode

### Light Mode

```
Primary: #4081f2 (Biru)
Secondary: #f23d4c (Merah)
Background: #ffffff (Putih)
Light BG: #f8f9fa (Abu-abu terang)
Text Dark: #1a1a1a (Hitam)
Text Light: #666666 (Abu-abu)
Borders: #e5e5e5 (Abu-abu terang)
```

### Dark Mode

```
Primary: #4081f2 (Biru - sama)
Secondary: #f23d4c (Merah - sama)
Background: #0f0f0f (Hitam gelap)
Light BG: #1a1a1a (Abu-abu gelap)
Text Dark: #ffffff (Putih)
Text Light: #cccccc (Abu-abu terang)
Borders: #333333 (Abu-abu gelap)
```

---

## FontAwesome Icons di Dark Mode

Features section menggunakan FontAwesome icons dengan:

**Light Mode:**

- Icon color: `#4081f2` (biru cukup gelap)
- Background: Gradient `#f0f4ff` to `#ffffff` (terang)

**Dark Mode:**

- Icon color: `#7ab8ff` (biru terang)
- Background: Gradient `#2a3a5a` to `#1f2e45` (gelap)

Ini memastikan **contrast ratio yang baik** di kedua mode untuk accessibility.

---

## Equipment Card Structure (Baru)

Setiap card sekarang terbagi 2 bagian:

### Header (Image Section)

```
Height: 200px
Content: SVG image
Padding: NONE (edge-to-edge)
Background: Gradient light untuk visual appeal
```

### Content (Text Section)

```
Padding: 2rem (consistent)
Content: Title, Description, Features, Button
Text Color: Menyesuaikan dengan dark mode
```

---

## FAQ Dark Mode

### Q: Bagaimana jika user tidak mengaktifkan dark mode?

**A:** Default tetap light mode. Dark mode hanya aktif jika user secara eksplisit mengkliknya.

### Q: Apa terjadi pada device dengan dark mode system preference?

**A:** Saat ini tidak detect system preference (future enhancement). User harus klik tombol untuk aktifkan.

### Q: Apakah dark mode bekerja offline?

**A:** Ya! Preference disimpan di localStorage, jadi offline pun tetap berfungsi.

### Q: Bisa customize colors dark mode?

**A:** Ya! Edit CSS variables di `:root.dark-mode` di `src/App.vue`.

---

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Dark mode menggunakan standard CSS features, supported di semua modern browsers.

---

## Performance Impact

- **Zero Impact**: Dark mode hanya mengubah CSS variables
- **Smooth Transitions**: 0.3s ease transition untuk comfortable viewing
- **No JavaScript Heavy**: Hanya toggle class, tidak ada DOM manipulation

---

## Accessibility

- ✅ Icons have proper color contrast
- ✅ Text readable di light dan dark mode
- ✅ Button styles consistent dengan accessibility standards
- ✅ Smooth transitions tidak mengganggu motion-sensitive users

---

Dokumentasi dibuat: December 23, 2025
Last Updated: Saat implementasi
Status: ✅ PRODUCTION READY
