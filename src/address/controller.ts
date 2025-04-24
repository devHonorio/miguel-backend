import { RequestHandler } from 'express'
import Address from './entities/Address'
import addressServices from './services'

const create: RequestHandler = async (req, res) => {
  const addressBody = Address.create(req.body)

  const address = await addressServices.create(addressBody)

  res.status(201).json(address)
}

const addressController = { create }

export default addressController
