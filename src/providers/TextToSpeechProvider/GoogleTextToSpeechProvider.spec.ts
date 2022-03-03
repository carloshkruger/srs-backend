import { GoogleTextToSpeechProvider } from './GoogleTextToSpeechProvider'

const synthesizeSpeechMock = jest
  .fn()
  .mockResolvedValue([{ audioContent: 'binary data' }])

jest.mock('@google-cloud/text-to-speech', () => ({
  TextToSpeechClient: jest.fn().mockImplementation(() => ({
    synthesizeSpeech: synthesizeSpeechMock
  }))
}))

describe('GoogleTextToSpeechProvider', () => {
  let googleTextToSpeechProvider: GoogleTextToSpeechProvider

  beforeEach(() => {
    googleTextToSpeechProvider = new GoogleTextToSpeechProvider()
  })

  it('should call synthesizeSpeech method with correct params', async () => {
    const text = 'test'

    await expect(
      googleTextToSpeechProvider.createAudio(text)
    ).resolves.toBeInstanceOf(Buffer)

    const params = synthesizeSpeechMock.mock.calls[0][0]
    expect(params).toMatchObject({
      input: {
        text
      }
    })
  })
})
