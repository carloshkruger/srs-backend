import { Request, Response } from 'express'

abstract class Controller {
  public async execute(
    request: Request,
    response: Response
  ): Promise<ControllerResponse> {
    const controllerResponse = await this.handle(request)

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
