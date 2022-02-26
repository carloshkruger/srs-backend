import { CardReviewDifficultyLevel } from './enums/CardReviewDifficultyLevel'
import { Entity } from './Entity'

type CardReviewProps = {
  cardId: string
  difficultyLevel: CardReviewDifficultyLevel
  createdAt: Date
}

export class CardReview extends Entity<CardReviewProps> {
  public get cardId(): string {
    return this.props.cardId
  }

  public get difficultyLevel(): CardReviewDifficultyLevel {
    return this.props.difficultyLevel
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  private constructor(props: CardReviewProps, id?: string) {
    super(props, id)
  }

  public static create(props: CardReviewProps, id?: string): CardReview {
    return new CardReview(props, id)
  }
}
