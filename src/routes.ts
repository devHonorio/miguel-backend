import { Router } from 'express'
import usersController from './users/controller'
import authController from './auth/controller'
import UserAuthMiddlewares from './auth/middleware'
import cupsController from './cups/controller'
import cupsMiddlewares from './cups/middleware'
import additionalController from './additional/controller'
import additionalMiddleware from './additional/middleware'
import addressController from './address/controller'

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

// cups
routes.post(
  '/cups',
  UserAuthMiddlewares.authMiddleware,
  cupsMiddlewares.write,
  cupsController.create,
)

routes.get('/cups', cupsMiddlewares.auth, cupsController.findAll)

routes.delete(
  '/cups/:size',
  UserAuthMiddlewares.authMiddleware,
  cupsMiddlewares.delete,
  cupsController.remove,
)

routes.get('/cups/:id', cupsMiddlewares.auth, cupsController.findUnique)

routes.patch(
  '/cups/:id',
  UserAuthMiddlewares.authMiddleware,
  cupsMiddlewares.write,
  cupsController.update,
)

// additional
routes.post(
  '/additional',
  UserAuthMiddlewares.authMiddleware,
  additionalMiddleware.write,
  additionalController.create,
)

routes.get(
  '/additional',
  additionalMiddleware.read,
  additionalController.findAll,
)

routes.get(
  '/additional/:id',
  additionalMiddleware.read,
  additionalController.findUnique,
)

routes.patch(
  '/additional/:id',
  UserAuthMiddlewares.authMiddleware,
  additionalMiddleware.write,
  additionalController.update,
)

routes.delete(
  '/additional/:id',
  UserAuthMiddlewares.authMiddleware,
  additionalMiddleware.delete,
  additionalController.delete,
)

// address
routes.post(
  '/address',
  UserAuthMiddlewares.authMiddleware,
  addressController.create,
)

routes.get(
  '/address/search/:query',
  UserAuthMiddlewares.authMiddleware,
  addressController.search,
)
