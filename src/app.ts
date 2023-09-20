import { Request, Response } from "express";

const express = require("express");

const port = 3000;
const expressApp = express();

// middlewares

// configs: connnect databases, connect RabbitMQ, connect to websockets

// routes
expressApp.get("/", (req: Request, res: Response) => {
  const name = req.query?.name;
  res.send(`Welcome to ${name}`);
});

// handle errors

module.exports = expressApp;
