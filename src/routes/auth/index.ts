import express from 'express'
import authController from '../../controllers/auth.controller'
import handleAsynError from '../../helpers/handle.asyn.error'
import { checkAuthenticate } from '../../middlewares/auth.middleware'

const router = express.Router()
router.post('/sign-up', handleAsynError(authController.signUp))
router.post('/sign-in', handleAsynError(authController.signIn))
router.post('/refresh-token', handleAsynError(authController.refreshToken))

router.use(handleAsynError(checkAuthenticate))
router.get('/products', handleAsynError(authController.listProducts))
router.post('/log-out', handleAsynError(authController.logOut))

module.exports = router
