import { Router } from 'express'
import usersController from './users/controller'
import authController from './auth/controller'

export const routes = Router()

routes.post('/users', usersController.create)
routes.post('/login', authController.login)
