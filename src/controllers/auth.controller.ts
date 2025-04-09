import User from '~/models/User/User.model'
import bcrypt from 'bcryptjs'
import generateToken from '~/utils/jwt'
import { Request, Response } from 'express'
import cloudinary from '~/lib/cloudiary'
import jwt from 'jsonwebtoken'
import { profile } from 'console'

const mySecretKey = process.env.JWT_SECRET
interface SignupRequest extends Request {
  body: {
    username: string
    password: string
    first_name: string
    last_name: string
    day_of_birth: Date | string
    gender: 'male' | 'female' | 'other'
    identifier: string
  }
}

interface LoginRequest extends Request {
  body: {
    identifier: string
    password: string
  }
}

export const signup = async (req: SignupRequest, res: Response) => {
  const { username, password, first_name, last_name, day_of_birth, gender, identifier } = req.body
  try {
    // Kiểm tra các trường bắt buộc
    if (!username || !password || !first_name || !last_name || !day_of_birth || !gender || !identifier) {
      return res.status(400).json({ message: 'Tất cả các trường đều bắt buộc' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    }

    let email: string | undefined
    let phone_number: string | undefined
    // nếu indentifier có @ thì cho gán email = identifier
    if (identifier.includes('@')) {
      email = identifier
    } else {
      phone_number = identifier
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      first_name,
      last_name,
      username,
      day_of_birth: new Date(day_of_birth),
      gender,
      password: hashedPassword,
      email,
      phone_number
    })

    try {
      await newUser.save()
    } catch (error: any) {
      if (error.code === 11000) {
        // Lỗi trùng khóa (duplicate key)
        if (error.keyPattern.username) {
          return res.status(400).json({ message: 'Tên người dùng đã tồn tại' })
        } else if (error.keyPattern.email) {
          return res.status(400).json({ message: 'Email đã tồn tại' })
        } else if (error.keyPattern.phone_number) {
          return res.status(400).json({ message: 'Số điện thoại đã tồn tại' })
        }
      }
      throw error
    }

    const token = generateToken(newUser._id.toString(), res)

    res.status(201).json({
      _id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      username: newUser.username,
      day_of_birth: newUser.day_of_birth,
      gender: newUser.gender,
      email: newUser.email,
      phone_number: newUser.phone_number,
      token
    })
  } catch (error) {
    console.error('Lỗi trong quá trình đăng ký:', error)
    res.status(500).json({ message: 'Lỗi server trong quá trình đăng ký' })
  }
}

export const login = async (req: LoginRequest, res: Response) => {
  const { identifier, password } = req.body
  try {
    if (!identifier || typeof identifier !== 'string') {
      return res.status(400).json({ message: 'Email hoặc số điện thoại không hợp lệ' })
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: 'Mật khẩu không hợp lệ' })
    }

    let user
    if (identifier.includes('@')) {
      user = await User.findOne({ email: identifier })
    } else {
      user = await User.findOne({ phone_number: identifier })
    }
    if (!user) {
      return res.status(401).json({ message: 'Email, số điện thoại hoặc mật khẩu không đúng' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Email, số điện thoại hoặc mật khẩu không đúng' })
    }

    const accessToken = generateToken(user._id.toString(), res)
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      first_name: user.first_name,
      last_name: user.last_name,
      day_of_birth: user.day_of_birth.OptionsConstructor,
      gender: user.gender,
      profile_picture: user.profile_picture,
      created_at: user.created_at,
      updated_at: user.updated_at,
      accessToken
    })
  } catch (error) {
    console.error('Lỗi trong quá trình đăng nhập:', error)
    res.status(500).json({ message: 'Lỗi server trong quá trình đăng nhập' })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie('accessToken', '', {
      httpOnly: true,
      expires: new Date(0)
    })
    res.clearCookie('refreshToken')
    return res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Error during logout:', error)
    return res.status(500).json({ message: 'Server error during logout' })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id
    if (!profilePic) {
      return res.status(400).json({ message: 'Profile pic is required' })
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }) //return the new one
    res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error during updateProfile:', error)
    res.status(500).json({ message: 'Server error during updateProfile' })
  }
}

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' })
    }
    res.status(200).json(user)
  } catch (error) {
    console.log('Error in checkAuth controller')
    res.status(500).json({ message: 'Error in checkAuth controller' })
  }
}
export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken

  // Debug: log the cookies
  console.log('All cookies:', req.cookies)
  console.log('rftoken', refreshToken)
  if (!refreshToken) {
    return res.status(401).json({ message: "Can't find refreshToken in cookies" })
  }

  try {
    // Add type assertion for decoded
    const decoded = jwt.verify(refreshToken, mySecretKey) as { userID: string }
    const accessToken = jwt.sign({ userID: decoded.userID }, mySecretKey, { expiresIn: '5m' })

    // Return the new access token
    res.status(200).json({ accessToken })
  } catch (error) {
    console.error('Error verifying refresh token:', error)
    res.status(401).json({ message: 'Refresh token is not valid or expired' })
  }
}
