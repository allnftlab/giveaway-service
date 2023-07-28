import { env } from '@/env'
import { Queue, Worker, QueueEvents } from 'bullmq'
import giveaway from './giveaway'
import Redis from 'ioredis'
import { createBullBoard } from '@bull-board/api'
import { FastifyAdapter } from '@bull-board/fastify'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'

const connection = new Redis(env.REDIS_ADDRESS, { maxRetriesPerRequest: null })

export const giveawayQueue = new Queue('giveaway-queue', {
  connection,
})

export const serverAdapter = new FastifyAdapter()

createBullBoard({
  queues: [new BullMQAdapter(giveawayQueue)],
  serverAdapter,
})

serverAdapter.setBasePath('/ui')

export async function setupQueues() {
  const giveawayWorker1 = new Worker(
    'giveaway-queue',
    async (job) => {
      console.log('job', job)
      const { account, amount1, amount2, amount3, order_id } = job.data
      console.log('running', 3, account, amount1, amount2, amount3, order_id)

      await giveaway(1, account, amount1, amount2, amount3, order_id)
    },
    { connection, autorun: true },
  )

  const giveawayWorker2 = new Worker(
    'giveaway-queue',
    async (job) => {
      console.log('job', job)
      const { account, amount1, amount2, amount3, order_id } = job.data
      console.log('running', 2, account, amount1, amount2, amount3, order_id)
      await giveaway(2, account, amount1, amount2, amount3, order_id)
    },
    { connection, autorun: true },
  )

  const giveawayWorker3 = new Worker(
    'giveaway-queue',
    async (job) => {
      console.log('job', job)
      const { account, amount1, amount2, amount3, order_id } = job.data
      console.log('running', 3, account, amount1, amount2, amount3, order_id)
      await giveaway(3, account, amount1, amount2, amount3, order_id)
    },
    { connection, autorun: true },
  )

  const queueEvents = new QueueEvents('queue', { connection })

  queueEvents.on('waiting', ({ jobId }) => {
    console.log(`A job with ID ${jobId} is waiting`)
  })

  queueEvents.on('active', ({ jobId, prev }) => {
    console.log(`Job ${jobId} is now active; previous status was ${prev}`)
  })

  queueEvents.on('completed', ({ jobId, returnvalue }) => {
    console.log(`${jobId} has completed and returned ${returnvalue}`)
  })

  queueEvents.on('failed', ({ jobId, failedReason }) => {
    console.log(`${jobId} has failed with reason ${failedReason}`)
  })
}
