import {
  AuthTokenProvider,
  AuthTokenProviderDecryptResponse
} from './AuthTokenProvider.interface'
import { JwtPayload, sign, verify } from 'jsonwebtoken'

export class JWTAuthTokenProvider implements AuthTokenProvider {
  generate(userId: string): string {
    return sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
  }

  decrypt(token: string): AuthTokenProviderDecryptResponse {
    const { userId } = verify(token, process.env.JWT_SECRET) as JwtPayload

    return {
      userId
    }
  }
}
