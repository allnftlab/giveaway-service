import { env } from '@/env'
import Order from '@/schemas/Order'
import { FastifyRequest, FastifyReply } from 'fastify'
import { ServerClient } from 'postmark'
import axios from 'axios'
import { giveawayQueue } from '@/jobs/queue'

interface Notification {
  type: string
  data: {
    id: string
  }
}

export default async function sellingNotifications(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const payload = request.body
  const data = payload as Notification

  const type = data.type
  const order_id = data.data.id

  const existingOrder = await Order.findOne({ orderId: order_id })
  if (existingOrder) {
    reply.code(400).send({ error: 'Order already processed' })
  }

  if (type === 'order.paid') {
    const url = `https://api.pagar.me/core/v5/orders/${order_id}`
    const headers = { 'Content-Type': 'application/json' }
    const auth = `${env.PAGARME_AUTH}`

    // const response = await axios.get(url, {
    //   headers,
    //   auth: { username: auth, password: '' },
    // })

    if (true) {
      // if (response.status === 200) {
      // const responseData = response.data
      // console.log('responseData', responseData)

      // const metadata = responseData.metadata

      const metadata = {
        eth_address: '0x425aED368F6b6755C8f57FB82F136fc5E894ff1e',
        contract_address: '0xD7E9b11fB3Fe78C03fCca2FC2C4734CE44795D9b',
        amount1: 1,
        amount2: 2,
        amount3: 0,
        email: 'arthur@allnftlab.com',
        physical_address: '',
        payment_method: '',
        total: 10,
        taxes: 1,
        subtotal: 10,
        unit_price: 3,
        currency: 'brl',
        product_name: 'nft',
        client_name: 'art',
      }

      const {
        eth_address,
        contract_address,
        amount1,
        amount2,
        amount3,
        email,
        physical_address,
        payment_method,
        total,
        taxes,
        subtotal,
        unit_price,
        currency,
        product_name,
        client_name,
      } = metadata

      // if (responseData.status !== 'paid') {
      //   console.log('Order not paid', responseData)
      //   return reply.code(400).send({ error: 'Order not paid' })
      // }

      await Order.create({
        user_address: eth_address,
        order_id,
        payment_method,
        metadata: JSON.stringify(metadata),
        amount1,
        amount2,
        amount3,
        total,
        currency,
        contract_address,
      })

      console.log('giveaway metadata', metadata)

      await giveawayQueue.add('giveaway', {
        account: eth_address,
        amount1,
        amount2,
        amount3,
        order_id,
      })

      const postmark = new ServerClient(env.POSTMARK_API_KEY)

      // await postmark.sendEmailWithTemplate({
      //   TemplateId: 32297107,
      //   TemplateModel: {
      //     product_name,
      //     eth_address,
      //     amount1,
      //     amount2,
      //     amount3,
      //     physical_address,
      //     payment_method,
      //     unit_price,
      //     subtotal,
      //     taxes,
      //     total,
      //     client_name,
      //   },
      //   From: 'contato@allnftlab.com',
      //   To: email,
      // })
    } else {
      reply.code(404).send({ error: 'Webhook Inexistente' })
    }
  }

  reply.send({ success: true })
}
