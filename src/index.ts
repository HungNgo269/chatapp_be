import express from 'express'
import authRoutes from './routes/auth.route'
import dotenv from 'dotenv'
import connectDB from './lib/db'
import cookieParser from 'cookie-parser'

dotenv.config({ path: '../.env' })
const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
  connectDB()
})
