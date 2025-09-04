import { RequestHandler } from 'express'
import orderServices from './services'

import Orders from './entities/Order'
import ordersServices from './services'

const adminOrderCreate: RequestHandler = async (req, res) => {
  const body = Orders.create(req.body)

  const order = await ordersServices.create(body)

  res.status(201).json(order)
}

const listOrders: RequestHandler = async (req, res) => {
  const search = req.query.search as string
  const take = req.query.take as string
  const skip = req.query.skip as string

  const orders = await orderServices.listOrders({
    search: search?.trim(),
    take: +take,
    skip: +skip,
  })

  res.json(orders)
}

const remove: RequestHandler = async (req, res) => {
  const order = await orderServices.delete(req.params.id)

  res.json(order)
}

const findUnique: RequestHandler = async (req, res) => {
  const order = await orderServices.findUnique(req.params.id)

  res.json(order)
}

const ordersController = {
  adminOrderCreate,
  listOrders,
  delete: remove,
  findUnique,
}

export default ordersController
