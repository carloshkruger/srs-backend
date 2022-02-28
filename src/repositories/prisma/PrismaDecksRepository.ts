import { Deck } from '@entities/Deck'
import {
  DecksRepository,
  FindAllAndCardsQuantityByUserIdResponse
} from '@repositories/DecksRepository'
import { prismaClient } from '@shared/PrismaUtils'
import { Deck as PrismaDeckModel } from '@prisma/client'

export class PrismaDecksRepository implements DecksRepository {
  async findById(id: string): Promise<Deck> {
    const model = await prismaClient.deck.findUnique({
      where: {
        id
      }
    })

    return this.mapDeckToDomain(model)
  }

  async findByNameAndUserId(name: string, userId: string): Promise<Deck> {
    const model = await prismaClient.deck.findFirst({
      where: {
        name,
        userId
      }
    })

    return this.mapDeckToDomain(model)
  }

  async save(deck: Deck): Promise<void> {
    const model = {
      name: deck.name,
      description: deck.description,
      userId: deck.userId
    }

    await prismaClient.deck.upsert({
      create: {
        ...model,
        id: deck.id
      },
      update: model,
      where: {
        id: deck.id
      }
    })
  }

  async deleteById(id: string): Promise<void> {
    await prismaClient.deck.delete({
      where: {
        id
      }
    })
  }

  async findAllAndCardsQuantityByUserId(
    userId: string
  ): Promise<FindAllAndCardsQuantityByUserIdResponse[]> {
    const data = await prismaClient.$queryRaw<any[]>`
      SELECT decks.*,
	           (SELECT COUNT(*)
			          FROM cards
			         WHERE cards.deck_id = decks.id) AS cards_count,
			       (SELECT COUNT(*)
			          FROM cards
			         WHERE cards.deck_id = decks.id
			           AND cards.next_review_at < NOW()) AS cards_available_count
        FROM decks
       WHERE decks.user_id = ${userId}
    `

    return data.map((item) => ({
      deck: {
        id: item.id,
        name: item.name,
        description: item.description
      },
      cards: {
        totalQuantity: Number(item.cards_count),
        availableForStudyQuantity: Number(item.cards_available_count)
      }
    }))
  }

  private mapDeckToDomain(model: PrismaDeckModel): Deck {
    if (!model) {
      return undefined
    }

    return Deck.create(
      {
        name: model.name,
        userId: model.userId,
        description: model.description
      },
      model.id
    )
  }
}
