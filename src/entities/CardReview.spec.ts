import { CardReview } from './CardReview'
import { CardReviewDifficultyLevel } from './enums/CardReviewDifficultyLevel'

describe('CardReview', () => {
  it('getters should return correct values', () => {
    const cardReview = CardReview.create({
      cardId: '123',
      createdAt: new Date(),
      difficultyLevel: CardReviewDifficultyLevel.EASY
    })

    expect(cardReview.cardId).toBe('123')
    expect(cardReview.createdAt).toBeInstanceOf(Date)
    expect(cardReview.difficultyLevel).toBe(CardReviewDifficultyLevel.EASY)
    expect(cardReview.id).toEqual(expect.any(String))
  })
})
