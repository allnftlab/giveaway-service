import { encodePacked, Address, keccak256, verifyMessage } from 'viem'

interface verifyTradePackedSignatureParams {
  signature: string
  contract_address: string
  token_id: number
  trader: string
  expiration: number
  payment_type: number
  payment_contract: string
  payment_amount: string
}

export async function verifyTradePackedSignature({
  signature,
  contract_address,
  expiration,
  trader,
  payment_amount,
  payment_contract,
  payment_type,
  token_id,
}: verifyTradePackedSignatureParams) {
  const encodedListing = encodePacked(
    [
      'address',
      'uint256',
      'address',
      'uint256',
      'uint256',
      'address',
      'uint256',
    ],
    [
      contract_address as Address,
      BigInt(token_id),
      trader as Address,
      BigInt(expiration),
      BigInt(payment_type),
      payment_contract as Address,
      BigInt(payment_amount),
    ],
  )

  const hash = keccak256(encodedListing)

  const isValidSignature = await verifyMessage({
    address: from as Address,
    message: hash,
    signature: signature as Address,
  })

  return [isValidSignature, hash]
}
