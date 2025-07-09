import { RequestHandler } from 'express'
import userServices from './services'
import User from './entities/User'

const create: RequestHandler = async (req, res) => {
  const userBody = User.create(req.body)

  const user = await userServices.create(userBody)

  res.status(201).json(user)
}

const search: RequestHandler = async (req, res) => {
  const users = await userServices.search(req.params.query)

  res.json(users)
}
const usersController = { create, search }

export default usersController
