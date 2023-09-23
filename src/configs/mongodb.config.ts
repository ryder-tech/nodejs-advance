import mongoose from 'mongoose'

class MongoDBConfig {
  static instance: MongoDBConfig

  constructor() {
    const host = process.env?.mongodb_host || 'localhost'
    const port = process.env?.mongodb_port || 27017
    const dbname = process.env?.mongodb_dbname || 'ecommerce'
    const uri = process.env?.uri || ''

    const uriString = uri || `mongodb://${host}:${port}/${dbname}`

    mongoose
      .connect(uriString)
      .then(() => console.log(`Connect to ${dbname} succesfully`))
      .catch((error) => console.log(error))
  }

  static connect() {
    if (!this.instance) {
      this.instance = new MongoDBConfig()
    }

    return this.instance
  }
}

export default MongoDBConfig
