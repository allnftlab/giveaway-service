import { config } from 'dotenv'

import { z } from 'zod'

config()

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PAGARME_AUTH: z.string(),
  DATABASE_URL: z.string(),
  POSTMARK_API_KEY: z.string(),
  PRIVATE_KEY_1: z.string(),
  PRIVATE_KEY_2: z.string(),
  PRIVATE_KEY_3: z.string(),
  REDIS_ADDRESS: z.string(),
  CONTRACT_ADDRESS: z.string(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
