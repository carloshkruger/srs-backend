abstract class Controller {
  public async execute(props: ControllerRequest): Promise<ControllerResponse> {
    try {
      const response = await this.handle(props)

      return response
    } catch (error) {
      return this.fail(error)
    }
  }

  protected abstract handle(
    props: ControllerRequest
  ): Promise<ControllerResponse>

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

  protected serverError(error: Error): ControllerResponse {
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
      return this.serverError(error)
    }
  }
}

interface RequestData {
  [key: string]: any
}

interface RequestFile {
  filename: string
}

interface ControllerRequest {
  data: RequestData
  files?: RequestFile[]
  loggedUserId?: string
}

interface ControllerResponse {
  statusCode: number
  body?: any
}

export { Controller, ControllerRequest, ControllerResponse }
