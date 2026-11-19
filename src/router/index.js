import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Beranda' } },
    {
      path: '/project',
      name: 'projects',
      component: () => import('../views/ProjectView.vue'),
      meta: { title: 'Proyek' },
    },
    {
      path: '/project/:slug',
      name: 'project-detail',
      component: () => import('../views/ProjectDetailView.vue'),
      meta: { title: 'Detail Proyek' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'Tentang Kami' },
    },
    {
      path: '/invoice',
      name: 'invoice',
      component: () => import('../views/InvoiceView.vue'),
      meta: { title: 'Invoice' },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { title: 'Admin', bare: true, noindex: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, top: 84, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router
