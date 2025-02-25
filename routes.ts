import { Router } from 'express'
import usersController from './users/controller'

export const routes = Router()

routes.post('/users', usersController.create)
