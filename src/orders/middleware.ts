import { NextFunction, Request, Response } from 'express'
import Auth from '../auth/entities/Auth'

const read = async (req: Request, res: Response, next: NextFunction) => {
  Auth.validatePermission({ user: req.user, ruleRequire: 'read:orders' })

  next()
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  Auth.validatePermission({ user: req.user, ruleRequire: 'delete:orders' })

  next()
}

const ordersMiddleware = { read, delete: remove }

export default ordersMiddleware
