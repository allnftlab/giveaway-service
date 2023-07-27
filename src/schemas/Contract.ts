import { Schema, model, Document, Types } from 'mongoose'

export interface IContract extends Document {
  trader: string
  value: string
  timestamp: number
  expiration: Date
  signature: string
  hash: string
  contract_address: string
  tokenId: number
  token: Types.ObjectId
  contract: Types.ObjectId
  payment_type: 0 | 1 // ETH | ERC20
  payment_contract: string // Only used if paymentType is 1
}

const ContractSchema = new Schema(
  {
    trader: { type: String, required: true },
    value: { type: String, required: false },
    timestamp: { type: Number, required: false },
    expiration: { type: Date, required: true },
    signature: { type: String, required: true },
    hash: { type: String, required: true },
    payment_type: { type: Number, required: true },
    token: { type: Schema.Types.ObjectId, ref: 'Token' },
    tokenId: { type: Number, required: false },
    contract: { type: Schema.Types.ObjectId, ref: 'Contract' },
    contract_address: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export default model<IContract>('Contract', ContractSchema)
