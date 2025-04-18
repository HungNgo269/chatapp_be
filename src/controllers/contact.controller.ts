import { Request, Response } from 'express'
import mongoose from 'mongoose'
import User from '~/models/User/User.model'
export const sendFriendRequest = async (req: Request, res: Response) => {
  const { userId, friendId } = req.body
  try {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: 'ID người dùng hoặc bạn bè không hợp lệ' })
    }
    if (userId === friendId) {
      return res.status(400).json({ message: 'Không thể gửi lời mời kết bạn cho chính mình' })
    }
    const user = await User.findById(userId)
    const friend = await User.findById(friendId)
    if (!user || !friend) {
      return res.status(404).json({ message: 'Người dùng hoặc bạn bè không tồn tại' })
    }
    if (user.status === 'banned' || friend.status === 'banned') {
      return res.status(403).json({ message: 'Không thể gửi lời mời vì một trong hai người dùng bị cấm' })
    }

    if (user.contact.includes(friendId)) {
      return res.status(400).json({ message: 'Người dùng này đã là bạn bè' })
    }

    if (friend.friend_request_receive.includes(userId)) {
      return res.status(400).json({ message: 'Lời mời kết bạn đã được gửi trước đó' })
    }
    friend.friend_request_receive.push(userId)
    user.friend_request_send.push(friendId)
    await friend.save()
    return res.status(200).json({ message: 'Gửi lời mời kết bạn thành công' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Lỗi server khi gửi lời mời kết bạn' })
  }
}
export const acceptFriendRequest = async (req: Request, res: Response) => {
  const { userId, friendId } = req.body
  try {
    const user = await User.findById(userId)
    const friend = await User.findById(friendId)
    if (!user || !friend) {
      return res.status(404).json({ message: 'Người dùng hoặc bạn bè không tồn tại' })
    }
    user?.contact.push(friendId)
    friend?.contact.push(userId)

    friend.friend_request_receive = friend.friend_request_receive.filter((id) => id.toString() !== userId)

    user.friend_request_send = user.friend_request_send.filter((id) => id.toString() !== friendId)

    await user.save()
    await friend.save()

    return res.status(200).json({ message: 'Chấp nhận lời mời kết bạn thành công', contact: user.contact })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Lỗi server khi chấp nhận lời mời kết bạn' })
  }
}
export const rejectFriendRequest = async (req: Request, res: Response) => {
  try {
    const { userId, friendId } = req.body
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: 'ID người dùng hoặc bạn bè không hợp lệ' })
    }
    const user = await User.findById(userId)
    if (!user?.friend_request.includes(friendId)) {
      return res.status(400).json({ message: 'Không tìm thấy lời mời kết bạn từ người dùng này' })
    }

    user.friend_request = user.friend_request.filter((id) => id.toString() !== friendId)
    await user.save()

    return res.status(200).json({ message: 'Từ chối lời mời kết bạn thành công' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Lỗi server khi từ chối lời mời kết bạn' })
  }
}
