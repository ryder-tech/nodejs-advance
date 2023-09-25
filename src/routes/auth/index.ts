import express from 'express'
import authController from '../../controllers/auth.controller'

const router = express.Router()
router.post('/sign-up', authController.signUp)

module.exports = router
