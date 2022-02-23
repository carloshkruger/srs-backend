export interface HashProvider {
  hash(text: string): Promise<string>
  compare(params: CompareParams): Promise<boolean>
}

export type CompareParams = {
  plainText: string
  hashText: string
}
