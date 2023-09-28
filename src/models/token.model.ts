import { Model, Schema } from 'mongoose'
import { IBaseModel } from './base.model'

const mongoose = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Token'
const COLLECTION_NAME = 'tokens'

export interface ITokenModel extends IBaseModel {
  shop: Object
  public_key: string
  access_token: string
  refresh_token: string
}

var tokenSchema = new mongoose.Schema(
  {
    shop: {
      type: Schema.ObjectId,
      required: true,
      ref: 'Shop',
    },
    public_key: {
      type: String,
      required: true,
    },
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
)

const tokenModel: Model<ITokenModel> = mongoose.model(
  DOCUMENT_NAME,
  tokenSchema,
)
export default tokenModel
