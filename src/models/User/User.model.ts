import { model, Schema } from 'mongoose'
import IUser from './IUser.model'
const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone_number: { type: String, unique: true, sparse: true }, // sparse cho phép null nhưng vẫn unique nếu có giá trị
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    day_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    avatar: { type: String },
    status: { type: String, enum: ['online', 'offline', 'banned'] },
    contact: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastSeen: { type: Date, defaul: Date.now }
  },
  { timestamps: true }
)
const User = model<IUser>('User', userSchema)
export default User
