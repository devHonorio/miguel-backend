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

const additionalController = { create, findAll }

export default additionalController
