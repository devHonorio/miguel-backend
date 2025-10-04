import { Request, Response, NextFunction } from 'express'
import Auth from '../auth/entities/Auth'

const write = async (req: Request, res: Response, next: NextFunction) => {
  Auth.validatePermission({ user: req.user, ruleRequire: 'write:addresses' })

  next()
}
const read = async (req: Request, res: Response, next: NextFunction) => {
  Auth.validatePermission({ user: req.user, ruleRequire: 'read:addresses' })

  next()
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  Auth.validatePermission({ user: req.user, ruleRequire: 'delete:addresses' })

  next()
}

const addressesMiddleware = { read, write, delete: remove }

export default addressesMiddleware
