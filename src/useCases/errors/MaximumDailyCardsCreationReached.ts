import { UnprocessableEntityError } from './UnprocessableEntityError'

export class MaximumDailyCardsCreationReached extends UnprocessableEntityError {
  constructor() {
    super('Maximum daily cards creation reached.')
    this.name = MaximumDailyCardsCreationReached.name
  }
}
