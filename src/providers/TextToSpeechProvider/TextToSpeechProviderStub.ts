import { TextToSpeechProvider } from './TextToSpeechProvider.interface'

export class TextToSpeechProviderStub implements TextToSpeechProvider {
  async createAudio(): Promise<Buffer> {
    return Promise.resolve(Buffer.from('test buffer', 'utf-8'))
  }
}
