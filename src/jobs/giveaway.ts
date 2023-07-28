import { getContract } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { publicClient, walletClient } from '@/client/client'
import { zicoAbi } from './abi'
import { env } from '@/env'
import ErrorLog from '@/schemas/ErrorLog'

const contract = getContract({
  address: '0xD7E9b11fB3Fe78C03fCca2FC2C4734CE44795D9b',
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
    console.log('going', worker, accounts[worker])
    const isPaused = await contract.read.paused()
    console.log('isPaused', isPaused)

    const ids = []
    const amounts = []
    if (amount1 > 0) {
      ids.push(BigInt(0))
      amounts.push(amount1)
    }
    if (amount2 > 0) {
      ids.push(BigInt(1))
      amounts.push(amount2)
    }
    if (amount3 > 0) {
      ids.push(BigInt(2))
      amounts.push(amount3)
    }

    const { request } = await publicClient.simulateContract({
      account: accounts[worker],
      address: env.CONTRACT_ADDRESS as `0x${string}`,
      abi: zicoAbi,
      functionName: 'giveawayBatch',
      args: [receiver, ids, amounts, '0x'],
    })

    console.log('giving away', [worker, receiver, amount1, amount2, amount3])

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
      hash,
    )
  } catch (error) {
    console.log('error', error)
    ErrorLog.create({ message: error, account: receiver, order_id })
    throw new Error('internal error')
  }
}
