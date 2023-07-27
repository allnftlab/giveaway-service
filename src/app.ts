import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'

import { ZodError } from 'zod'

import { env } from './env'
import { notificationRoutes } from './routes/routes'

const app = fastify()

// app.register(cors, {
//   origin: (origin, cb) => {
//     const hostname = new URL(origin!).hostname

//     console.log(hostname)
//     if (hostname === 'localhost') {
//       //  Request from localhost will pass
//       cb(null, true)
//       return
//     }
//     // Generate an error on other origins, disabling access
//     cb(new Error('Not allowed'), false)
//   },
// })

app.register(cors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)
app.register(notificationRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})

export { app }
