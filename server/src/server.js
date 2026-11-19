import { config } from './config.js'
import { initAdminAuth } from './admin-auth.js'
import { initStore } from './store.js'
import { closeDb } from './db.js'
import app from './app.js'

await initStore()
await initAdminAuth()

const server = app.listen(config.port, () => {
  console.log(`Restu Production API siap di http://localhost:${config.port} (${config.nodeEnv})`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`\nMenutup server (${signal})…`)
    server.close(async () => {
      await closeDb()
      process.exit(0)
    })
  })
}
