import { ForbiddenError } from './ForbiddenError'

export class CardDoesNotBelongToTheUser extends ForbiddenError {
  constructor() {
    super('The card does not belong to this user.')
    this.name = CardDoesNotBelongToTheUser.name
  }
}
