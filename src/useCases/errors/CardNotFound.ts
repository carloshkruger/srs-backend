import { NotFoundError } from './NotFoundError'

export class CardNotFound extends NotFoundError {
  constructor() {
    super('Card not found.')
    this.name = CardNotFound.name
  }
}
