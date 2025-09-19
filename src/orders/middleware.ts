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

const edit = async (req: Request, res: Response, next: NextFunction) => {
  Auth.validatePermission({ user: req.user, ruleRequire: 'update:orders' })

  next()
}

const create = async (req: Request, res: Response, next: NextFunction) => {
  Auth.validatePermission({ user: req.user, ruleRequire: 'write:orders' })

  next()
}

const ordersMiddleware = { read, delete: remove, edit, create }

export default ordersMiddleware
