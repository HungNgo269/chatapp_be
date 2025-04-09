import { model, Schema } from 'mongoose'
import IUser from './IUser.model'
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone_number: { type: String, unique: true, sparse: true }, // sparse cho phép null nhưng vẫn unique nếu có giá trị
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  day_of_birth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  profile_picture: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})
const User = model<IUser>('User', userSchema)
export default User
