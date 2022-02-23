import { Deck } from './Deck'

describe('Deck', () => {
  it('getters should return correct values', () => {
    const deck = Deck.create({
      userId: '123456',
      name: 'Deck name',
      description: 'Deck description'
    })

    expect(deck.userId).toBe('123456')
    expect(deck.name).toBe('Deck name')
    expect(deck.description).toBe('Deck description')
    expect(deck.id).toEqual(expect.any(String))
  })
})
