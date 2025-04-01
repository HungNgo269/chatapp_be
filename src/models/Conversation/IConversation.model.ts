import { Document, Types } from 'mongoose'

interface IConversation extends Document {
  type: 'private' | 'group'
  name?: string
  participants: Types.ObjectId[]
  created_at: Date
}

export default IConversation
