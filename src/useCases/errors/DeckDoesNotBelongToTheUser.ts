import { ForbiddenError } from './ForbiddenError'

export class DeckDoesNotBelongToTheUser extends ForbiddenError {
  constructor() {
    super('The deck does not belong to this user.')
    this.name = DeckDoesNotBelongToTheUser.name
  }
}
