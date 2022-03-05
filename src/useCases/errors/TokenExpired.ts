import { UnauthorizedError } from './UnauthorizedError'

export class TokenExpired extends UnauthorizedError {
  constructor() {
    super('Token has expired.')
    this.name = TokenExpired.name
  }
}
