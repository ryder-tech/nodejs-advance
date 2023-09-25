import { NextFunction, Request, Response } from 'express'
import shopModel from '../models/shop.model'
import shopService from '../services/shop.service'

class AuthController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, display_name, password } = req.body

    if (!email || !name || !display_name || !password) {
      return res.status(500).json({
        message: 'Email, name, displayName and password are required',
      })
    }

    // check existed email or name
    const existed = await shopModel.findOne({ $or: [{ email }, { name }] })
    if (existed) {
      return res.status(500).json({
        message: 'Email or name are existed',
      })
    }

    try {
      const newShop = await shopService.signUp({
        email,
        name,
        display_name,
        password,
      })

      return res.status(201).json({
        message: 'Create a shop sucessfully',
        data: newShop,
      })
    } catch (error) {
      return res.status(501).json({
        message: 'Create a shop error',
        error,
      })
    }
  }
}

export default new AuthController()
