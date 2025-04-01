import express from 'express'
import { sendPrivateMessage, startPrivateChat } from '~/controllers/converstation.controller'
import { protectedRoute } from '~/middlewares/auth.middleware'
import { getMessages } from '~/services/conversation.sevice'

const router = express.Router()

router.post('/private', protectedRoute, startPrivateChat)

router.post('/message', protectedRoute, sendPrivateMessage)

router.get('/:conversationId/messages', protectedRoute, getMessages)

export default router
