import { UpdateUser } from '@useCases/UpdateUser'
import { Controller, ControllerRequest, ControllerResponse } from './Controller'

export class UpdateUserController extends Controller {
  constructor(private useCase: UpdateUser) {
    super()
  }

  public async handle(props: ControllerRequest): Promise<ControllerResponse> {
    const { id, name, email } = props.data

    await this.useCase.execute({ id, name, email })

    return super.noContent()
  }
}
