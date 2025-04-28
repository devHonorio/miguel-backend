import { RequestHandler } from 'express'
import Address from './entities/Address'
import addressServices from './services'

const create: RequestHandler = async (req, res) => {
  const addressBody = Address.create(req.body)

  const address = await addressServices.create({
    ...addressBody,
    user_id: req.user?.id,
  })

  res.status(201).json(address)
}

const search: RequestHandler = async (req, res) => {
  const query = req.params.query

  const addresses = await addressServices.search(query)

  res.json(addresses)
}

const listAddressOfUser: RequestHandler = async (req, res) => {
  const address = await addressServices.listAddressOfUser(req.user!.id!)
  res.json(address)
}

const addressController = { create, search, listAddressOfUser }

export default addressController
