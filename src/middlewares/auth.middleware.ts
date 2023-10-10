import { NextFunction, Request, Response } from 'express'
import { AuthError, BadRequest } from '../helpers/handle.error'
import tokenModel from '../models/token.model'
import { genMongoDBId } from '../ultis/common'
import jwt from 'jsonwebtoken'

export interface RequestAuth extends Request {
  shop: Record<string, any>
  token: Record<string, any>
}
export const checkAuthenticate = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction,
) => {
  const { id, authorization: token } = req.headers

  if (!id || !token) {
    throw new AuthError('Id and token are required')
  }

  // public key
  const tokenObj = await tokenModel
    .findOne({
      shop: genMongoDBId(id.toString()),
    })
    .sort({ _id: -1 })
    .lean()

  if (!tokenObj) {
    throw new BadRequest('Token is not existed')
  }

  // verify public key and token
  jwt.verify(token, tokenObj.public_key, (error: any, decoded: any) => {
    if (error) {
      throw new BadRequest(error.message)
    }
    req.shop = decoded
    req.token = tokenObj
  })
  next()
}
