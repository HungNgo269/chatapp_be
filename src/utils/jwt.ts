import jwt from 'jsonwebtoken'
import { Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()
const mySecretKey: string | undefined = process.env.JWT_SECRET
if (!mySecretKey) {
  throw new Error('JWT_SECRET is not defined in environment variables.')
}

const generateToken = (userID: string | number, res: Response): string => {
  const token = jwt.sign({ userID }, mySecretKey, { expiresIn: '7d' })

  res.cookie('jwt', token, {
    httpOnly: true, // Prevent XSS access via JavaScript
    secure: process.env.NODE_ENV === 'production', // Secure only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  })
  return token
}

export default generateToken
