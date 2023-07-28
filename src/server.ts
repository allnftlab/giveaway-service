import { app } from '@/app'
import { env } from '@/env'
import { setupQueues } from './jobs/queue'
import { initMongoose } from './libs/mongoose'

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(async () => {
    await initMongoose()
    await setupQueues()

    console.log(`HTTP Server Running on PORT ${env.PORT}! 🚀 `)
  })
