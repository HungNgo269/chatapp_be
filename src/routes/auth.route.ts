import express from 'express'
import { checkAuth, login, logout, refreshToken, signup, updateProfile } from '~/controllers/auth.controller'
import { protectedRoute } from '~/middlewares/auth.middleware'

const router = express.Router()

//POST	Create GET	Read/retrieve
// PUT	Update hết, tương tự với ghi đè  thay đổi lên mọi field
// PATCH cũng update nhưng nhẹ đô hơn, chỉ thay đổi những field được yêu cầu
// DELETE	Delete

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.put('/update-profile', protectedRoute, updateProfile)
router.get('/check', protectedRoute, checkAuth)
router.get('/refresh-token', protectedRoute, refreshToken)
export default router
