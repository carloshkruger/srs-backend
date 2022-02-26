import { Card, CardProps } from '@entities/Card'
import { CardReview } from '@entities/CardReview'

export class CardMockBuilder {
  private data: CardProps = {
    audioFileName: 'audio.mp3',
    cardReviews: [],
    deckId: '12345',
    originalText: 'original text',
    translatedText: 'translated text',
    nextReviewAt: new Date()
  }
  private id: string

  static aCard(): CardMockBuilder {
    return new CardMockBuilder()
  }

  withId(id: string): CardMockBuilder {
    this.id = id
    return this
  }

  withAudioFileName(audioFileName: string): CardMockBuilder {
    this.data.audioFileName = audioFileName
    return this
  }

  withCardReviews(cardReviews: CardReview[]): CardMockBuilder {
    this.data.cardReviews = cardReviews
    return this
  }

  withDeckId(deckId: string): CardMockBuilder {
    this.data.deckId = deckId
    return this
  }

  withOriginalText(originalText: string): CardMockBuilder {
    this.data.originalText = originalText
    return this
  }

  withTranslatedText(translatedText: string): CardMockBuilder {
    this.data.translatedText = translatedText
    return this
  }

  withNextReviewAt(nextReviewAt: Date): CardMockBuilder {
    this.data.nextReviewAt = nextReviewAt
    return this
  }

  build(): Card {
    return Card.create(this.data, this.id)
  }
}
