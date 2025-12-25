# Dokumentasi Komponen Restu Production

Penjelasan detail tentang setiap komponen yang digunakan di website Restu Production.

## 📑 Daftar Isi

1. [Navbar](#navbar)
2. [Footer](#footer)
3. [HeroSection](#herosection)
4. [EquipmentList](#equipmentlist)
5. [FeaturesSection](#featuressection)
6. [ContactSection](#contactsection)
7. [InvoiceView](#invoiceview)

---

## Navbar

**File**: `src/components/Navbar.vue`

### Deskripsi

Navigation bar sticky yang menampilkan logo perusahaan dan menu navigasi. Memiliki fitur hamburger menu untuk mobile.

### Props

Tidak ada props

### Data

- `isMenuOpen`: Boolean untuk tracking status mobile menu

### Methods

- `toggleMenu()`: Toggle mobile menu
- `scrollToSection(id)`: Scroll smooth ke section tertentu

### Features

- ✅ Sticky positioning
- ✅ Mobile hamburger menu dengan animasi
- ✅ Smooth scroll navigation
- ✅ Logo dengan gradient color
- ✅ Active router link styling
- ✅ CTA button dengan gradient

### Breakpoints

- Desktop: Flex row layout dengan navigation
- Mobile (<768px): Hamburger menu dengan dropdown

### CSS Classes

- `.navbar`: Container navbar
- `.navbar-logo`: Logo styling
- `.nav-menu`: Menu list
- `.nav-link`: Navigation link
- `.nav-cta`: CTA button styling

---

## Footer

**File**: `src/components/Footer.vue`

### Deskripsi

Footer component yang menampilkan informasi perusahaan, links, dan social media.

### Props

Tidak ada props

### Data

- `currentYear`: Tahun saat ini untuk copyright

### Features

- ✅ Multi-column layout
- ✅ Company info section
- ✅ Links section (Equipment, Services)
- ✅ Contact information
- ✅ Social media links dengan hover effect
- ✅ Dark background styling

### Responsive

- Desktop: 4 kolom grid
- Tablet: 2-3 kolom
- Mobile: 1 kolom

### CSS Classes

- `.footer`: Container footer
- `.footer-section`: Setiap section
- `.social-links`: Social media icons

---

## HeroSection

**File**: `src/components/HeroSection.vue`

### Deskripsi

Hero section utama di landing page dengan animated background blob dan floating icons.

### Props

Tidak ada props

### Features

- ✅ Gradient text untuk main title
- ✅ Animated blob background
- ✅ 4 floating icon boxes dengan staggered animation
- ✅ Dual CTA buttons (primary & secondary)
- ✅ Responsive grid layout

### Animations

- `blob`: 8 detik loop, menggeser dan scale blob
- `float`: 3 detik loop, floating icons dengan delay

### Button Types

- **Primary**: Gradient blue button
- **Secondary**: Transparent dengan border blue

### Responsive

- Desktop: 2 column grid (content + image)
- Tablet: 2 column tetap
- Mobile: Single column

### CSS Classes

- `.hero`: Section container
- `.hero-title`: Judul dengan accent
- `.hero-shape`: Animated blob
- `.icon-box`: Floating icons

---

## EquipmentList

**File**: `src/components/EquipmentList.vue`

### Deskripsi

Menampilkan daftar 6 jenis perlengkapan event dalam grid card layout.

### Data

```javascript
equipments: [
  {
    id: number,
    name: string,
    icon: emoji,
    description: string,
    features: array,
  },
]
```

### Equipment Items

1. **Audio System** 🎤
2. **Lighting** 💡
3. **Stage** 🎪
4. **Generator** ⚡
5. **Barricade** 🛡️
6. **LED Screen** 📺

### Features

- ✅ Responsive grid (3 kolom desktop, 1 mobile)
- ✅ Card hover effect (lift + shadow)
- ✅ Icon display
- ✅ Feature list untuk setiap equipment
- ✅ Detail button

### Responsive

- Desktop: 3 kolom
- Tablet: 2 kolom
- Mobile: 1 kolom

### CSS Classes

- `.equipment-card`: Card styling
- `.equipment-icon`: Icon display
- `.equipment-features`: Feature list
- `.equipment-btn`: Button styling

---

## FeaturesSection

**File**: `src/components/FeaturesSection.vue`

### Deskripsi

Menampilkan 6 keunggulan utama Restu Production dalam grid format.

### Data

```javascript
features: [
  {
    id: number,
    title: string,
    description: string,
    icon: emoji,
  },
]
```

### Features Listed

1. **Kualitas Profesional** ⭐
2. **Harga Kompetitif** 💰
3. **Pengiriman Cepat** 🚚
4. **Tim Profesional** 👥
5. **Support 24/7** 📞
6. **Garansi Kepuasan** ✅

### Features

- ✅ Icon + title + description
- ✅ Card hover animation
- ✅ Responsive grid
- ✅ Clean minimal design

### Responsive

- Desktop: 3 kolom
- Tablet: 2 kolom
- Mobile: 1 kolom

### CSS Classes

- `.feature-card`: Card styling
- `.feature-icon`: Icon styling

---

## ContactSection

**File**: `src/components/ContactSection.vue`

### Deskripsi

CTA section dengan contact information dan action buttons.

### Features

- ✅ Gradient background (primary color)
- ✅ 3 contact methods (Email, WhatsApp, Location)
- ✅ Contact method cards dengan icons
- ✅ Dual CTA buttons
- ✅ White text styling

### Contact Methods

1. **Email**: info@restuproduction.com
2. **WhatsApp**: +62 XXX XXXX XXXX
3. **Lokasi**: Jakarta, Indonesia

### Buttons

- **Primary**: White background dengan blue text
- **Secondary**: Transparent dengan white border

### Responsive

- Desktop: 3 kolom contact methods
- Tablet: 3 kolom tetap atau 2-3 kolom
- Mobile: 1 kolom, full width buttons

### CSS Classes

- `.contact-section`: Section dengan gradient
- `.contact-method`: Method card styling
- `.method-icon`: Icon styling

---

## InvoiceView

**File**: `src/views/InvoiceView.vue`

### Deskripsi

Halaman untuk create dan check invoice dengan tab system.

### Data

```javascript
activeTab: 'create' | 'check'
formData: {
  clientName: string,
  eventDate: date,
  eventLocation: string,
  equipment: array,
  notes: string
}
invoiceNumber: string
invoiceData: object | null
isLoading: boolean
```

### Features

#### Create Invoice Tab

- ✅ Client name input
- ✅ Event date picker
- ✅ Event location input
- ✅ Equipment multi-checkbox selection
- ✅ Notes textarea
- ✅ Submit button
- ✅ Price display per equipment

#### Check Invoice Tab

- ✅ Invoice number search input
- ✅ Search button dengan loading state
- ✅ Invoice result display
- ✅ Status badge (Pending/Completed)
- ✅ Invoice details (number, client, date, total)
- ✅ Download PDF button
- ✅ Edit button

### Available Equipment

```javascript
;[
  { id: 1, name: 'Audio System', price: 5000000 },
  { id: 2, name: 'Lighting', price: 3000000 },
  { id: 3, name: 'Stage', price: 7000000 },
  { id: 4, name: 'Generator', price: 2500000 },
  { id: 5, name: 'Barricade', price: 1500000 },
  { id: 6, name: 'LED Screen', price: 8000000 },
]
```

### Methods

- `createInvoice()`: Handle invoice creation
- `checkInvoice()`: Search invoice by number
- `toggleEquipment(id)`: Toggle equipment selection

### Form Validation

- Required fields: clientName, eventDate, eventLocation
- Equipment: Optional, min 1 recommended
- Notes: Optional

### Responsive

- Desktop: Tab layout dengan form/result side by side
- Mobile: Stacked layout, full-width inputs

### CSS Classes

- `.invoice-tabs`: Tab buttons
- `.tab-content`: Tab content area
- `.invoice-form`: Form styling
- `.equipment-checkboxes`: Checkbox grid
- `.invoice-result`: Result card styling
- `.status`: Status badge

---

## Global Styling

### CSS Variables (App.vue)

```css
--primary-color: #4081f2 --secondary-color: #f23d4c --dark-bg: #0f0f0f --light-bg: #f8f9fa
  --text-dark: #1a1a1a --text-light: #666666 --border-light: #e5e5e5;
```

### Font System

- **Primary**: Inter (400, 500, 600, 700)
- **Fallback**: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto

### Breakpoints

```css
Mobile:  max-width: 768px
Tablet:  769px - 1023px
Desktop: min-width: 1024px
```

---

## Animasi Reusable

### Transitions

```css
transition: all 0.3s ease;
```

### Common Effects

- Button hover: `translateY(-2px)` atau `translateY(-3px)`
- Card hover: `translateY(-4px)` atau `translateY(-8px)`
- Shadow effect: `box-shadow: 0 X px X px rgba(...)`

---

## Best Practices

1. **Mobile First**: Selalu design untuk mobile dulu
2. **Color Consistency**: Gunakan CSS variables
3. **Spacing**: Gunakan multiples dari 0.5rem (8px)
4. **Typography**: Gunakan Inter font untuk consistency
5. **Hover States**: Semua interactive elements harus memiliki hover effect
6. **Accessibility**: Pastikan contrast ratio cukup
7. **Performance**: Minimize animation complexity

---

## Tips Development

### Menambah Component Baru

1. Create `.vue` file di `src/components/`
2. Gunakan `<script setup>` untuk Composition API
3. Scoped CSS untuk isolation
4. Import di view yang diperlukan

### Customizing Warna

Ubah CSS variables di `:root` di `App.vue`:

```css
:root {
  --primary-color: #new-color;
  --secondary-color: #new-color;
}
```

### Responsive Adjustments

Gunakan media query mobile-first:

```css
@media (max-width: 768px) {
  /* mobile styles */
}

@media (min-width: 1024px) {
  /* desktop styles */
}
```

---

## Troubleshooting

### Component tidak render

- Pastikan component sudah di-import
- Check spelling nama component (case-sensitive)
- Verify path relatif correct

### Styling tidak apply

- Check CSS scope (scoped vs global)
- Verify class names match
- Clear browser cache (Ctrl+Shift+Del)

### Mobile menu tidak kerja

- Check hamburger icon visibility
- Verify `toggleMenu()` method terpanggil
- Check CSS media query breakpoint

---

Last Updated: December 2025
