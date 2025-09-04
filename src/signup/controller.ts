import { RequestHandler } from 'express'
import { userSchema } from '../users/entities/User'
import z from 'zod'
import signupServices from './services'

const createUserSchema = userSchema.pick({ name: true, phone: true })

export type CreateUser = z.infer<typeof createUserSchema>
const signup: RequestHandler = async (req, res) => {
  const { name, phone } = createUserSchema.parse(req.body)

  await signupServices.create({ name, phone })

  res
    .status(201)
    .json({ statusCode: 201, message: 'Usuário criado com sucesso.' })
}
const signupController = { signup }

export default signupController
