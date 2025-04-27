import { RequestHandler } from 'express'
import Address from './entities/Address'
import addressServices from './services'

const create: RequestHandler = async (req, res) => {
  const addressBody = Address.create(req.body)

  const address = await addressServices.create(addressBody)

  res.status(201).json(address)
}

const search: RequestHandler = async (req, res) => {
  const query = req.params.query

  const addresses = await addressServices.search(query)

  res.json(addresses)
}

const addressController = { create, search }

export default addressController
