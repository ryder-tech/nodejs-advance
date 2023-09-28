import MongoDBConfig from './configs/mongodb.config'
import { handleError } from './helpers/handle.error'
import router from './routes'
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const express = require('express')
require('dotenv').config()

const port = 3000
const app = express()

// middlewares
app.use(morgan('dev')) // dev, common, combined, short, tiny
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// configs: connnect databases, connect RabbitMQ, connect to websockets
MongoDBConfig.connect()

// routes
app.use('/', router)

// handle errors
app.use(handleError)

module.exports = app
