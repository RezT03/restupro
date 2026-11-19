import { describe, expect, it } from 'vitest'
import { formatDate, formatBytes, truncate } from '../format'

describe('format helpers', () => {
  it('memformat tanggal dalam bahasa Indonesia', () => {
    expect(formatDate('2026-11-19T00:00:00Z')).toBe('19 November 2026')
  })

  it('mengembalikan string kosong untuk tanggal rusak', () => {
    expect(formatDate('bukan-tanggal')).toBe('')
  })

  it('memformat ukuran file', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1536)).toBe('1.5 KB')
  })

  it('memotong teks panjang', () => {
    expect(truncate('abcd', 2)).toBe('ab…')
    expect(truncate('abc', 5)).toBe('abc')
  })
})
