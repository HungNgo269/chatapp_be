import { Date, Document } from 'mongoose'

interface IUser extends Document {
  first_name: string
  last_name: string
  username: string
  password: string
  day_of_birth: Date
  gender: 'male' | 'female' | 'other'
  email?: string
  phone_number?: string
  profile_picture?: string
  created_at: Date
  updated_at: Date
}
export default IUser
