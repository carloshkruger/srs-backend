import { AuthTokenProvider } from './AuthTokenProvider.interface'
import { sign } from 'jsonwebtoken'

export class JWTAuthTokenProvider implements AuthTokenProvider {
  generate(userId: string): string {
    return sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
  }
}
