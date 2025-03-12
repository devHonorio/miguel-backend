import z, { ZodError } from 'zod'
import { BadRequestError } from '../../errors/error-base'

const UserPropertiesValues = {
  PHONE_LENGTH: 11,
  LENGTH_FOR_NAME: 2,
} as const

function phoneValidator(phone: string) {
  return User.removePhoneStr(phone).length === UserPropertiesValues.PHONE_LENGTH
}

function removePhoneStr(phone: string) {
  return phone.replace(/[^0-9]/g, '')
}

function haveNameAndLastname(fullname: string) {
  return fullname.includes(' ')
}

function validationLengthName(fullname: string) {
  const splitName = fullname.split(' ')

  const shortName = splitName.filter(
    (name) => name.length < UserPropertiesValues.LENGTH_FOR_NAME,
  )

  return shortName.length === 0
}

function removeUnwantedCharactersOfName(fullname: string) {
  return fullname.replace(/[^a-zA-Z\sçãẽĩõũâêîôûéóáíú]/g, '').trim()
}

const userSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .transform((name) => User.removeUnwantedCharactersOfName(name))
    .refine((name) => User.haveNameAndLastname(name), {
      message: 'Digite seu nome completo.',
    })
    .refine((name) => User.validationLengthName(name), {
      message: 'Nome não deve ter abreviações.',
    }),
  phone: z
    .string({
      required_error: 'Telefone é obrigatório.',
    })
    .transform((phone) => User.removePhoneStr(phone))
    .refine((phone) => User.phoneValidator(phone), {
      message: 'Telefone deve conter 11 dígitos contendo DDD e o digito 9.',
    }),
  password: z.string(),
  rulles: z.array(
    z.enum([
      'read:users',
      'write:users',
      'write:cups',
      'delete:cups',
      'read:cups',
    ]),
  ),
})

export type UserType = z.infer<typeof userSchema>

function create(user: UserType) {
  try {
    const { name, password, phone, rulles, id } = userSchema.parse(user)

    return {
      id,
      name,
      phone,
      password,
      rulles,
    }
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propiedade "${err.issues[0].path}"`,
      cause: error,
    })
  }
}

const User = {
  removeUnwantedCharactersOfName,
  haveNameAndLastname,
  validationLengthName,
  removePhoneStr,
  phoneValidator,
  create,
}

export default User
