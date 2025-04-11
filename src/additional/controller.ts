import { RequestHandler } from 'express'
import Additional from './entities/Additional'
import additionalServices from './services'

const create: RequestHandler = async (req, res) => {
  const additionalBody = Additional.create(req.body)

  const additional = await additionalServices.create(additionalBody)

  res.status(201).json(additional)
}

const findAll: RequestHandler = async (req, res) => {
  if (req.user?.is_admin) {
    const additional = await additionalServices.findAll()
    res.json(additional)
    return
  }

  const additional = await additionalServices.findInStock()

  res.json(additional)
}

const findUnique: RequestHandler = async (req, res) => {
  const id = req.params.id

  if (req.user?.is_admin) {
    const additional = await additionalServices.findUnique(id)
    res.json(additional)
    return
  }

  const additional = await additionalServices.findUniqueInStock(id)

  res.json(additional)
}

const update: RequestHandler = async (req, res) => {
  const additionalBody = Additional.update({ id: req.params.id, ...req.body })

  const additional = await additionalServices.update(additionalBody)

  res.json(additional)
}

const remove: RequestHandler = async (req, res) => {
  const additional = await additionalServices.delete(req.params.id)

  res.json(additional)
}

const additionalController = {
  create,
  findAll,
  findUnique,
  update,
  delete: remove,
}

export default additionalController
