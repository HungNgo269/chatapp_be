import { model, Schema } from 'mongoose'
import IMessage from './IMessages.model'

const messageSchema = new Schema<IMessage>(
  {
    conversation_id: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reply_to: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    content: {
      type: String,
      // content hoặc attachments phải không rỗng
      required: function () {
        return (this as any).attachments.length === 0
      }
    },
    //nếu không truyền trường attachments thì moongose
    //  tự dộng cho nó rỗng
    attachments: [
      {
        type: String,
        default: []
      }
    ],
    status: { type: String, enum: ['TYPING', 'SENDING', 'DELIVERED', 'READ'], require: true },
    read_by: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
)

const Message = model<IMessage>('Message', messageSchema)
export default Message
