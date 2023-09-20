import { Request, Response } from "express";

const express = require("express");

const port = 3000;
const app = express();

app.get("/", (req: Request, res: Response) => {
  const name = req.query?.name;
  res.send(`Welcome to ${name}`);
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
