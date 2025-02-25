import { RequestHandler } from 'express'
import userServices from './services'
import User from './entities/User'

const create: RequestHandler = async (req, res) => {
  const userBody = User.create(req.body)

  const user = await userServices.create(userBody)

  res.status(201).json(user)
}
const usersController = { create }

export default usersController
