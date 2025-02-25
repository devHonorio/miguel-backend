import { RequestHandler } from 'express'
import authServices from './services'
import Auth from './entities/Auth'

const login: RequestHandler = async (req, res) => {
  const { password, phone } = Auth.signIn(req.body)

  const access_token = await authServices.login(phone, password)

  res.json({ access_token })
}

const authController = { login }

export default authController
