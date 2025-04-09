import express from 'express'
import authRoutes from './routes/auth.route'
import conversationRoutes from './routes/conversation.route'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './lib/db'
import cookieParser from 'cookie-parser'

dotenv.config({ path: '../.env' })
const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true // cho phép gửi tham số như header theo request
  })
)
app.use('/api/auth', authRoutes)
app.use('/api/conversations', conversationRoutes)
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
  connectDB()
})
