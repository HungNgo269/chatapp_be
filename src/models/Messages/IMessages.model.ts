import { Document, Types } from 'mongoose'

interface IMessage extends Document {
  conversation_id: Types.ObjectId
  sender_id: Types.ObjectId
  reply_to?: Types.ObjectId
  content: string
  timestamp: Date
  attachments?: string
  status: 'TYPING' | 'SENDING' | 'DELIVERED' | 'READ'
  read_by?: Types.ObjectId[]
  created_at?: Date
  updated_at?: Date
}

export default IMessage
