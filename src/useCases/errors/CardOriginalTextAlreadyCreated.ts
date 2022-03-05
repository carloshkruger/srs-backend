import { ConflictError } from './ConflictError'

export class CardOriginalTextAlreadyCreated extends ConflictError {
  constructor() {
    super('Original text already created for this deck.')
    this.name = CardOriginalTextAlreadyCreated.name
  }
}
