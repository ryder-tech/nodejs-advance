import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

interface ISuccessReponse {
  statusCode?: number
  message?: string
  metadata: Record<string, any>
}

class SuccessReponse {
  public statusCode: number | undefined
  public message: string | undefined
  public metadata: Record<string, any> | undefined

  constructor({ statusCode, message, metadata = {} }: ISuccessReponse) {
    this.statusCode = statusCode
    this.message = message
    this.metadata = metadata
  }

  public send(res: Response) {
    return res.status(this.statusCode || StatusCodes.OK).json(this)
  }
}

class CREATED extends SuccessReponse {
  constructor({
    statusCode = StatusCodes.CREATED,
    message = ReasonPhrases.CREATED,
    metadata,
  }: ISuccessReponse) {
    super({ statusCode, message, metadata })
  }
}

export { CREATED, SuccessReponse }
