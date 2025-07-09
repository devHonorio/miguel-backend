import jwt from 'jsonwebtoken'

import { BadRequestError, UnauthorizedError } from '../../errors/error-base'
import { RulesEnum, UserType } from '../../users/entities/User'

interface SignInProps {
  phone: string
  password: string
}
function signIn({ password, phone }: SignInProps) {
  if (!phone)
    throw new BadRequestError({
      action: 'Verifique se "phone" foi enviado.',
      message: 'Telefone é obrigatório.',
    })

  if (!password)
    throw new BadRequestError({
      action: 'Verifique se "password" foi enviado.',
      message: 'Senha é obrigatória.',
    })

  return {
    password,
    phone,
  }
}

const generateToken = ({
  name,
  phone,
  rules,
  id,
  is_admin = false,
}: Required<Omit<UserType, 'password'>>) => {
  const access_token = jwt.sign(
    {
      name: name,
      phone: phone,
      rules: rules as UserType['rules'],
      is_admin,
    },
    process.env.SECRET!,
    { subject: id, expiresIn: '500d' },
  )

  return access_token
}

const getRules = (user?: Omit<UserType, 'password'>) => {
  if (!user)
    throw new UnauthorizedError({
      message: 'Usuário não encontrado.',
      action: 'Verifique o token.',
    })

  const { rules: rules } = user

  return rules
}

interface ValidatePermission {
  user?: Omit<UserType, 'password'>
  ruleRequire: RulesEnum
}
const validatePermission = ({ ruleRequire, user }: ValidatePermission) => {
  const rules = getRules(user)

  if (!rules.includes(ruleRequire))
    throw new UnauthorizedError({
      action: `Verifique se usuário tem rule "${ruleRequire}".`,
      message: 'Usuário não autorizado.',
    })
}
const Auth = { signIn, generateToken, validatePermission }

export default Auth
