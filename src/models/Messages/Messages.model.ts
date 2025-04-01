import { model, Schema } from 'mongoose'
import IMessage from './IMessages.model'

const messageSchema = new Schema<IMessage>({
  conversation_id: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  //nếu không truyền trường attachments thì moongose tự dộng cho nó rỗng
  attachments: [
    {
      file_url: { type: String, required: true },
      file_type: { type: String, required: true },
      file_size: { type: Number, required: true }
    }
  ],
  read_by: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

const Message = model<IMessage>('Message', messageSchema)
export default Message
