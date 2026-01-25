"""
Backend Node.js Starter Template untuk Restu Production API
File: backend-setup.md
"""

# Backend Setup untuk Restu Production

## Teknologi yang Direkomendasikan

- **Framework**: Express.js (Node.js)
- **Database**: MongoDB atau PostgreSQL
- **Authentication**: JWT (JSON Web Token)
- **Validation**: Joi atau Zod
- **ORM**: Mongoose (MongoDB) atau Sequelize/TypeORM (PostgreSQL)

## Setup Awal

### 1. Inisialisasi Project

```bash
mkdir restupro-backend
cd restupro-backend
npm init -y
```

### 2. Install Dependencies

```bash
npm install express cors dotenv
npm install --save-dev nodemon
```

### 3. Setup Express Server

Buat file `server.js`:

```javascript
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/invoices', require('./routes/invoices'))
app.use('/api/equipment', require('./routes/equipment'))
app.use('/api/auth', require('./routes/auth'))

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`)
})
```

### 4. Database Connection

Untuk MongoDB (dengan Mongoose):

```bash
npm install mongoose
```

Buat file `config/database.js`:

```javascript
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

module.exports = connectDB
```

## Database Schema

### Invoice Schema

```javascript
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventLocation: {
    type: String,
    required: true,
  },
  equipment: [
    {
      equipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
      },
      quantity: Number,
      price: Number,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})
```

### Equipment Schema

```javascript
const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: String,
  description: String,
  price: {
    type: Number,
    required: true,
  },
  icon: String,
  features: [String],
  availability: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})
```

## API Endpoints

### Invoice Endpoints

```
POST   /api/invoices              - Create invoice
GET    /api/invoices              - Get all invoices
GET    /api/invoices/:id          - Get invoice by ID
GET    /api/invoices/number/:num  - Get invoice by number
PUT    /api/invoices/:id          - Update invoice
DELETE /api/invoices/:id          - Delete invoice
```

### Equipment Endpoints

```
GET    /api/equipment             - Get all equipment
GET    /api/equipment/:id         - Get equipment by ID
POST   /api/equipment             - Create equipment (admin)
PUT    /api/equipment/:id         - Update equipment (admin)
DELETE /api/equipment/:id         - Delete equipment (admin)
```

## Example Controllers

### invoices.controller.js

```javascript
const Invoice = require('../models/Invoice')

// Create invoice
exports.createInvoice = async (req, res) => {
  try {
    const { clientName, eventDate, eventLocation, equipment, notes } = req.body

    // Calculate total price
    const totalPrice = equipment.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Generate invoice number
    const invoiceNumber = \`INV-\${Date.now()}\`

    const invoice = new Invoice({
      invoiceNumber,
      clientName,
      eventDate,
      eventLocation,
      equipment,
      totalPrice,
      notes
    })

    await invoice.save()
    res.status(201).json(invoice)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get invoice by number
exports.getInvoiceByNumber = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.number })
      .populate('equipment.equipmentId')

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' })
    }

    res.json(invoice)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    )

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' })
    }

    res.json(invoice)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id)

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' })
    }

    res.json({ message: 'Invoice deleted' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
```

## Environment Variables

Buat file `.env`:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/restupro
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## Package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

## Instalasi & Menjalankan

```bash
# Install dependencies
npm install

# Setup database
# Pastikan MongoDB berjalan

# Jalankan development server
npm run dev

# Server akan berjalan di http://localhost:3000
```

## Security Best Practices

1. **Environment Variables**: Gunakan .env untuk credentials
2. **CORS**: Configure CORS dengan benar
3. **Input Validation**: Validate semua input dari client
4. **Authentication**: Implement JWT authentication
5. **Rate Limiting**: Implement rate limiting untuk API
6. **Error Handling**: Proper error handling & logging

## Struktur Folder yang Direkomendasikan

```
backend/
├── config/
│   └── database.js
├── controllers/
│   ├── invoices.controller.js
│   └── equipment.controller.js
├── models/
│   ├── Invoice.js
│   └── Equipment.js
├── routes/
│   ├── invoices.js
│   └── equipment.js
├── middleware/
│   └── auth.js
├── .env
├── .env.example
├── server.js
└── package.json
```

## Next Steps

1. Setup MongoDB/PostgreSQL
2. Implement controllers dan routes
3. Add validation middleware
4. Implement authentication
5. Add error handling
6. Write unit tests
7. Deploy to production

---

Untuk integrasi lebih lanjut dengan frontend, pastikan API server berjalan dan ubah `VITE_API_URL` di `.env` frontend.
