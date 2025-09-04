import z, { ZodError } from 'zod'
import { BadRequestError } from '../../errors/error-base'
import { phoneSchema } from '../../entities/Phone'

const UserPropertiesValues = {
  LENGTH_FOR_NAME: 2,
} as const

function haveNameAndLastName(fullname: string) {
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
const rules = z.enum([
  'read:users',
  'write:users',
  'write:cups',
  'delete:cups',
  'read:cups',
  'write:additional',
  'delete:additional',
  'read:orders',
  'delete:orders',
])

export type RulesEnum = z.infer<typeof rules>

export const userSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .transform((name) => User.removeUnwantedCharactersOfName(name))
    .refine((name) => User.haveNameAndLastName(name), {
      message: 'Digite seu nome completo.',
    })
    .refine((name) => User.validationLengthName(name), {
      message: 'Nome não deve ter abreviações.',
    }),
  phone: phoneSchema,
  password: z.string(),
  rules: z.array(rules),
  is_admin: z.boolean().optional(),
})

export type UserType = z.infer<typeof userSchema>

function create(user: UserType) {
  try {
    const { name, password, phone, rules, id } = userSchema.parse(user)

    return {
      id,
      name,
      phone,
      password,
      rules,
    }
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propriedade "${err.issues[0].path}"`,
      cause: error,
    })
  }
}

const User = {
  removeUnwantedCharactersOfName,
  haveNameAndLastName: haveNameAndLastName,
  validationLengthName,
  create,
}

export default User
