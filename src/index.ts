import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route'
import conversationRoutes from './routes/conversation.route'
import { SocketService } from './services/socket.services'
import connectDB from './lib/db'

dotenv.config()

const app = express()
const server = http.createServer(app)

const socketService = new SocketService(server)

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  })
)

app.use('/api/auth', authRoutes)
app.use('/api/conversations', conversationRoutes)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Lỗi server:', err)
  res.status(500).json({ message: 'Đã có lỗi xảy ra', error: err.message })
})

async function startServer() {
  try {
    await connectDB()

    const PORT = process.env.PORT || 3000
    server.listen(PORT, () => {
      console.log(`Server đang chạy trên cổng ${PORT}`)
    })
  } catch (error) {
    console.error('Không thể khởi động server:', error)
    process.exit(1)
  }
}

process.on('uncaughtException', (error) => {
  console.error('Lỗi chưa được catch:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('Lỗi Promise chưa được xử lý:', reason)
  process.exit(1)
})

startServer()
