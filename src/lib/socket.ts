import { Server, Socket } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST']
  }
})
io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', data)
  })
})
export { io, app, server }
