import jwt, { JwtPayload } from 'jsonwebtoken'
import { Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()
const mySecretKey: string | undefined = process.env.JWT_SECRET
if (!mySecretKey) {
  throw new Error('JWT_SECRET is not defined in environment variables.')
}

export const generateToken = (userID: string | number, res: Response): string => {
  const accessToken = jwt.sign({ userID }, mySecretKey, { expiresIn: '5m' })
  const refreshToken = jwt.sign({ userID }, mySecretKey, { expiresIn: '7d' })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevent XSS access via JavaScript
    secure: process.env.NODE_ENV === 'production', // Secure only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  })
  return accessToken //chỉ trả về accesstoken trong body
}
export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, mySecretKey) as JwtPayload
  return decoded
}
