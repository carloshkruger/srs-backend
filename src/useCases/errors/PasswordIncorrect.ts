export class PasswordIncorrect extends Error {
  constructor() {
    super('Password incorrect.')
    this.name = PasswordIncorrect.name
  }
}
