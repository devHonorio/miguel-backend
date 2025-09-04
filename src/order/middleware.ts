import { NextFunction, Request, Response } from 'express'
import { InternalServerError, UnauthorizedError } from '../errors/error-base'
import jwt from 'jsonwebtoken'
import Auth from '../auth/entities/Auth'

const write = async (req: Request, res: Response, next: NextFunction) => {
  Auth.validatePermission({ user: req.user, ruleRequire: 'write:additional' })

  next()
}

const read = async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization

  if (authToken) {
    const [type, token] = authToken.split(' ')

    if (type !== 'Bearer')
      throw new UnauthorizedError({
        message: 'Usuário não autorizado.',
        action: 'Verifique o se o tipo do token é "Bearer"',
      })

    try {
      const payload = jwt.verify(token, process.env.SECRET!)

      if (typeof payload === 'string')
        throw new InternalServerError('Payload não pode ser uma string.')

      const { name, phone, sub: id, rules, is_admin } = payload

      req.user = { name, phone, id, rules, is_admin }
    } catch (error) {
      throw new UnauthorizedError({
        message: 'Token inválido.',
        action: 'Verifique o token.',
        cause: error,
      })
    }
  }

  next()
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  Auth.validatePermission({ user: req.user, ruleRequire: 'delete:additional' })

  next()
}
const additionalMiddleware = { write, read, delete: remove }

export default additionalMiddleware
