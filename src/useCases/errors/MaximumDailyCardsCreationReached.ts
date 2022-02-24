export class MaximumDailyCardsCreationReached extends Error {
  constructor() {
    super('Maximum daily cards creation reached.')
    this.name = MaximumDailyCardsCreationReached.name
  }
}
