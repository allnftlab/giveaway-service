import Error from '@/schemas/Error'
import { Queue, Worker } from 'bullmq'
import giveaway from './giveaway'

const connection = {
  host: 'asdas',
  port: 2000,
}

export const giveawayQueue = new Queue('giveaway-queue', {
  connection,
})

const giveawayWorker1 = new Worker(
  'worker1',
  async (job) => {
    const { receiver, amount1, amount2, amount3, order_id } = job.data
    await giveaway(1, receiver, amount1, amount2, amount3, order_id)
  },
  { connection },
)

const giveawayWorker2 = new Worker(
  'worker2',
  async (job) => {
    const { receiver, amount1, amount2, amount3, order_id } = job.data
    await giveaway(2, receiver, amount1, amount2, amount3, order_id)
  },
  { connection },
)

const giveawayWorker3 = new Worker(
  'worker3',
  async (job) => {
    const { receiver, amount1, amount2, amount3, order_id } = job.data
    await giveaway(3, receiver, amount1, amount2, amount3, order_id)
  },
  { connection },
)

giveawayWorker1.on('error', (err) => {
  console.error(err)

  Error.create({ account: '1', message: err, order_id: 'queue' })
})

giveawayWorker2.on('error', (err) => {
  console.error(err)

  Error.create({ account: '2', message: err, order_id: 'queue' })
})

giveawayWorker3.on('error', (err) => {
  console.error(err)

  Error.create({ account: '3', message: err, order_id: 'queue' })
})
