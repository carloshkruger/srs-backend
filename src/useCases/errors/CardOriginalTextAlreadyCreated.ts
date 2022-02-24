export class CardOriginalTextAlreadyCreated extends Error {
  constructor() {
    super('Original text already created for this deck.')
    this.name = CardOriginalTextAlreadyCreated.name
  }
}
