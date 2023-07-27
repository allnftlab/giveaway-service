import { Schema, model, Document } from 'mongoose'

export interface IOrder extends Document {
  user_address: string
  payment_id: string
  payment_method: string
  metadata: string
  amount: number
  total_price: number
  currency: string
  contract_address: string
  hook_id: string
}

const OrderSchema = new Schema(
  {
    user_address: { type: String, required: true },
    payment_id: { type: String, required: true },
    payment_method: { type: String, required: true },
    metadata: { type: String, required: true },
    amount: { type: Number, required: false },
    total_price: { type: Number, required: false },
    currency: { type: Number, required: true },
    contract_address: { type: String, required: true },
    hook_id: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export default model<IOrder>('Order', OrderSchema)
