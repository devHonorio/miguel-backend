import { NextFunction, Request, Response } from 'express'
import { InternalServerError, UnauthorizedError } from '../errors/error-base'
import jwt from 'jsonwebtoken'

const write = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user)
    throw new UnauthorizedError({
      message: 'Usuário não encontrado.',
      action: 'Verifique o token.',
    })

  const { rules: rules } = user

  if (!rules.includes('write:additional'))
    throw new UnauthorizedError({
      action: 'Verifique se usuário tem rule "write:additional".',
      message: 'Usuário não autorizado.',
    })

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
const additionalMiddleware = { write, read }

export default additionalMiddleware
