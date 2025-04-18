import express from 'express'
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '~/controllers/contact.controller'
import { protectedRoute } from '~/middlewares/auth.middleware'
const router = express.Router()

router.post('/add-friend-request', sendFriendRequest)
router.post('/accept-friend-request', acceptFriendRequest) //đang lỗi xác thực token
router.post('/reject-friend-request', rejectFriendRequest)

export default router
