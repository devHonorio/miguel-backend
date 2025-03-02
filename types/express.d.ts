// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express'
import { UserType } from '../src/users/entities/User'

declare global {
  namespace Express {
    interface Request {
      user?: Omit<UserType, 'password'>
    }
  }
}
