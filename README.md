# Restu Production - Event Equipment Rental Website

🎉 Website single page modern untuk rental perlengkapan event, dibangun dengan **Vue.js 3**, **Vite**, dan **Vue Router**.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## ✨ Fitur Utama

### 🎨 Landing Page

- **Hero Section**: Banner utama dengan animasi background dan CTA buttons
- **Equipment Showcase**: 6 jenis perlengkapan dengan deskripsi lengkap
- **Features Section**: Keunggulan Restu Production
- **Contact Section**: Informasi kontak dan call-to-action

### 📄 Invoice Management

- **Create Invoice**: Form untuk membuat invoice dengan equipment selection
- **Check Invoice**: Pencarian invoice berdasarkan nomor
- **Responsive Design**: Mobile-friendly interface

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.vue              # Navigation sticky
│   ├── Footer.vue              # Footer
│   ├── HeroSection.vue         # Hero dengan animasi
│   ├── EquipmentList.vue       # Equipment showcase
│   ├── FeaturesSection.vue     # Keunggulan
│   └── ContactSection.vue      # Kontak & CTA
├── views/
│   ├── HomeView.vue            # Landing page
│   ├── InvoiceView.vue         # Invoice management
│   └── AboutView.vue           # About
├── router/
│   └── index.js                # Routing
├── utils/
│   └── api.js                  # API client
└── assets/                     # Styles & images
```

## 🚀 Quick Start

```sh
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## 📝 Available Commands

```sh
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview build
npm run test:unit  # Unit tests
npm run test:e2e   # E2E tests
npm run lint       # Lint & fix
npm run format     # Format code
```

## 🎨 Colors & Design

- **Primary**: #4081f2 (Blue)
- **Secondary**: #f23d4c (Light Red)
- **Font**: Inter, Poppins/Montserrat

## 🔗 Routes

| Route      | Description        |
| ---------- | ------------------ |
| `/`        | Landing page       |
| `/invoice` | Invoice management |
| `/about`   | About page         |

## 📱 Responsive

- Mobile-first design
- Hamburger menu for mobile
- Fully responsive grid layout
- Touch-friendly buttons

## 🔄 Backend Integration

API endpoints ready at `src/utils/api.js`:

- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice
- `GET /api/equipment` - Get equipment

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup guide
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Backend Node.js template

## 📞 Contact

**Restu Production**

- Email: info@restuproduction.com
- WhatsApp: +62 XXX XXXX XXXX

## 📄 License

MIT License

---

Made with Vue.js 3 + Vite ⚡
