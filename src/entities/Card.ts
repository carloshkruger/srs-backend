import { Sm2Algorithm } from '@shared/Sm2Algorithm'
import { CardReview } from './CardReview'
import { Entity } from './Entity'

export type CardProps = {
  deckId: string
  originalText: string
  translatedText: string
  audioFileName: string
  cardReviews: CardReview[]
  nextReviewAt?: Date
}

export class Card extends Entity<CardProps> {
  public get deckId(): string {
    return this.props.deckId
  }

  public get originalText(): string {
    return this.props.originalText
  }

  public get translatedText(): string {
    return this.props.translatedText
  }

  public get audioFileName(): string {
    return this.props.audioFileName
  }

  public get cardReviews(): CardReview[] {
    return this.props.cardReviews
  }

  public get nextReviewAt(): Date | undefined {
    return this.props.nextReviewAt
  }

  private constructor(props: CardProps, id?: string) {
    super(props, id)
  }

  public static create(props: CardProps, id?: string): Card {
    return new Card(
      {
        ...props,
        originalText: props.originalText.trim(),
        translatedText: props.translatedText.trim()
      },
      id
    )
  }

  public updateOriginalText(originalText: string): void {
    this.props.originalText = originalText
  }

  public updateTranslatedText(translatedText: string): void {
    this.props.translatedText = translatedText
  }

  public updateAudioFileName(audioFileName: string): void {
    this.props.audioFileName = audioFileName
  }

  public updateNextReviewAt(date: Date): void {
    this.props.nextReviewAt = date
  }

  public getFilePathToStorage(userId: string): string[] {
    return ['users', userId, 'decks', this.deckId, 'cards', this.id]
  }

  public addCardReview(cardReview: CardReview): void {
    this.props.cardReviews.push(cardReview)
  }

  public calculateAndUpdateNextReviewDate(): void {
    const { intervalInDays } = Sm2Algorithm.calculateNextReviewDate(
      this.cardReviews
    )

    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalInDays)

    this.updateNextReviewAt(nextReviewDate)
  }
}
