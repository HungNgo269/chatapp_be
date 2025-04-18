import { Date, Document, Schema } from 'mongoose'

interface IUser extends Document {
  first_name: string
  last_name: string
  username: string
  password: string
  day_of_birth: Date
  gender: 'male' | 'female' | 'other'
  email?: string
  phone_number?: string
  avatar?: string
  status: 'online' | 'offline' | 'banned'
  contact: Schema.Types.ObjectId[] //1 mảng các "id friends"
  friend_request_send: Schema.Types.ObjectId[]
  friend_request_receive: Schema.Types.ObjectId[]
  lastSeen: Date
  created_at?: Date
  updated_at?: Date
}
export default IUser
