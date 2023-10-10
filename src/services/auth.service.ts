import { IShopModel } from '../models/shop.model'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import tokenModel from '../models/token.model'
import { Types } from 'mongoose'
import { BadRequest } from '../helpers/handle.error'
import { error } from 'console'
import { RequestAuth } from '../middlewares/auth.middleware'

class AuthService {
  generateJWT = async (shop: IShopModel) => {
    // create RSA
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
    })

    const payload = {
      id: shop._id,
      email: shop.email,
      display_name: shop.display_name,
    }

    // JWT tokens
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30m',
    })

    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30d',
    })

    // store access_token, refresh_token
    const publicKeyPEM = publicKey.export({
      type: 'spki',
      format: 'pem',
    })

    await tokenModel.create({
      shop: shop._id,
      public_key: publicKeyPEM,
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  /**
   * get a new access_token and refresh_token
   * @param shop
   * @param refreshToken
   * @returns
   */
  refreshToken = async (shop: IShopModel, refreshToken: string) => {
    // public_key
    const tokenObj = await tokenModel
      .findOne({ shop: new Types.ObjectId(shop._id) })
      .sort({ _id: -1 })
      .lean() // DESC

    if (!tokenObj) {
      throw new BadRequest('Refresh token is not existed')
    }

    // verify public_key refresh_token
    jwt.verify(refreshToken, tokenObj?.public_key, (error: any, _: any) => {
      if (error) {
        throw new BadRequest('Refresh token is invalid')
      }
    })

    // generate a new JWT
    return this.generateJWT(shop)
  }

  logout = async (req: RequestAuth) => {
    const tokenId = req.token?._id
    return tokenModel.deleteOne({ _id: tokenId })
  }
}

export default new AuthService()
