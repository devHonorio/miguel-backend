import { RequestHandler } from 'express'
import Cup from './entities/Cup'
import cupServices from './services'

const create: RequestHandler = async (req, res) => {
  const cupBory = Cup.create(req.body)

  const cup = await cupServices.create(cupBory)

  res.status(201).json(cup)
}
const cupsController = { create }

export default cupsController
