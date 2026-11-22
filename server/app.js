'use strict'

/* Startup file untuk shared hosting (LiteSpeed/cPanel).
   File ini sengaja CommonJS karena lsnode.js memuatnya dengan require().
   Semua kode aplikasi tetap ESM di folder src/ dan diimpor secara dinamis.
   File ini sejajar dengan package.json supaya hosting membaca dependency dengan benar. */

const http = require('node:http')

let realApp = null
let bootError = null

const boot = import('./src/app.js')
  .then((module) => {
    realApp = module.default
  })
  .catch((error) => {
    bootError = error
    console.error('[server] Gagal memuat aplikasi:', error)
  })

/* Fungsi ini langsung tersedia saat require() dipanggil, jadi lsnode.js tidak
   perlu menunggu import() selesai. Request awal mendapat 503 singkat. */
function app(req, res, next) {
  if (bootError) {
    if (typeof next === 'function') return next(bootError)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    return res.end('Server initialization failed.')
  }
  if (!realApp) {
    res.statusCode = 503
    res.setHeader('Retry-After', '2')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return res.end(JSON.stringify({ error: 'Server sedang dimulai.' }))
  }
  return realApp(req, res, next)
}

/* Delegasi method Express untuk wrapper hosting yang memanggil app.use()/set(). */
const delegatedMethods = [
  'use',
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'all',
  'head',
  'options',
  'set',
  'disable',
  'enable',
  'engine',
  'param',
  'route',
]
for (const method of delegatedMethods) {
  app[method] = (...args) => {
    if (!realApp) throw new Error('Aplikasi belum siap.')
    return realApp[method](...args)
  }
}

/* Kalau hosting memanggil app.listen(), kita buat server dari proxy ini.
   Saat dijalankan lokal lewat `node app.js`, jalur yang sama dipakai. */
app.listen = (...args) => http.createServer(app).listen(...args)

app.ready = boot
app.app = app
app.default = app

module.exports = app

if (require.main === module) {
  boot.then(() => {
    const port = Number.parseInt(process.env.PORT, 10) || 3510
    app.listen(port, () => {
      console.log(`Restu Production API siap di http://localhost:${port}`)
    })
  })
}
