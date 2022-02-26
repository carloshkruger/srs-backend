import { CardReview } from '@entities/CardReview'
import { CardReviewDifficultyLevel } from '@entities/enums/CardReviewDifficultyLevel'
import { Sm2Algorithm } from './Sm2Algorithm'

describe('Sm2Algorithm', () => {
  it('should return easiness factor of 1.3 when less than it', () => {
    const cardReview = CardReview.create({
      cardId: '123',
      createdAt: new Date(),
      difficultyLevel: CardReviewDifficultyLevel.TOTAL_BLACKOUT
    })
    const cardReview2 = CardReview.create({
      cardId: '123',
      createdAt: new Date(),
      difficultyLevel: CardReviewDifficultyLevel.TOTAL_BLACKOUT
    })

    const result = Sm2Algorithm.calculateNextReviewDate([
      cardReview,
      cardReview2
    ])

    expect(result.easinessFactor).toBe(1.3)
  })

  it('repetition should return 0 when difficulty level is total blackout', () => {
    const cardReview = CardReview.create({
      cardId: '123',
      createdAt: new Date(),
      difficultyLevel: CardReviewDifficultyLevel.EASY
    })
    const cardReview2 = CardReview.create({
      cardId: '123',
      createdAt: new Date(),
      difficultyLevel: CardReviewDifficultyLevel.TOTAL_BLACKOUT
    })

    const result = Sm2Algorithm.calculateNextReviewDate([
      cardReview,
      cardReview2
    ])

    expect(result.repetition).toBe(0)
  })

  it('repetition should return 0 when difficulty level is hard', () => {
    const cardReview = CardReview.create({
      cardId: '123',
      createdAt: new Date(),
      difficultyLevel: CardReviewDifficultyLevel.EASY
    })
    const cardReview2 = CardReview.create({
      cardId: '123',
      createdAt: new Date(),
      difficultyLevel: CardReviewDifficultyLevel.HARD
    })

    const result = Sm2Algorithm.calculateNextReviewDate([
      cardReview,
      cardReview2
    ])

    expect(result.repetition).toBe(0)
  })

  it('intervalInDays should be 6 when difficulty level is easy and repetition is 1', () => {
    const cardReview = CardReview.create({
      cardId: '123',
      createdAt: new Date(),
      difficultyLevel: CardReviewDifficultyLevel.EASY
    })
    const cardReview2 = CardReview.create({
      cardId: '123',
      createdAt: new Date(),
      difficultyLevel: CardReviewDifficultyLevel.EASY
    })

    const result = Sm2Algorithm.calculateNextReviewDate([
      cardReview,
      cardReview2
    ])

    expect(result.intervalInDays).toBe(6)
  })

  it('intervalInDays should be bigger than 0 if difficulty level is easy and repetition is bigger than 1', () => {
    const cardReview = CardReview.create({
      cardId: '123',
      createdAt: new Date(),
      difficultyLevel: CardReviewDifficultyLevel.EASY
    })
    const cardReview2 = CardReview.create({
      cardId: '123',
      createdAt: new Date(),
      difficultyLevel: CardReviewDifficultyLevel.EASY
    })
    const cardReview3 = CardReview.create({
      cardId: '123',
      createdAt: new Date(),
      difficultyLevel: CardReviewDifficultyLevel.EASY
    })

    const result = Sm2Algorithm.calculateNextReviewDate([
      cardReview,
      cardReview2,
      cardReview3
    ])

    expect(result.intervalInDays).toBeGreaterThan(0)
  })
})
