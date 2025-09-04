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

const remove: RequestHandler = async (req, res) => {
  const address = await addressServices.delete(req.params.id, req.user?.id)
  res.json(address)
}

const setAddress: RequestHandler = async (req, res) => {
  const address = await addressServices.set(req.params.id, req.user?.id)
  res.json(address)
}

const findUnique: RequestHandler = async (req, res) => {
  const address = await addressServices.findUnique(req.params.id)
  res.json(address)
}

const addressController = {
  create,
  search,
  listAddressOfUser,
  delete: remove,
  setAddress,
  findUnique,
}

export default addressController
