import { HashProvider } from './HashProvider.interface'
import { hash } from 'bcrypt'

const SALT_NUMBER = 10

export class BCryptHashProvider implements HashProvider {
  async hash(text: string): Promise<string> {
    return hash(text, SALT_NUMBER)
  }
}
