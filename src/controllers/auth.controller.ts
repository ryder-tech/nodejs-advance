import { NextFunction, Request, Response } from 'express'
import { BadRequest } from '../helpers/handle.error'
import { CREATED, OK } from '../helpers/handle.success'
import shopModel from '../models/shop.model'
import shopService from '../services/shop.service'
import authService from '../services/auth.service'
import tokenModel from '../models/token.model'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'

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

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const { id } = req.headers

    if (!email || !password) {
      throw new BadRequest({
        message: 'Email and password are required',
      })
    }

    const shop = await shopModel.findById(id).lean()
    if (!shop) {
      throw new BadRequest({
        message: 'Shop not found!',
      })
    }

    return new OK({
      message: 'Login success',
      metadata: await authService.signIn(shop),
    }).send(res)
  }

  listProducts = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization: token, id } = req.headers

    if (!token) {
      throw new BadRequest({
        message: 'Token is required',
      })
    }

    const shop = await shopModel.findById(id).lean()
    if (!shop) {
      throw new BadRequest({
        message: 'Shop not found!',
      })
    }

    const tokenObj = await tokenModel
      .findOne({ shop: new Types.ObjectId(shop._id) })
      .sort({ _id: -1 })
      .lean()

    console.log(jwt.verify(token, tokenObj?.public_key || ''))
    return new OK({
      message: 'Check verify',
      metadata: {},
    }).send(res)
  }
}

export default new AuthController()
