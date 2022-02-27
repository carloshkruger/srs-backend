import { AuthTokenProvider } from './AuthTokenProvider.interface'

export class AuthTokenProviderStub implements AuthTokenProvider {
  generate(): string {
    return ''
  }
}
