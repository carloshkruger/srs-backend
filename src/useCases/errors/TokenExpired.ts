export class TokenExpired extends Error {
  constructor() {
    super('Token has expired.')
    this.name = TokenExpired.name
  }
}
