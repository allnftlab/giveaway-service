import { app } from '@/app'
import { env } from '@/env'
import { initMongoose } from './libs/mongoose'

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(async () => {
    await initMongoose()

    console.log(`HTTP Server Running on PORT ${env.PORT}! 🚀 `)
  })
