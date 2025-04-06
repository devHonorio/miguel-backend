import { Request, Response, NextFunction } from 'express'
import { InternalServerError, UnauthorizedError } from '../errors/error-base'
import jwt from 'jsonwebtoken'

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authToken = req.headers.authorization

  if (!authToken)
    throw new UnauthorizedError({
      message: 'Usuário não autorizado.',
      action: 'Verifique se o token foi setado.',
    })

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

    const { name, phone, sub: id, rules } = payload

    req.user = { name, phone, id, rules }

    return next()
  } catch (error) {
    throw new UnauthorizedError({
      message: 'Token inválido.',
      action: 'Verifique o token.',
      cause: error,
    })
  }
}

const authorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user

  if (!user)
    throw new UnauthorizedError({
      message: 'Usuário não encontrado.',
      action: 'Verifique o token.',
    })

  const { rules } = user

  if (!rules.includes('write:users'))
    throw new UnauthorizedError({
      action: 'Verifique se usuário tem rule "write:users".',
      message: 'Usuário não autorizado.',
    })

  next()
}

const UserAuthMiddlewares = { authMiddleware, authorizationMiddleware }

export default UserAuthMiddlewares
