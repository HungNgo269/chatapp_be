import { model, Schema } from 'mongoose'
import IConversation from './IConversation.model'

const conversationSchema = new Schema<IConversation>(
  {
    type: { type: String, enum: ['direct', 'group'], required: true },
    name: { type: String }, // Tên nhóm, không bắt buộc cho hội thoại riêng
    avatar: { type: String },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessages: { type: Schema.Types.ObjectId, ref: 'Message' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    admin: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
)

const Conversation = model<IConversation>('Conversation', conversationSchema)
export default Conversation
