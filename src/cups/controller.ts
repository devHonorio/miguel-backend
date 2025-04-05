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

const remove: RequestHandler = async (req, res) => {
  const { size } = Cup.delete(+req.params.size)

  await cupServices.delete(size)

  res.json({ statusCode: 200 })
}

const findUnique: RequestHandler = async (req, res) => {
  const { id } = req.params

  const cup = await cupServices.findUnique(id)

  res.json(cup)
}

const update: RequestHandler = async (req, res) => {
  const cupBory = Cup.update({ id: req.params.id, ...req.body })

  const cup = await cupServices.update(cupBory)

  res.json(cup)
}
const cupsController = { create, findAll, remove, findUnique, update }

export default cupsController
