/** IntersectionObserver ringan untuk animasi masuk yang tidak menghalangi konten. */
let observer

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  return observer
}

export const reveal = {
  mounted(el) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }
    el.classList.add('reveal')
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
