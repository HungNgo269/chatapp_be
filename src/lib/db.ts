import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const MONGO_URL = process.env.MONGO_URL || ''

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URL)
    console.log(`DB connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(`DB errored: ${error}`)
  }
}
export default connectDB
