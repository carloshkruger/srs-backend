import { HashProvider } from './HashProvider.interface'

export class HashProviderStub implements HashProvider {
  async hash(): Promise<string> {
    return Promise.resolve('')
  }
}
