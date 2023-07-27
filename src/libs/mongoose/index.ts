import mongoose from 'mongoose'

export async function initMongoose() {
  await mongoose.connect(process.env.DATABASE_URL as string)
  console.log('DB connected')
}
