import z, { ZodError } from 'zod'
import { BadRequestError } from '../../errors/error-base'

const cups = z.object({
  id: z.string({
    errorMap: () => ({ message: 'Tamanho do copo é obrigatório.' }),
  }),
  additional: z.array(
    z.object({
      id: z.string({
        errorMap: () => ({ message: 'Identificar o adicional é obrigatório' }),
      }),
    }),
  ),
  price: z.coerce.number({
    errorMap: () => ({ message: 'Preço é obrigatório.' }),
  }),
})

const schemaAdminOrderCreate = z
  .object({
    clientId: z.string({
      errorMap: () => ({ message: 'Cliente é obrigatório' }),
    }),
    cups: z.array(cups),
    observations: z.string().optional(),
    addressId: z
      .string({
        errorMap: () => ({ message: 'Endereço é obrigatório' }),
      })
      .transform((val) => (!val ? undefined : val)),
    shippingPrice: z.coerce.number({
      errorMap: () => ({ message: 'Preço é obrigatório.' }),
    }),
    discount: z.coerce.number().default(0),
    totalPrice: z.coerce
      .number({ errorMap: () => ({ message: 'Preço é obrigatório.' }) })
      .min(1, 'Preço deve ser maior de R$ 0,01.'),
    status: z.enum(['cancelado', 'anotado', 'confirmar_pedido', 'rascunho']),
  })
  .refine(
    ({ addressId, shippingPrice }) => {
      if (addressId) return shippingPrice > 0

      return shippingPrice == 0
    },
    { message: 'Preço deve ser maior de R$ 1,00.', path: ['shippingPrice'] },
  )

const create = (data: unknown) => {
  try {
    return schemaAdminOrderCreate.parse(data)
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propriedade "${err.issues[0].path}" está correta.`,
      cause: error,
    })
  }
}

const Orders = { create }

export default Orders
