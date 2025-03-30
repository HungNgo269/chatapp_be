import { model, Schema } from 'mongoose'
import IUser from './IUser'
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, unique: true, sparse: true }, // sparse cho phép null nhưng vẫn unique nếu có giá trị
  full_name: { type: String, required: true },
  profile_picture: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})
const User = model<IUser>('User', userSchema)
export default User
