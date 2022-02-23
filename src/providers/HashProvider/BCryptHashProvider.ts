import { CompareParams, HashProvider } from './HashProvider.interface'
import { compare, hash } from 'bcrypt'

const SALT_NUMBER = 10

export class BCryptHashProvider implements HashProvider {
  async hash(text: string): Promise<string> {
    return hash(text, SALT_NUMBER)
  }

  async compare({ plainText, hashText }: CompareParams): Promise<boolean> {
    return compare(plainText, hashText)
  }
}
