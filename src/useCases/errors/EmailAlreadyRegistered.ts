import { ConflictError } from './ConflictError'

export class EmailAlreadyRegistered extends ConflictError {
  constructor(email: string) {
    super(`The email "${email}" is already registered.`)
    this.name = EmailAlreadyRegistered.name
  }
}
