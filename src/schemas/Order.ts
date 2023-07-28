import { Schema, model, Document } from 'mongoose'

export interface IOrder extends Document {
  user_address: string
  metadata: string
  amount1: number
  amount2: number
  amount3: number
  total_price: number
  currency: string
  order_id: string
}

const OrderSchema = new Schema(
  {
    user_address: { type: String, required: true },
    metadata: { type: String, required: true },
    amount1: { type: Number, required: false },
    amount2: { type: Number, required: false },
    amount3: { type: Number, required: false },
    total_price: { type: Number, required: false },
    currency: { type: String, required: true },
    order_id: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export default model<IOrder>('Order', OrderSchema)
