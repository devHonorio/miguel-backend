import { Router } from 'express'
import usersController from './users/controller'
import authController from './auth/controller'
import UserAuthMiddlewares from './auth/middleware'
import cupsController from './cups/controller'
import cupsMiddlewares from './cups/middleware'
import additionalController from './additional/controller'
import additionalMiddleware from './additional/middleware'
import addressController from './address/controller'
import orderController from './order/controller'
import sendCodeController from './send-code/controller'
import verifyCodeController from './verify-code/controller'
import signupController from './signup/controller'
import usersMiddlewares from './users/entities/middleware'

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

routes.get(
  '/users/:query',
  UserAuthMiddlewares.authMiddleware,
  usersMiddlewares.read,
  usersController.search,
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

routes.get(
  '/address/user',
  UserAuthMiddlewares.authMiddleware,
  addressController.listAddressOfUser,
)

routes.delete(
  '/address/user/:id',
  UserAuthMiddlewares.authMiddleware,
  addressController.delete,
)

routes.post(
  '/address/user/:id',
  UserAuthMiddlewares.authMiddleware,
  addressController.setAddress,
)

routes.get(
  '/address/:id',
  UserAuthMiddlewares.authMiddleware,
  addressController.findUnique,
)

// order
routes.post(
  '/order',
  UserAuthMiddlewares.authMiddleware,
  orderController.create,
)

// send-code
routes.post('/send-code', sendCodeController.send)

// verify code
routes.post('/verify-code', verifyCodeController.verify)

// signup
routes.post('/signup', signupController.signup)
