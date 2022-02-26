import { CardReview } from '@entities/CardReview'

const INITIAL_EASINESS_FACTOR = 2.5

export class Sm2Algorithm {
  public static calculateNextReviewDate(
    cardReviews: CardReview[]
  ): AlgorithmData {
    const initialValues: AlgorithmData = {
      intervalInDays: 0,
      easinessFactor: INITIAL_EASINESS_FACTOR,
      repetition: 0
    }

    return cardReviews.reduce<AlgorithmData>((finalResult, cardReview) => {
      const difficultyLevel = cardReview.difficultyLevel
      const repetition = finalResult.repetition
      const easinessFactor = finalResult.easinessFactor

      return {
        intervalInDays: this.calculateNewIntervalInDays(
          difficultyLevel,
          repetition,
          easinessFactor
        ),
        easinessFactor: this.calculateNewEasinessFactor(
          easinessFactor,
          difficultyLevel
        ),
        repetition: this.calculateNextRepetitionCount(
          difficultyLevel,
          repetition
        )
      }
    }, initialValues)
  }

  private static calculateNewEasinessFactor(
    currentEassinesFactor: number,
    difficultyLevel: number
  ): number {
    let newEasinessFactor =
      currentEassinesFactor +
      (0.1 - (5 - difficultyLevel) * (0.08 + (5 - difficultyLevel) * 0.02))

    if (newEasinessFactor < 1.3) {
      newEasinessFactor = 1.3
    }

    return newEasinessFactor
  }

  private static calculateNewIntervalInDays(
    difficultyLevel: number,
    repetition: number,
    easinessFactor: number
  ): number {
    let nextInterval = 0

    if (difficultyLevel >= 3) {
      if (repetition === 0) {
        nextInterval = 1
      } else if (repetition === 1) {
        nextInterval = 6
      } else {
        nextInterval = Math.round(repetition * easinessFactor)
      }
    }

    return nextInterval
  }

  private static calculateNextRepetitionCount(
    difficultyLevel: number,
    currentRepetitionCount: number
  ): number {
    return difficultyLevel >= 3 ? currentRepetitionCount + 1 : 0
  }
}

type AlgorithmData = {
  intervalInDays: number
  easinessFactor: number
  repetition: number
}
