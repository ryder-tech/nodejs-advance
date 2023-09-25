import { Model } from 'mongoose'
import { IBaseModel } from './base.model'

const mongoose = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'shops'

export interface IShopModel extends IBaseModel {
  name: string
  email: string
  display_name: string
  password: string
}

var shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    display_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
)

const shopModel: Model<IShopModel> = mongoose.model(DOCUMENT_NAME, shopSchema)
export default shopModel
