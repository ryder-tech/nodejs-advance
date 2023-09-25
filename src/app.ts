import { Request, Response } from 'express'
import MongoDBConfig from './configs/mongodb.config'
import router from './routes'
import exp from 'constants'
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

module.exports = app
