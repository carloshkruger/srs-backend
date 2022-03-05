import { ConflictError } from './ConflictError'

export class DeckNameAlreadyRegistered extends ConflictError {
  constructor(deckName: string) {
    super(`The deck "${deckName}" is already registered.`)
    this.name = DeckNameAlreadyRegistered.name
  }
}
