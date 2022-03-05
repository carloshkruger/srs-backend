import { AppError } from './AppError'

export class PasswordIncorrect extends AppError {
  constructor() {
    super('Password incorrect.')
    this.name = PasswordIncorrect.name
  }
}
