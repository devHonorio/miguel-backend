import { RequestHandler } from 'express'
import addressesServices from './services'
import Addresses from './entities/Addresses'

const create: RequestHandler = async (req, res) => {
  const addressBody = Addresses.create(req.body)

  const address = await addressesServices.create(addressBody)

  res.status(201).json(address)
}

const listAddress: RequestHandler = async (req, res) => {
  const { take = 10, page = 0, query = '' } = req.query

  const addresses = await addressesServices.listAddress(
    Number(take),
    Number(page),
    String(query),
  )
  res.json(addresses)
}

const remove: RequestHandler = async (req, res) => {
  const address = await addressesServices.delete(req.params.id)

  res.json(address)
}

const findUnique: RequestHandler = async (req, res) => {
  const address = await addressesServices.findUnique(req.params.id)
  res.json(address)
}

const update: RequestHandler = async (req, res) => {
  const addressBody = Addresses.update({ ...req.body, id: req.params.id })

  const address = await addressesServices.update(addressBody)

  res.status(201).json(address)
}

const addressesController = {
  create,
  listAddress,
  delete: remove,
  findUnique,
  update,
}

export default addressesController
