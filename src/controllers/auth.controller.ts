import { NextFunction, Request, Response } from 'express'
import { BadRequest } from '../helpers/handle.error'
import { CREATED } from '../helpers/handle.success'
import shopModel from '../models/shop.model'
import shopService from '../services/shop.service'

class AuthController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, display_name, password } = req.body

    if (!email || !name || !display_name || !password) {
      throw new BadRequest({
        message: 'Email, name, displayName and password are required',
      })
    }

    // check existed email or name
    const existed = await shopModel.findOne({ $or: [{ email }, { name }] })
    if (existed) {
      throw new BadRequest({
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

      return new CREATED({
        message: 'Create a shop successfully',
        metadata: newShop,
      }).send(res)
    } catch (error: any) {
      throw new BadRequest({
        message: error?.message,
      })
    }
  }
}

export default new AuthController()
