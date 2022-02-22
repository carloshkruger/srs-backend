import { Request } from 'express'

abstract class Controller {
  public async execute(request: Request): Promise<ControllerResponse> {
    try {
      const response = await this.handle(request)

      return response
    } catch (error) {
      return this.fail(error)
    }
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

  protected serverError(): ControllerResponse {
    return {
      statusCode: 500,
      body: {
        error: 'Internal server error'
      }
    }
  }

  protected fail(error: Error): ControllerResponse {
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

export { Controller, ControllerResponse }
