import { CreateUserWithEmailAndPassword } from '@useCases/CreateUserWithEmailAndPassword'
import { Controller, ControllerRequest, ControllerResponse } from './Controller'

export class CreateUserWithEmailAndPasswordController extends Controller {
  constructor(private useCase: CreateUserWithEmailAndPassword) {
    super()
  }

  public async handle(props: ControllerRequest): Promise<ControllerResponse> {
    const { name, email, password } = props.data

    const user = await this.useCase.execute({ name, email, password })

    return super.created({
      id: user.id
    })
  }
}
