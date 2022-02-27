export class IncorrectCredentials extends Error {
  constructor() {
    super('Incorrect email/password combination.')
    this.name = IncorrectCredentials.name
  }
}
