import { Types } from 'mongoose'

export const genMongoDBId = (id: string) => {
  return new Types.ObjectId(id)
}
