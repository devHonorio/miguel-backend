import { Router } from 'express'
import usersController from './users/controller'
import authController from './auth/controller'
import UserAuthMiddlewares from './auth/middleware'

export const routes = Router()

// session
routes.post('/login', authController.login)

// users
routes.post(
  '/users',
  UserAuthMiddlewares.authMiddleware,
  UserAuthMiddlewares.authorizationMiddleware,
  usersController.create,
)
