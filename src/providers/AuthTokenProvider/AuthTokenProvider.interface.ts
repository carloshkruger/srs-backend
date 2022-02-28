export interface AuthTokenProviderDecryptResponse {
  userId: string
}

export interface AuthTokenProvider {
  generate(userId: string): string
  decrypt(token: string): AuthTokenProviderDecryptResponse
}
