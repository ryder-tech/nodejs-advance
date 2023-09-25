import shopModel, { IShopModel } from '../models/shop.model'
import bcrypt from 'bcrypt'

class shopService {
  signUp = async ({ email, name, display_name, password }: IShopModel) => {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    return shopModel.create({
      email,
      name,
      display_name,
      password: hashPassword,
    })
  }
}

export default new shopService()
