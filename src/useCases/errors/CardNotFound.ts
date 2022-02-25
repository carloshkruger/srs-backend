export class CardNotFound extends Error {
  constructor() {
    super('Card not found.')
    this.name = CardNotFound.name
  }
}
