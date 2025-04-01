import Conversation from '~/models/Conversation/Conversation.model'
import Message from '~/models/Messages/Messages.model'

export const createPrivateConversation = async (userId1: string, userId2: string) => {
  const existingConversation = await Conversation.findOne({
    type: 'private',
    participants: { $all: [userId1, userId2], $size: 2 }
    //=>make sure only 2 user and both of them in the conv
  })
  if (existingConversation) {
    return existingConversation
  }
  const conversation = new Conversation({
    type: 'private',
    participants: [userId1, userId2]
  })
  await conversation.save()
  return conversation
}

export const sendMessage = async (conversationId: string, senderId: string, content: string) => {
  const message = new Message({ conversation_id: conversationId, sender_id: senderId, content: content })
  await message.save()
  return message
}

export const getMessages = async (conversationId: string) => {
  return await Message.find({ conversation_id: conversationId }).sort({ timestamp: 1 }) //1 tăng -1 giảm dần
}
