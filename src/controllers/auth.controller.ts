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
      throw new BadRequest('Email, name, displayName and password are required')
    }

    // check existed email or name
    const existed = await shopModel.findOne({ $or: [{ email }, { name }] })
    if (existed) {
      throw new BadRequest('Email or name are existed')
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
      throw new BadRequest(error?.message)
    }
  }

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const { id } = req.headers

    if (!email || !password) {
      throw new BadRequest('Email and password are required')
    }

    const shop = await shopModel.findById(id).lean()
    if (!shop) {
      throw new BadRequest('Shop not found!')
    }

    return new OK({
      message: 'Login success',
      metadata: await authService.generateJWT(shop),
    }).send(res)
  }

  listProducts = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization: token, id } = req.headers

    if (!token) {
      throw new BadRequest('Token is required')
    }

    const shop = await shopModel.findById(id).lean()
    if (!shop) {
      throw new BadRequest('Shop not found!')
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

  /**
   * refresh_token: request body
   * validate refresh_token -> ok -> return new {access_token, refresh_token}
   * @param req
   * @param res
   * @param next
   */
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { refresh_token: refreshToken } = req.body
    const { id } = req.headers

    // validate
    if (!refreshToken || !id) {
      throw new BadRequest('Refresh token and shop infor are required')
    }

    const shop = await shopModel.findById(id).lean()
    if (!shop) {
      throw new BadRequest('Shop is not exist')
    }

    return new OK({
      message: 'Get new JWT',
      metadata: await authService.refreshToken(shop, refreshToken),
    }).send(res)
  }
}

export default new AuthController()
