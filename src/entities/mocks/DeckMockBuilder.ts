import { Deck, DeckProps } from '@entities/Deck'

export class DeckMockBuilder {
  private data: DeckProps = {
    name: 'Deck name',
    userId: '123456',
    description: 'Deck description'
  }
  private id: string

  static aDeck(): DeckMockBuilder {
    return new DeckMockBuilder()
  }

  withId(id: string): DeckMockBuilder {
    this.id = id
    return this
  }

  withName(name: string): DeckMockBuilder {
    this.data.name = name
    return this
  }

  withUserId(userId: string): DeckMockBuilder {
    this.data.userId = userId
    return this
  }

  withDescription(description: string): DeckMockBuilder {
    this.data.description = description
    return this
  }

  build(): Deck {
    return Deck.create(this.data, this.id)
  }
}
