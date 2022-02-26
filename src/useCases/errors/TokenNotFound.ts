export class TokenNotFound extends Error {
  constructor() {
    super('Token not found')
    this.name = TokenNotFound.name
  }
}
