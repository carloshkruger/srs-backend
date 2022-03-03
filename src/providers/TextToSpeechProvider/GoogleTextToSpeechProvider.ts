import { TextToSpeechProvider } from './TextToSpeechProvider.interface'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'

export class GoogleTextToSpeechProvider implements TextToSpeechProvider {
  private client: TextToSpeechClient

  constructor() {
    this.client = new TextToSpeechClient()
  }

  async createAudio(text: string): Promise<Buffer> {
    const [response] = await this.client.synthesizeSpeech({
      audioConfig: {
        audioEncoding: 'MP3'
      },
      voice: {
        languageCode: 'en-US',
        ssmlGender: 'NEUTRAL'
      },
      input: {
        text
      }
    })

    return Buffer.from(response.audioContent)
  }
}
