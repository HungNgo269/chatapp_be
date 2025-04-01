import IUser from '~/models/User/IUser.model'

declare module 'express' {
  interface Request {
    user?: IUser
  }
}
