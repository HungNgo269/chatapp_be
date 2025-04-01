import { Document, Types } from 'mongoose'

interface IAttachment {
  file_url: string
  file_type: string
  file_size: number
}

interface IMessage extends Document {
  conversation_id: Types.ObjectId
  sender_id: Types.ObjectId
  receiver_id: Types.ObjectId[]
  content: string
  timestamp: Date
  attachments?: IAttachment[]
  read_by: Types.ObjectId[]
}

export default IMessage
