import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import User from '~/models/User/User.model'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

interface AuthRequest extends Request {
  user?: typeof User.prototype
}

export const protectedRoute = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No Token Provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    const user = await User.findById(decoded.userID).select('-password')
    //loại bỏ trường password khỏi tìm kiếm để tăng bảo mật => ko trả về pass nè
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
