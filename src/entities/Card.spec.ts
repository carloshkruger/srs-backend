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
})
