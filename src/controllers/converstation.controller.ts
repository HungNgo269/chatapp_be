import { Request, Response } from 'express'
import User from '~/models/User/User.model'
import { createPrivateConversation, getMessages, sendMessage } from '~/services/conversation.sevice'
// temporary for friendlist
export const getUserForSideBar = async (req: Request, res: Response) => {
  try {
    const loggedinUserId = req.user?._id
    const filteredUser = await User.find({ _id: { $ne: loggedinUserId } }).select('-password')
    res.status(200).json(filteredUser)
  } catch (error) {
    res.status(500).json({ message: 'Error creating getUserForSideBar', error })
  }
}
export const startPrivateChat = async (req: Request, res: Response) => {
  try {
    const { userId1, userId2 } = req.body
    const conversation = await createPrivateConversation(userId1, userId2)
    res.status(201).json(conversation)
  } catch (error) {
    res.status(500).json({ message: 'Error creating conversation', error })
  }
}
export const sendPrivateMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params
    const { senderId, content } = req.body
    const messageSend = await sendMessage(conversationId, senderId, content)
    res.status(201).json(messageSend)
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error })
  }
}
export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params
    const messageReceived = await getMessages(conversationId)
    res.status(201).json(messageReceived)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error })
  }
}
