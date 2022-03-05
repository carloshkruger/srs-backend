import { NotFoundError } from './NotFoundError'

export class UserNotFound extends NotFoundError {
  constructor() {
    super('User not found')
    this.name = UserNotFound.name
  }
}
