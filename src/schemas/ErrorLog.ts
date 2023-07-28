import { Schema, model, Document } from 'mongoose'

export interface IErrorLog extends Document {
  message: string
  order_id: string
  account: number
}

const ErrorLogSchema = new Schema(
  {
    message: { type: String, required: true },
    order_id: { type: String, required: false },
    account: { type: Number, required: false },
  },
  {
    timestamps: true,
  },
)

export default model<IErrorLog>('ErrorLog', ErrorLogSchema)
