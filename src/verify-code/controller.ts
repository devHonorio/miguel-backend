import { RequestHandler } from 'express'
import Auth from '../auth/entities/Auth'
import verifyCodeServices from './services'
import { UserType } from '../users/entities/User'
import Phone from '../entities/Phone'

const verify: RequestHandler = async (req, res) => {
  const { phone: phoneReq, code } = req.body
  const phone = Phone.validate(phoneReq)
  const {
    id,
    name,
    phone: phoneUser,
    rules,
  } = await verifyCodeServices.verify(phone, code)

  const accessToken = Auth.generateToken({
    id,
    name,
    phone: phoneUser,
    rules: rules as UserType['rules'],
    is_admin: false,
  })

  res.json(accessToken)
}
const verifyCodeController = { verify }

export default verifyCodeController
