import { FastifyInstance } from 'fastify'

import sellingNotifications from '@/controllers/sellingNotifications'

export async function notificationRoutes(app: FastifyInstance) {
  app.post('/v1/sellingNotifications/', sellingNotifications)
}
