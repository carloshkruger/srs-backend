export class CardDoesNotBelongToTheUser extends Error {
  constructor() {
    super('The card does not belong to this user.')
    this.name = CardDoesNotBelongToTheUser.name
  }
}
