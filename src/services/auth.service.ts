import { IShopModel } from '../models/shop.model'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import tokenModel from '../models/token.model'

class AuthService {
  signIn = async (shop: IShopModel) => {
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
}

export default new AuthService()
