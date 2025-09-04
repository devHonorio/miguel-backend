import { Request, Response, NextFunction } from 'express'
import { InternalServerError, UnauthorizedError } from '../errors/error-base'
import jwt from 'jsonwebtoken'

const auth = async (req: Request, res: Response, next: NextFunction) => {
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

const write = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user)
    throw new UnauthorizedError({
      message: 'Usuário não encontrado.',
      action: 'Verifique o token.',
    })

  const { rules: rules } = user

  if (!rules.includes('write:cups'))
    throw new UnauthorizedError({
      action: 'Verifique se usuário tem rule "write:cups".',
      message: 'Usuário não autorizado.',
    })

  next()
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user)
    throw new UnauthorizedError({
      message: 'Usuário não encontrado.',
      action: 'Verifique o token.',
    })

  const { rules } = user

  if (!rules.includes('delete:cups'))
    throw new UnauthorizedError({
      action: 'Verifique se usuário tem rule "delete:cups".',
      message: 'Usuário não autorizado.',
    })

  next()
}

const read = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user)
    throw new UnauthorizedError({
      message: 'Usuário não encontrado.',
      action: 'Verifique o token.',
    })

  const { rules } = user

  if (!rules.includes('read:cups'))
    throw new UnauthorizedError({
      action: 'Verifique se usuário tem rule "read:cups".',
      message: 'Usuário não autorizado.',
    })

  next()
}

const cupsMiddlewares = { write, delete: remove, read, auth }

export default cupsMiddlewares
