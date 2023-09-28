import express from 'express'
import authController from '../../controllers/auth.controller'
import handleAsynError from '../../helpers/handle.asyn.error'

const router = express.Router()
router.post('/sign-up', handleAsynError(authController.signUp))

module.exports = router
