import { Card } from '@entities/Card'
import { CardReview } from '@entities/CardReview'
import {
  CardsRepository,
  FindCardsForReviewParams
} from '@repositories/CardsRepository'
import { prismaClient } from '@shared/PrismaUtils'
import {
  Card as PrismaCardModel,
  CardReview as PrismaCardReviewModel
} from '@prisma/client'

export class PrismaCardsRepository implements CardsRepository {
  async save(card: Card): Promise<void> {
    const operations = []

    const cardModel = {
      originalText: card.originalText,
      translatedText: card.translatedText,
      audioFileName: card.audioFileName,
      deckId: card.deckId,
      nextReviewAt: card.nextReviewAt
    }

    operations.push(
      prismaClient.card.upsert({
        create: {
          ...cardModel,
          id: card.id
        },
        update: cardModel,
        where: {
          id: card.id
        }
      })
    )

    card.newCardReviews.forEach((item) => {
      operations.push(
        prismaClient.cardReview.create({
          data: {
            id: item.id,
            difficultyLevel: item.difficultyLevel,
            cardId: item.cardId,
            createdAt: item.createdAt
          }
        })
      )
    })

    await prismaClient.$transaction(operations)
  }

  async findById(id: string): Promise<Card> {
    const model = await prismaClient.card.findUnique({
      where: {
        id
      },
      include: {
        reviews: true
      }
    })

    return this.mapCardToDomain(model)
  }

  async findByDeckId(deckId: string): Promise<Card[]> {
    const models = await prismaClient.card.findMany({
      where: {
        deckId
      },
      include: {
        reviews: true
      }
    })

    return models.map((model) => this.mapCardToDomain(model))
  }

  async findByDeckIdAndOriginalText(
    deckId: string,
    originalText: string
  ): Promise<Card> {
    const model = await prismaClient.card.findFirst({
      where: {
        deckId,
        originalText
      },
      include: {
        reviews: true
      }
    })

    return this.mapCardToDomain(model)
  }

  async countCardsCreatedTodayByUser(userId: string): Promise<number> {
    return prismaClient.card.count({
      where: {
        deck: {
          userId
        },
        createdAt: new Date()
      }
    })
  }

  async deleteById(id: string): Promise<void> {
    await prismaClient.card.delete({
      where: {
        id
      }
    })
  }

  async countCardsReviewedTodayByUser(userId: string): Promise<number> {
    return prismaClient.card.count({
      where: {
        deck: {
          userId
        },
        reviews: {
          every: {
            createdAt: new Date()
          }
        }
      }
    })
  }

  async findCardsForReview({
    deckId,
    userId,
    limit
  }: FindCardsForReviewParams): Promise<Card[]> {
    const models = await prismaClient.card.findMany({
      where: {
        deck: {
          id: deckId,
          userId: userId
        },
        nextReviewAt: {
          lte: new Date()
        }
      },
      include: {
        reviews: true
      },
      take: limit
    })

    return models.map((model) => this.mapCardToDomain(model))
  }

  private mapCardToDomain(model: PrismaCardModel): Card {
    if (!model) {
      return undefined
    }

    const reviews = ((model as any).reviews || []) as PrismaCardReviewModel[]

    return Card.create(
      {
        deckId: model.deckId,
        audioFileName: model.audioFileName,
        originalText: model.originalText,
        translatedText: model.translatedText,
        nextReviewAt: model.nextReviewAt,
        cardReviews: reviews.map((review: any) =>
          CardReview.create(
            {
              cardId: review.cardId,
              createdAt: review.createdAt,
              difficultyLevel: review.difficultyLevel
            },
            review.id
          )
        )
      },
      model.id
    )
  }
}
