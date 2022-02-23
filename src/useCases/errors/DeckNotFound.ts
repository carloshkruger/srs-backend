export class DeckNotFound extends Error {
  constructor() {
    super('Deck not found.')
    this.name = DeckNotFound.name
  }
}
