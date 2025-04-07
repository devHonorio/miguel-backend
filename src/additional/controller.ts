import { RequestHandler } from 'express'
import Additional from './entities/Additional'
import additionalServices from './services'

const create: RequestHandler = async (req, res) => {
  const additionalBody = Additional.create(req.body)

  const additional = await additionalServices.create(additionalBody)

  res.status(201).json(additional)
}

const additionalController = { create }

export default additionalController
