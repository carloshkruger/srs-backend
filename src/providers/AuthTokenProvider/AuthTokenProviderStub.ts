import {
  AuthTokenProvider,
  AuthTokenProviderDecryptResponse
} from './AuthTokenProvider.interface'

export class AuthTokenProviderStub implements AuthTokenProvider {
  generate(): string {
    return ''
  }
  decrypt(): AuthTokenProviderDecryptResponse {
    return {
      userId: '123'
    }
  }
}
