import { Card } from './Card'

describe('Card', () => {
  it('getters should return correct values', () => {
    const card = Card.create({
      deckId: '123456',
      originalText: 'original text',
      translatedText: 'translated text',
      audioFileName: 'audiofile.mp3'
    })

    expect(card.deckId).toBe('123456')
    expect(card.originalText).toBe('original text')
    expect(card.translatedText).toBe('translated text')
    expect(card.audioFileName).toBe('audiofile.mp3')
    expect(card.id).toEqual(expect.any(String))
  })

  it('should update values', () => {
    const card = Card.create({
      deckId: '123456',
      originalText: 'original text',
      translatedText: 'translated text',
      audioFileName: 'audiofile.mp3'
    })

    card.updateAudioFileName('new_audio_file.mp3')
    card.updateOriginalText('new original text')
    card.updateTranslatedText('new translated text')

    expect(card.deckId).toBe('123456')
    expect(card.audioFileName).toBe('new_audio_file.mp3')
    expect(card.originalText).toBe('new original text')
    expect(card.translatedText).toBe('new translated text')
    expect(card.id).toEqual(expect.any(String))
  })

  it('getFilePathToStorage', () => {
    const card = Card.create({
      deckId: '123456',
      originalText: 'original text',
      translatedText: 'translated text',
      audioFileName: 'audiofile.mp3'
    })

    const userId = '123'

    const path = card.getFilePathToStorage(userId)

    expect(path).toEqual(['users', userId, 'decks', '123456', 'cards', card.id])
  })
})
