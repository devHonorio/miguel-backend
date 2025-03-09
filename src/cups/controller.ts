import { RequestHandler } from 'express'
import Cup from './entities/Cup'
import cupServices from './services'

const create: RequestHandler = async (req, res) => {
  const cupBory = Cup.create(req.body)

  const cup = await cupServices.create(cupBory)

  res.status(201).json(cup)
}

const findAll: RequestHandler = async (req, res) => {
  const cups = await cupServices.findAll()
  res.json(cups)
}

const cupsController = { create, findAll }

export default cupsController
