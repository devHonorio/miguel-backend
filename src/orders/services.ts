import { prisma } from '../../prisma/prisma-client'
import { NotFoundError } from '../errors/error-base'

export interface AdminOrderCreateType {
  clientId: string
  cups: Cup[]
  observations?: string
  addressId?: string
  shippingPrice: number
  totalPrice: number
  discount: number
  status: 'cancelado' | 'anotado' | 'confirmar_pedido' | 'rascunho'
}

export interface Cup {
  id: string
  additional: Additional[]
  price: number
}

export interface Additional {
  id: string
}
const create = async (data: AdminOrderCreateType) => {
  const order = await prisma.order.create({
    data: {
      user_id: data.clientId,
      order_items: {
        create: data.cups.map((cup) => ({
          cup_id: cup.id,
          price: cup.price,
          additional: { connect: cup.additional },
        })),
      },
      observations: data.observations,
      address_id: data.addressId,
      discount: data.discount,
      total_price: data.totalPrice,
      status: data.status,
      shipping_price: data.shippingPrice,
    },
    select: {
      id: true,
      user: { select: { name: true } },
      total_price: true,
      address_id: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  })
  const {
    user: { name },
    ...rest
  } = order
  return { user: name, ...rest }
}

interface ListOrdersType {
  search: string
  take: number
  skip: number
}
const listOrders = async ({
  search,
  skip: page,
  take: peer_page,
}: ListOrdersType) => {
  const today = new Date()

  today.setHours(0, 0, 0, 0)

  const created_at = !search ? { gte: today } : undefined
  const take = search && peer_page ? peer_page : undefined
  const skip = search && peer_page && page ? page * (take ?? 0) : undefined

  const orders = await prisma.order.findMany({
    where: {
      user: { name: { contains: search, mode: 'insensitive' } },
      created_at,
    },
    take,
    skip,
    select: {
      id: true,
      user: { select: { name: true } },
      total_price: true,
      address_id: true,
      status: true,
      updated_at: true,
      created_at: true,
    },
    orderBy: { updated_at: 'desc' },
  })

  return orders
    .map(
      ({
        address_id,
        id,
        total_price,
        user: { name },
        status,
        updated_at,
        created_at,
      }) => ({
        id,
        user: name,
        address_id,
        total_price,
        status,
        updated_at,
        created_at,
      }),
    )
    .sort((a) => {
      if (a.status === 'confirmar_pedido') return -1

      return 0
    })
}

const remove = async (id: string) => {
  const existsOrder = await prisma.order.findUnique({ where: { id } })

  if (!existsOrder)
    throw new NotFoundError({
      message: 'Order não encontrada!',
      action: 'Atualize a pagina',
    })
  return await prisma.order.delete({ where: { id }, select: { id: true } })
}

const findUnique = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      address: { select: { id: true, address_complete: true } },
      user: { select: { name: true, id: true } },
      discount: true,
      observations: true,
      status: true,
      shipping_price: true,
      total_price: true,
      order_items: {
        select: {
          id: true,
          cup_id: true,
          cup: {
            select: { size: true, price: true, quantity_additional: true },
          },
          additional: { select: { id: true, name: true, price: true } },
          price: true,
        },
      },
    },
  })

  if (!order)
    throw new NotFoundError({
      message: 'Order não encontrada!',
      action: 'Atualize a pagina',
    })

  return {
    address_id: order.address?.id ?? '',
    address_label: order.address?.address_complete ?? '',
    client_id: order.user.id,
    client_label: order.user.name,
    discount: order.discount,
    is_delivery: !!order.address?.id,
    observations: order.observations ?? '',
    shipping_price: order.shipping_price,
    status: order.status,
    total_price: order.total_price,
    cups: order.order_items.map(
      ({
        additional,
        cup_id,

        price: totalPrice,
        cup: { size, price, quantity_additional },
      }) => ({
        additional,
        id: cup_id,
        label: `${size}ml`,
        price: price,
        quantity_additional,
        total_price: totalPrice,
      }),
    ),
  }
}

const ordersServices = { create, listOrders, delete: remove, findUnique }

export default ordersServices
