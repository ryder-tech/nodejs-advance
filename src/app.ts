import { Request, Response } from 'express'
import MongoDBConfig from './configs/mongodb.config'
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

// configs: connnect databases, connect RabbitMQ, connect to websockets
MongoDBConfig.connect()
MongoDBConfig.connect()
MongoDBConfig.connect()
MongoDBConfig.connect()
MongoDBConfig.connect()

// routes
app.get('/products', (req: Request, res: Response) => {
  const greeting = 'Hello world'.repeat(100000)
  res.send(greeting)
})

// handle errors

module.exports = app
