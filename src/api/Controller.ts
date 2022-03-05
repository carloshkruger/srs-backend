import { Request, Response } from 'express'

abstract class Controller {
  public async execute(
    request: Request,
    response: Response
  ): Promise<ControllerResponse> {
    let controllerResponse: ControllerResponse

    try {
      controllerResponse = await this.handle(request)
    } catch (error) {
      controllerResponse = this.fail(error)
    }

    return response
      .status(controllerResponse.statusCode)
      .json(controllerResponse.body)
  }

  protected abstract handle(request: Request): Promise<ControllerResponse>

  protected ok(data: any): ControllerResponse {
    return {
      statusCode: 200,
      body: data
    }
  }

  protected created(data: any): ControllerResponse {
    return {
      statusCode: 201,
      body: data
    }
  }

  protected noContent(): ControllerResponse {
    return {
      statusCode: 204
    }
  }

  protected serverError(): ControllerErrorResponse {
    return {
      statusCode: 500,
      body: {
        error: 'Internal server error'
      }
    }
  }

  protected fail(error: Error): ControllerErrorResponse {
    console.error(error)

    try {
      return {
        statusCode: 400,
        body: {
          error: error.message?.trim()
        }
      }
    } catch {
      return this.serverError()
    }
  }
}

interface ControllerResponse {
  statusCode: number
  body?: any
}

interface ControllerErrorResponse extends ControllerResponse {
  body: {
    error: string | string[]
  }
}

export { Controller, ControllerErrorResponse, ControllerResponse }
