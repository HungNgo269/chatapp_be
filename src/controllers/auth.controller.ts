import User from '~/models/User/User.model'
import bcrypt from 'bcryptjs'
import generateToken from '~/utils/jwt'
import { Request, Response } from 'express'
// interface SignupRequest extends Request {
//   body: {
//     username: string
//     password: string
//     email: string
//     full_name: string
//   }
// }
export const signup = async (req: Request, res: Response) => {
  const { username, password, email, full_name } = req.body
  try {
    if (!full_name || !email || !username || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be 6 characters at lease'
      })
    }
    const user_email = await User.findOne({ email })
    if (user_email) {
      return res.status(400).json({ message: 'email already existed' })
    }
    const user_name = await User.findOne({ username })
    if (user_name) {
      return res.status(400).json({ message: 'user name already existed' })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
      full_name,
      username,
      password: hashedPassword,
      email
    })
    if (newUser) {
      generateToken(newUser._id.toString(), res)
      await newUser.save()
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name
      })
    } else {
      res.status(400).json({ message: 'invalid user data' })
    }
  } catch (error: unknown) {
    const err = error as Error
    console.log('error while signup', err.message)
    res.status(500).json({ message: 'Server Error while signup' })
  }
}
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Can't find email or wrong password" })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    //do hàm trên trả về 1 promist chứ không phải là 1 giá trị
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Can't find email or wrong password" })
    }
    generateToken(user._id, res)
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      full_name: user.full_name
    })
  } catch (error: unknown) {
    const err = error as Error
    console.log('error while signup', err.message)
    return res.status(500).json({ message: 'Error while login' })
  }
}
export const logout = (req, res) => {
  res.send('logout route')
}
