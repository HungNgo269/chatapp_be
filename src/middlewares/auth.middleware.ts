import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import User from '~/models/User/User.model'
import { verifyToken } from '~/utils/jwt'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

export const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized - No Token Provided' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No Token Provided' })
    }

    const decoded = await verifyToken(token)

    const user = await User.findById(decoded.userID).select('-password')
    //loại bỏ trường password khỏi tìm kiếm để tăng bảo mật => ko trả về pass về
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    req.user = user
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized - Invalid Token' })
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Unauthorized - Token Expired' })
    }

    console.error('Error in protectedRoute middleware:', error)
    return res.status(500).json({ message: 'Server error during authentication' })
  }
}
