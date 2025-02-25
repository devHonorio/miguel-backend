import { BadRequestError } from '../../errors/error-base'

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

const Auth = { signIn }

export default Auth
