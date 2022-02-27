export interface AuthTokenProvider {
  generate(userId: string): string
}
