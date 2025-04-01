import { Date, Document } from 'mongoose'

interface IUser extends Document {
  full_name: string
  username: string
  password: string
  email: string
  phone_number?: string
  profile_picture?: string
  created_at: Date
  updated_at: Date
}
export default IUser
