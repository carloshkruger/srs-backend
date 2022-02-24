export interface TextToSpeechProvider {
  createAudio(text: string): Promise<Buffer>
}
