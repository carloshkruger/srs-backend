export class DeckNameAlreadyRegistered extends Error {
  constructor(deckName: string) {
    super(`The deck "${deckName}" is already registered.`)
    this.name = DeckNameAlreadyRegistered.name
  }
}
