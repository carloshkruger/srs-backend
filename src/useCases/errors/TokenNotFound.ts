import { NotFoundError } from './NotFoundError'

export class TokenNotFound extends NotFoundError {
  constructor() {
    super('Token not found')
    this.name = TokenNotFound.name
  }
}
