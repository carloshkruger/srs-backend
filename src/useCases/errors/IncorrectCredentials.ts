import { UnauthorizedError } from './UnauthorizedError'

export class IncorrectCredentials extends UnauthorizedError {
  constructor() {
    super('Incorrect email/password combination.')
    this.name = IncorrectCredentials.name
  }
}
