import { test, expect } from '@playwright/test'

test('halaman utama menampilkan identitas Restu Production', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Restu Production/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Fokus ke acara Anda')
})

test('navigasi ke halaman proyek', async ({ page }) => {
  await page.goto('/project')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Setiap acara punya cerita')
})
