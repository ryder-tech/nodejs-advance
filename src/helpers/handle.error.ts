import { NextFunction, Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

interface IErrorReponse {
  statusCode?: number
  message?: string
}

class ErrorReponse {
  public statusCode: number | undefined
  public message: string | undefined

  constructor({ statusCode, message }: IErrorReponse) {
    this.statusCode = statusCode
    this.message = message
  }
}

class BadRequest extends ErrorReponse {
  constructor(
    message: string = ReasonPhrases.BAD_GATEWAY,
    statusCode: number = StatusCodes.BAD_REQUEST,
  ) {
    super({ statusCode, message })
  }
}

class AuthError extends ErrorReponse {
  constructor(
    message: string = ReasonPhrases.UNAUTHORIZED,
    statusCode: number = StatusCodes.UNAUTHORIZED,
  ) {
    super({ statusCode, message })
  }
}

const handleError = (
  error: ErrorReponse,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode || StatusCodes.NOT_FOUND
  return res
    .status(statusCode)
    .json({
      status: statusCode,
      message: error.message || ReasonPhrases.NOT_FOUND,
    })
    .send()
}

export { ErrorReponse, BadRequest, AuthError, handleError }
