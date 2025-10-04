import z, { ZodError } from 'zod'
import { BadRequestError } from '../../errors/error-base'
import { addressSchema } from '../../address/entities/Address'

const createAddressSchema = addressSchema
  .extend({
    shipping_price: z.coerce
      .number({ errorMap: () => ({ message: 'Preço é obrigatório' }) })
      .int()
      .positive('Preço deve ser maior que R$ 00,00.'),
  })
  .omit({ user_id: true })

const create = (data: unknown) => {
  try {
    const userSchemaWithAddressComplete = createAddressSchema.transform(
      (data) => ({
        ...data,
        address_complete:
          `${data.street} - ${data.number}, ${data.district}, ${data.city}, ${data.complement}`.toLocaleLowerCase(),
      }),
    )

    return userSchemaWithAddressComplete.parse(data)
  } catch (error) {
    const err = error as ZodError

    const currentError = err.errors[0]

    throw new BadRequestError({
      action: `Verifique a propriedade "${currentError.path}".`,
      message: currentError.message,
    })
  }
}

const update = (data: unknown) => {
  try {
    const userSchemaWithAddressComplete = createAddressSchema
      .extend({ id: z.string() })
      .transform((data) => ({
        ...data,
        address_complete:
          `${data.street} - ${data.number}, ${data.district}, ${data.city}, ${data.complement}`.toLocaleLowerCase(),
      }))

    return userSchemaWithAddressComplete.parse(data)
  } catch (error) {
    const err = error as ZodError

    const currentError = err.errors[0]

    throw new BadRequestError({
      action: `Verifique a propriedade "${currentError.path}".`,
      message: currentError.message,
    })
  }
}

const Addresses = { create, update }

export default Addresses
