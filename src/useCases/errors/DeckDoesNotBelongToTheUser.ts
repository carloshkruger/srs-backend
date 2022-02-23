export class DeckDoesNotBelongToTheUser extends Error {
  constructor() {
    super('The deck does not belong to this user.')
    this.name = DeckDoesNotBelongToTheUser.name
  }
}
