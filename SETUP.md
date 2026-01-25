# Restu Production - Event Equipment Rental Website

Website single page untuk rental perlengkapan event yang dibangun dengan Vue.js 3, Vite, dan Vue Router.

## 🎯 Fitur Utama

- **Landing Page**: Hero section yang menarik dengan informasi perusahaan
- **Equipment Showcase**: Daftar lengkap perlengkapan yang tersedia dengan fitur hover
- **Features Section**: Keunggulan dan alasan memilih Restu Production
- **Contact Section**: Informasi kontak dan call-to-action
- **Invoice Management**: Halaman untuk membuat dan mengecek invoice
- **Responsive Design**: Fully responsive untuk semua ukuran layar
- **Modern UI**: Minimal design dengan gradient dan animasi yang smooth

## 🎨 Branding

- **Company**: Restu Production
- **Sector**: Event Equipment Rental
- **Primary Color**: Blue (#4081f2)
- **Secondary Color**: Light Red (#f23d4c)
- **Font**: Inter (primary), Poppins/Montserrat (alternative)

### Equipment yang Disewakan

- Audio System (🎤)
- Lighting (💡)
- Stage (🎪)
- Generator (⚡)
- Barricade (🛡️)
- LED Screen (📺)

## 📁 Struktur Proyek

```
src/
├── components/
│   ├── Navbar.vue           # Navigation bar sticky
│   ├── Footer.vue           # Footer dengan social links
│   ├── HeroSection.vue      # Hero/banner utama
│   ├── EquipmentList.vue    # Daftar perlengkapan
│   ├── FeaturesSection.vue  # Keunggulan perusahaan
│   └── ContactSection.vue   # CTA dan informasi kontak
├── views/
│   ├── HomeView.vue         # Landing page
│   ├── InvoiceView.vue      # Invoice management
│   └── AboutView.vue        # About page
├── router/
│   └── index.js             # Route configuration
├── assets/
│   ├── main.css             # Global styles
│   ├── base.css             # Base styles
│   └── logo.svg             # Logo
└── App.vue                  # Root component
```

## 🚀 Instalasi & Setup

### Prerequisites

- Node.js ^20.19.0 atau >=22.12.0
- npm atau yarn

### Langkah-Langkah

1. **Clone atau navigasi ke folder proyek**

```bash
cd e:\RESTUPRO\Web\restupro
```

2. **Install dependencies**

```bash
npm install
```

3. **Jalankan development server**

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173`

4. **Build untuk production**

```bash
npm run build
```

## 📝 Perintah Tersedia

```bash
npm run dev        # Jalankan dev server
npm run build      # Build untuk production
npm run preview    # Preview build result
npm run test:unit  # Jalankan unit tests
npm run test:e2e   # Jalankan E2E tests
npm run lint       # Jalankan ESLint dengan auto-fix
npm run format     # Format code dengan Prettier
```

## 🔗 Routes/Halaman

| Route      | Deskripsi                                 |
| ---------- | ----------------------------------------- |
| `/`        | Landing page dengan semua informasi utama |
| `/invoice` | Halaman untuk membuat dan cek invoice     |
| `/about`   | Halaman tentang perusahaan                |

## 💡 Komponen Utama

### Navbar

- Logo responsive dengan styling gradient
- Mobile menu dengan hamburger icon
- Navigation links dengan smooth scroll
- Invoice CTA button
- Sticky positioning

### Hero Section

- Judul besar dengan gradient text
- Deskripsi perusahaan
- Dual CTA buttons
- Animated blob background
- Floating icon boxes

### Equipment List

- Grid responsive 3 kolom
- Card dengan hover effect
- Icon, nama, deskripsi
- Feature list untuk setiap equipment
- Detail button

### Features Section

- 6 fitur utama dengan icons
- Card design yang clean
- Hover animation
- Responsive grid

### Contact Section

- Background dengan gradient primary
- 3 metode kontak (Email, WhatsApp, Lokasi)
- Contact method cards dengan hover effect
- Dual CTA buttons

### Footer

- Multi-column layout
- Links section
- Social media links
- Copyright info

### Invoice View

- Tab system (Create & Check)
- Create invoice form dengan checkbox equipment
- Check invoice dengan search functionality
- Form validation
- Status badges

## 🎨 Styling System

### CSS Variables

```css
--primary-color: #4081f2 --secondary-color: #f23d4c --dark-bg: #0f0f0f --light-bg: #f8f9fa
  --text-dark: #1a1a1a --text-light: #666666 --border-light: #e5e5e5;
```

### Responsive Breakpoints

- Mobile: max-width: 768px
- Tablet: min-width: 769px
- Desktop: min-width: 1024px

## 🔄 Backend Integration

Saat ini, fitur berikut siap untuk integrasi dengan backend Node.js:

1. **Create Invoice** - Form submission
2. **Check Invoice** - Invoice lookup by number
3. **Equipment List** - Dynamic loading dari API

### Endpoint yang Diperlukan

```
POST   /api/invoices         - Create invoice
GET    /api/invoices/:id     - Get invoice by ID
GET    /api/equipment        - Get all equipment
```

## 🎬 Animasi & Interactions

- Smooth scrolling untuk navigation
- Button hover effects dengan transform
- Card lift on hover
- Blob animation di hero section
- Floating icon animation
- Tab transitions
- Loading states

## 📱 Mobile Optimization

- Hamburger menu untuk mobile
- Stack layout untuk mobile view
- Touch-friendly buttons
- Optimized font sizes
- Flexible grid system
- Full-width forms

## ✅ Checklist Implementasi

- [x] Setup Vue.js 3 project
- [x] Create responsive navbar
- [x] Create footer component
- [x] Create hero section
- [x] Create equipment list component
- [x] Create features section
- [x] Create contact section
- [x] Create invoice page placeholder
- [x] Setup routing
- [x] Global styling & CSS variables
- [x] Responsive design
- [ ] Backend API integration
- [ ] Invoice create functionality
- [ ] Invoice check functionality
- [ ] Authentication (if needed)
- [ ] Database integration

## 🚀 Next Steps

1. **Backend Setup**
   - Setup Node.js Express server
   - Create database schema untuk invoices
   - Create API endpoints

2. **API Integration**
   - Connect frontend form ke create invoice endpoint
   - Connect invoice search ke check endpoint
   - Add loading states & error handling

3. **Additional Features**
   - User authentication
   - Invoice history
   - PDF generation
   - Email notifications

4. **Optimization**
   - Image optimization
   - Code splitting
   - Performance monitoring
   - SEO optimization

## 📞 Support

Untuk informasi lebih lanjut, hubungi Restu Production:

- Email: info@restuproduction.com
- WhatsApp: +62 XXX XXXX XXXX
- Instagram: @restuproduction

---

**Created with Vue.js 3 + Vite** ⚡
