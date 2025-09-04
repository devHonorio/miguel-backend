import { Request, Response, NextFunction } from 'express'
import Auth from '../../auth/entities/Auth'

const read = async (req: Request, res: Response, next: NextFunction) => {
  Auth.validatePermission({ user: req.user, ruleRequire: 'read:users' })

  next()
}

const usersMiddlewares = { read }

export default usersMiddlewares
