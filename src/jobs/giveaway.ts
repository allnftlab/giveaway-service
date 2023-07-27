import { getContract } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { publicClient, walletClient } from '@/client/client'
import { zicoAbi } from './abi'
import { env } from '@/env'
import Error from '@/schemas/Error'

const contract = getContract({
  address: '0xb2Be4b3bfba1781c692a22ecd9E3963C339971CF',
  abi: zicoAbi,
  publicClient,
})

const accounts = [
  undefined,
  privateKeyToAccount(env.PRIVATE_KEY_1 as `0x${string}`),
  privateKeyToAccount(env.PRIVATE_KEY_2 as `0x${string}`),
  privateKeyToAccount(env.PRIVATE_KEY_3 as `0x${string}`),
]

export default async function giveaway(
  worker: number,
  receiver: `0x${string}`,
  amount1: bigint,
  amount2: bigint,
  amount3: bigint,
  order_id: string,
) {
  try {
    const isPaused = await contract.read.paused()
    console.log('isPaused', isPaused)

    const { request } = await publicClient.simulateContract({
      account: accounts[worker],
      address: '0xb2Be4b3bfba1781c692a22ecd9E3963C339971CF',
      abi: zicoAbi,
      functionName: 'giveawayBatch',
      args: [receiver, amount1, amount2, amount3],
    })

    const hash = await walletClient.writeContract(request)

    const transaction = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: 500_000,
    })

    console.log(
      'giveaway successful: ',
      receiver,
      amount1,
      amount2,
      amount3,
      transaction,
    )
  } catch (error) {
    Error.create({ message: error, account: receiver, order_id })
  }
}
