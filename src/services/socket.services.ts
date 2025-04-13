import { Server, Socket } from 'socket.io'
import http from 'http'
import { verifyToken } from '~/utils/jwt'

export interface IUserSocket {
  userId: string
  socketId: string
}

export class SocketService {
  private io: Server
  private onlineUsers: Map<string, string> = new Map() // userId -> socketId

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    })

    this.setupMiddleware()
    this.setupEventHandlers()
  }

  private setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token
        if (!token) {
          return next(new Error('Authentication error'))
        }

        const decoded = await verifyToken(token)
        socket.data.user = decoded
        next()
      } catch (error) {
        next(new Error('Authentication error'))
      }
    })
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket)

      socket.on('disconnect', () => {
        this.handleDisconnect(socket)
      })

      socket.on('send-message', (data) => {
        this.handleSendMessage(socket, data)
      })

      socket.on('typing', (data) => {
        this.handleTyping(socket, data)
      })
    })
  }

  private handleConnection(socket: Socket) {
    const userId = socket.data.user.id
    this.onlineUsers.set(userId, socket.id)

    // Join user to their conversation rooms
    this.joinUserRooms(socket, userId)

    // Broadcast user online status
    this.io.emit('user-status', {
      userId,
      status: 'online'
    })
  }

  private handleDisconnect(socket: Socket) {
    const userId = socket.data.user?.id
    if (userId) {
      this.onlineUsers.delete(userId)

      // Broadcast user offline status
      this.io.emit('user-status', {
        userId,
        status: 'offline',
        lastSeen: new Date()
      })
    }
  }

  private handleSendMessage(socket: Socket, data: any) {
    const { conversationId, message } = data

    // phát sự kiện recevier-message cho conversationId
    socket.to(conversationId).emit('receive-message', message)

    // Send delivery status
    this.sendDeliveryStatus(conversationId, message._id)
  }

  private handleTyping(socket: Socket, data: any) {
    const { conversationId, isTyping } = data
    const user = socket.data.user

    socket.to(conversationId).emit('typing-status', {
      userId: user.id,
      username: user.username,
      isTyping,
      conversationId
    })
  }

  private async joinUserRooms(socket: Socket, userId: string) {
    // Implementation to fetch user's conversations and join those rooms
    try {
      // This would typically query your database for the user's conversations
      // const conversations = await Conversation.find({ participants: userId }).select('_id');
      // For each conversation, join the room
      // conversations.forEach(conversation => {
      //   socket.join(conversation._id.toString());
      // });
    } catch (error) {
      console.error('Error joining user rooms:', error)
    }
  }

  private sendDeliveryStatus(conversationId: string, messageId: string) {
    // Implementation to update message status to 'delivered'
  }

  // Public methods
  public getOnlineUsers(): Map<string, string> {
    return this.onlineUsers
  }

  public isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId)
  }

  public getUserSocket(userId: string): string | undefined {
    return this.onlineUsers.get(userId)
  }
}
