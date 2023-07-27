import { Schema, model, Document } from 'mongoose'

export interface IGiveaways extends Document {
  address: string
  amount1: number
  amount2: number
  amount3: number
  order_id: string
  signature: string
}

const GiveawaySchema = new Schema(
  {
    address: { type: String, required: true },
    amount1: { type: String, required: false },
    amount2: { type: String, required: false },
    amount3: { type: String, required: false },
    order_id: { type: String, required: false },
    signature: { type: String, required: false },
  },
  { timestamps: true },
)

export default model<IGiveaways>('Giveaway', GiveawaySchema)
