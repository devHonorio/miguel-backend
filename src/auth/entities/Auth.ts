import jwt from 'jsonwebtoken'

import { BadRequestError } from '../../errors/error-base'
import { UserType } from '../../users/entities/User'

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
const Auth = { signIn, generateToken }

export default Auth
