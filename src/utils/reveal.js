/** IntersectionObserver ringan untuk animasi masuk yang tidak menghalangi konten. */
const FALLBACK_MS = 1200
const fallbackTimers = new WeakMap()
let observer

function show(el) {
  const timer = fallbackTimers.get(el)
  if (timer) {
    window.clearTimeout(timer)
    fallbackTimers.delete(el)
  }
  el.classList.add('is-visible')
}

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target)
          observer.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px', threshold: 0 },
  )
  return observer
}

export const reveal = {
  mounted(el) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show(el)
      return
    }

    el.classList.add('reveal')

    /* Kalau IntersectionObserver tidak tersedia / tidak pernah firing (misalnya
       script di-defer oleh proxy), konten tetap tampil setelah jeda singkat. */
    if (typeof IntersectionObserver === 'undefined') {
      show(el)
      return
    }

    fallbackTimers.set(el, window.setTimeout(() => show(el), FALLBACK_MS))
    getObserver().observe(el)
  },
  unmounted(el) {
    const timer = fallbackTimers.get(el)
    if (timer) window.clearTimeout(timer)
    fallbackTimers.delete(el)
    observer?.unobserve(el)
  },
}
