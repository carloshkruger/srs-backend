import { NotFoundError } from './NotFoundError'

export class DeckNotFound extends NotFoundError {
  constructor() {
    super('Deck not found.')
    this.name = DeckNotFound.name
  }
}
