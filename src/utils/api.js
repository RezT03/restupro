// File ini adalah template untuk konfigurasi API client
// Letakkan di: src/utils/api.js atau src/services/api.js

// Konfigurasi API endpoint
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance atau fetch wrapper
const apiClient = {
  // Get invoice by number
  async getInvoice(invoiceNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceNumber}`)
      if (!response.ok) throw new Error('Invoice not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching invoice:', error)
      throw error
    }
  },

  // Create new invoice
  async createInvoice(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create invoice')
      return await response.json()
    } catch (error) {
      console.error('Error creating invoice:', error)
      throw error
    }
  },

  // Get all equipment
  async getEquipment() {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment`)
      if (!response.ok) throw new Error('Failed to fetch equipment')
      return await response.json()
    } catch (error) {
      console.error('Error fetching equipment:', error)
      throw error
    }
  },

  // Update invoice
  async updateInvoice(invoiceId, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update invoice')
      return await response.json()
    } catch (error) {
      console.error('Error updating invoice:', error)
      throw error
    }
  },

  // Delete invoice
  async deleteInvoice(invoiceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete invoice')
      return await response.json()
    } catch (error) {
      console.error('Error deleting invoice:', error)
      throw error
    }
  },
}

export default apiClient
