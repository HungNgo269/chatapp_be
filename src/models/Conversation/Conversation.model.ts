import { model, Schema } from 'mongoose'
import IConversation from './IConversation.model'

const conversationSchema = new Schema<IConversation>({
  type: { type: String, enum: ['private', 'group'], required: true },
  name: { type: String }, // Tên nhóm, không bắt buộc cho hội thoại riêng
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  created_at: { type: Date, default: Date.now }
})

const Conversation = model<IConversation>('Conversation', conversationSchema)
export default Conversation
