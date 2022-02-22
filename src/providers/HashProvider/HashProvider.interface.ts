export interface HashProvider {
  hash(text: string): Promise<string>
}
