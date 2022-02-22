export class EmailAlreadyRegistered extends Error {
  constructor(email: string) {
    super(`The email "${email}" is already registered.`)
    this.name = EmailAlreadyRegistered.name
  }
}
