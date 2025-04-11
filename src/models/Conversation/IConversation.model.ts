import { Document, Types } from 'mongoose'

interface IConversation extends Document {
  type: 'direct' | 'group'
  name?: string
  avatar?: string
  participants: Types.ObjectId[]
  lastMessages?: Types.ObjectId
  createdBy?: Types.ObjectId
  admin?: Types.ObjectId[]
  created_at?: Date
  updated_at?: Date
}

export default IConversation
