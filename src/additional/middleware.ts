import { NextFunction, Request, Response } from 'express'
import { InternalServerError, UnauthorizedError } from '../errors/error-base'
import jwt from 'jsonwebtoken'
import { RulesEnum, UserType } from '../users/entities/User'

const getRules = (user?: Omit<UserType, 'password'>) => {
  if (!user)
    throw new UnauthorizedError({
      message: 'Usuário não encontrado.',
      action: 'Verifique o token.',
    })

  const { rules: rules } = user

  return rules
}

const validatePermission = (
  rules: UserType['rules'],
  ruleRequire: RulesEnum,
) => {
  if (!rules.includes(ruleRequire))
    throw new UnauthorizedError({
      action: `Verifique se usuário tem rule "${ruleRequire}".`,
      message: 'Usuário não autorizado.',
    })
}

const write = async (req: Request, res: Response, next: NextFunction) => {
  const rules = getRules(req.user)

  validatePermission(rules, 'write:additional')

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
  const rules = getRules(req.user)

  validatePermission(rules, 'delete:additional')

  next()
}
const additionalMiddleware = { write, read, delete: remove }

export default additionalMiddleware
