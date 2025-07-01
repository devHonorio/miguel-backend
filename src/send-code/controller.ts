import { RequestHandler } from 'express'
import sendCodeServices from './services'
import Phone from '../entities/Phone'
const send: RequestHandler = async (req, res) => {
  const phone = Phone.validate(req.body.phone)

  const { name } = await sendCodeServices.sendCode(phone)

  res.json(name)
}
const sendCodeController = { send }

export default sendCodeController
