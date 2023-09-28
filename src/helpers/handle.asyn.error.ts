import { Request, Response } from 'express'
import { NextFunction } from 'express-serve-static-core'

const handleAsynError = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

export default handleAsynError
