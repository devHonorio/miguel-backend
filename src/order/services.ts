import { prisma } from '../../prisma/prisma-client'
import { NotFoundError } from '../errors/error-base'
import Order, { OrderItem } from './entities/Order'

interface CreateProps {
  userId: string
  orderItems: OrderItem[]
  addressId?: string
  discount: number
}

const removeDuplicateStrings = (strings: string[]) =>
  strings.reduce((acc, str) => {
    if (acc.find((item) => item === str)) {
      return acc
    }

    return [...acc, str]
  }, [] as string[])

const findCups = async (ids: string[]) => {
  const idsDuplicateRemoved = removeDuplicateStrings(ids)

  return await prisma.cup.findMany({
    where: { id: { in: idsDuplicateRemoved } },
    select: { id: true, price: true, quantity_additional: true },
  })
}

const findAdditional = async (ids: string[]) => {
  const idsDuplicateRemoved = removeDuplicateStrings(ids)

  return await prisma.additional.findMany({
    where: {
      id: {
        in: idsDuplicateRemoved,
      },
    },
    select: { id: true, price: true },
  })
}

const create = async ({
  userId,
  orderItems,
  addressId,
  discount,
}: CreateProps) => {
  const cupsIds = orderItems.map(({ cup_id }) => cup_id)

  const additionalIds = orderItems.reduce((acc, { additional_ids }) => {
    return [...acc, ...additional_ids]
  }, [] as string[])

  const cups = await findCups(cupsIds)
  const additional = await findAdditional(additionalIds)

  const items = Order.createOrderItemsWithPrice({
    cups,
    additional,
    orderItems: orderItems,
  })

  let shipping_price = 0

  if (addressId) {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
      select: { shipping_price: true },
    })

    if (!address)
      throw new NotFoundError({
        action: 'Verifique o "id" do endereço.',
        message: 'Endereço não encontrado.',
      })

    shipping_price = address.shipping_price
  }

  const totalPrice =
    items.reduce((acc, { price }) => acc + price, 0) - discount + shipping_price

  const order = await prisma.order.create({
    data: {
      user_id: userId,
      total_price: totalPrice,
      discount,
      address_id: addressId,

      order_items: {
        create: items.map(({ cup_id, price, additional_ids }) => ({
          cup_id,
          price,
          additional: { connect: additional_ids },
        })),
      },
      status: 'confirmar_pedido',
      shipping_price,
    },
    select: {
      user: { select: { name: true, phone: true } },
      total_price: true,
      order_items: {
        select: {
          price: true,
          cup: { select: { size: true } },
          additional: { select: { name: true } },
        },
      },
      address: { select: { address_complete: true, shipping_price: true } },
    },
  })

  return {
    name: order.user.name,
    phone: order.user.phone,
    orderItems: order.order_items.map((item) => {
      return {
        size: item.cup.size,
        additional: item.additional.map((additional) => additional.name),
        price: item.price,
      }
    }),
    totalPrice: order.total_price,
    address: {
      address: order.address?.address_complete,
      shippingPrice: order.address?.shipping_price,
    },
  }
}

export interface AdminOrderCreateType {
  clientId: string
  cups: Cup[]
  observations?: string
  addressId?: string
  shippingPrice: number
  totalPrice: number
  discount: number
}

interface Cup {
  id: string
  additional: Additional[]
  price: number
}

interface Additional {
  id: string
}

const orderServices = { create }

export default orderServices
