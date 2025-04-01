import User from '~/models/User/User.model'
import bcrypt from 'bcryptjs'
import generateToken from '~/utils/jwt'
import { Request, Response } from 'express'
import cloudinary from '~/lib/cloudiary'
import IUser from '~/models/User/IUser.model'

interface SignupRequest extends Request {
  body: {
    username: string
    password: string
    email: string
    full_name: string
  }
}

interface LoginRequest extends Request {
  body: {
    email: string
    password: string
  }
}
// interface AuthRequest extends Request {
//   body: {
//     user: IUser
//   }
// }
export const signup = async (req: SignupRequest, res: Response) => {
  const { username, password, email, full_name } = req.body
  try {
    if (!full_name || !email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' })
    }
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
      full_name,
      username,
      password: hashedPassword,
      email
    })

    await newUser.save()
    const token = generateToken(newUser._id.toString(), res)

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      full_name: newUser.full_name,
      token
    })
  } catch (error) {
    console.error('Error during signup:', error)
    res.status(500).json({ message: 'Server error during signup' })
  }
}

export const login = async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user._id.toString(), res)
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      token
    })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: 'Server error during login' })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0)
    })
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
