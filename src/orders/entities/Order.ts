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

const schemaBase = z.object({
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
  hour: z.string(),
  paymentMethod: z.enum(['pix', 'credit', 'debit', 'cash']),
  change: z.string(),
  payments: z.array(
    z.object({
      value: z.coerce
        .number({ errorMap: () => ({ message: 'Valor é obrigatório.' }) })
        .int()
        .min(0, 'O valor deve ser maior que R$ 00,00'),
      paymentMethod: z.enum(['pix', 'credit', 'debit', 'cash']),
      date: z.coerce.date(),
    }),
  ),
})

const schemaAdminOrderCreate = schemaBase.refine(
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

const schemaAdminOrderEdit = z
  .object({
    id: z.string(),
    ...schemaBase.shape,
  })
  .refine(
    ({ addressId, shippingPrice }) => {
      if (addressId) return shippingPrice > 0

      return shippingPrice == 0
    },
    { message: 'Preço deve ser maior de R$ 1,00.', path: ['shippingPrice'] },
  )

const edit = (data: unknown) => {
  try {
    return schemaAdminOrderEdit.parse(data)
  } catch (error) {
    const err = error as ZodError

    throw new BadRequestError({
      message: err.issues[0].message,
      action: `Verifique se a propriedade "${err.issues[0].path}" está correta.`,
      cause: error,
    })
  }
}

const Orders = { create, edit }

export default Orders
