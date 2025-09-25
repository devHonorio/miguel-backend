import { RequestHandler } from 'express'
import orderServices from './services'
import Order from './entities/Order'
import Zap from '../entities/Zap'
import { toCentsInBRL } from '../utils/toCentInBRL'
import { prisma } from '../../prisma/prisma-client'
import { InternalServerError } from '../errors/error-base'

const PaymentMethod = {
  pix: 'pix',
  credit: 'cartão de crédito',
  debit: 'cartão de débito',
  cash: 'dinheiro',
}

const create: RequestHandler = async (req, res) => {
  const {
    order_items,
    user_id,
    address_id,
    discount,
    change,
    hour,
    paymentMethod,
  } = Order.createOrder({
    ...req.body,
    user_id: req.user?.id,
  })

  const order = await orderServices.create({
    userId: user_id,
    orderItems: order_items,
    discount,
    addressId: address_id,
    change,
    hour,
    paymentMethod,
  })

  const itemTemplate = order.orderItems.map(
    (item) =>
      `*${item.size}ml ${toCentsInBRL(item.price)}*
${item.additional.map((add) => `- ${add}`).join('\n')}


`,
  )

  const orderTemplate = `Oie, recebemos seu pedido, estou verificando se está tudo certo.
Logo retorno

Para às *${order.hour}*, pagamento no *${PaymentMethod[order.paymentMethod]}* ${order.paymentMethod === 'cash' ? `, troco para *${change}*` : ''}
  
${order.name.toUpperCase()}

${itemTemplate.join('\n')}

${order.address.address ? `${order.address.address.toUpperCase()} \n*${toCentsInBRL(order.address.shippingPrice ?? 4)}*` : 'Retirada no local'}

Total ${toCentsInBRL(order.totalPrice)}
`
  const response = await Zap.sendText(order.phone, orderTemplate)

  if (address_id) {
    await Zap.sendText(order.phone, 'Aguarde a confirmação do valor do frete.')
  }

  if (!response.ok) {
    await prisma.order.delete({ where: { id: order.id } })
    throw new InternalServerError('Falha ao confirmar o pedido com o cliente.')
  }

  res.status(201).json(order)
}

const orderController = { create }

export default orderController
