import { JWTAuthTokenProvider } from '@providers/AuthTokenProvider/JWTAuthTokenProvider'
import { prismaClient } from '@shared/PrismaUtils'
import { clearDatabase } from './prismaTestUtils'
import request from 'supertest'
import app from '@infra/http/app'
import { CardReviewDifficultyLevel } from '@entities/enums/CardReviewDifficultyLevel'

describe('Cards e2e', () => {
  let token: string
  const userId = 'd7387bf2-37bc-4847-9e1c-cd435bd940d0'
  const deckId = 'a02413e0-4ee9-4f5d-be85-ca0e8511030c'

  beforeAll(async () => {
    await clearDatabase()

    await prismaClient.user.create({
      data: {
        id: userId,
        name: 'user name',
        email: 'email@email.com',
        password: '123456'
      }
    })

    await prismaClient.deck.create({
      data: {
        id: deckId,
        name: 'deck name',
        description: 'deck description',
        userId
      }
    })

    token = new JWTAuthTokenProvider().generate(userId)
  })
  beforeEach(async () => await prismaClient.card.deleteMany())
  afterAll(async () => await clearDatabase())

  describe('POST /cards', () => {
    it('should create a card', async () => {
      await request(app)
        .post('/cards')
        .set('authorization', `Bearer ${token}`)
        .send({
          deckId,
          originalText: 'original text',
          translatedText: 'translated text'
        })
        .expect(201)
        .then((result) => {
          expect(result.body).toMatchObject({
            id: expect.any(String),
            deckId,
            originalText: 'original text',
            translatedText: 'translated text'
          })
        })

      const cardCount = await prismaClient.card.count()
      expect(cardCount).toBe(1)
    })

    it('should not be possible to create a card without the JWT token', async () => {
      await request(app)
        .post('/cards')
        .send({
          deckId,
          originalText: 'original text',
          translatedText: 'translated text'
        })
        .expect(403)
    })
  })

  describe('PUT /cards/:id', () => {
    it('should update a card', async () => {
      const cardId = '1e70d05a-6e65-403b-a5df-ff877f60d429'

      await prismaClient.card.create({
        data: {
          id: cardId,
          audioFileName: 'audio.mp3',
          originalText: 'original text',
          translatedText: 'translated text',
          deckId
        }
      })

      await request(app)
        .put(`/cards/${cardId}`)
        .set('authorization', `Bearer ${token}`)
        .send({
          deckId,
          originalText: 'original text 2',
          translatedText: 'translated text 2'
        })
        .expect(204)

      const cardCount = await prismaClient.card.count()
      expect(cardCount).toBe(1)

      const cardModel = await prismaClient.card.findUnique({
        where: {
          id: cardId
        }
      })
      expect(cardModel.originalText).toBe('original text 2')
      expect(cardModel.translatedText).toBe('translated text 2')
    })

    it('should not be possible to update a card without the JWT token', async () => {
      const cardId = '1e70d05a-6e65-403b-a5df-ff877f60d429'

      await request(app)
        .put(`/cards/${cardId}`)
        .send({
          deckId,
          originalText: 'original text 2',
          translatedText: 'translated text 2'
        })
        .expect(403)
    })
  })

  describe('DELETE /cards/:id', () => {
    it('should delete a card', async () => {
      const cardId = '1e70d05a-6e65-403b-a5df-ff877f60d429'

      await prismaClient.card.create({
        data: {
          id: cardId,
          audioFileName: 'audio.mp3',
          originalText: 'original text',
          translatedText: 'translated text',
          deckId
        }
      })

      await request(app)
        .delete(`/cards/${cardId}`)
        .set('authorization', `Bearer ${token}`)
        .send()
        .expect(204)

      const cardCount = await prismaClient.card.count()
      expect(cardCount).toBe(0)
    })

    it('should not be possible to delete a card without the JWT token', async () => {
      const cardId = '1e70d05a-6e65-403b-a5df-ff877f60d429'

      await request(app).delete(`/cards/${cardId}`).expect(403)
    })
  })

  describe('POST /cards/:id/review', () => {
    it('should create a card review', async () => {
      const cardId = '1e70d05a-6e65-403b-a5df-ff877f60d429'

      await prismaClient.card.create({
        data: {
          id: cardId,
          audioFileName: 'audio.mp3',
          originalText: 'original text',
          translatedText: 'translated text',
          deckId
        }
      })

      await request(app)
        .post(`/cards/${cardId}/review`)
        .set('authorization', `Bearer ${token}`)
        .send({
          difficultyLevel: CardReviewDifficultyLevel.EASY
        })
        .expect(201)

      const cardReviewCount = await prismaClient.cardReview.count({
        where: {
          cardId
        }
      })
      expect(cardReviewCount).toBe(1)
    })

    it('should not be possible to create a card review without the JWT token', async () => {
      const cardId = '1e70d05a-6e65-403b-a5df-ff877f60d429'

      await request(app).post(`/cards/${cardId}/review`).expect(403)
    })
  })

  describe('GET /cards/study', () => {
    it('should return only the cards available for study', async () => {
      const cardIdAvailable = '1e70d05a-6e65-403b-a5df-ff877f60d429'
      const cardIdNotAvailable = 'cae35dd9-9545-4bf9-8d36-3fdf3de17f50'

      const nextReviewAtNotAvailable = new Date()
      nextReviewAtNotAvailable.setDate(nextReviewAtNotAvailable.getDate() + 1)

      await prismaClient.card.create({
        data: {
          id: cardIdAvailable,
          audioFileName: 'audio.mp3',
          originalText: 'original text',
          translatedText: 'translated text',
          deckId
        }
      })
      await prismaClient.card.create({
        data: {
          id: cardIdNotAvailable,
          audioFileName: 'audio.mp3',
          originalText: 'original text',
          translatedText: 'translated text',
          nextReviewAt: nextReviewAtNotAvailable,
          deckId
        }
      })

      await request(app)
        .get('/cards/study')
        .set('authorization', `Bearer ${token}`)
        .send()
        .expect(200)
        .then((response) => {
          expect(response.body.cards).toHaveLength(1)
          expect(response.body.cards[0].id).toBe(cardIdAvailable)
        })
    })

    it('should return only the cards linked with the logged user', async () => {
      const cardIdAvailable = '1e70d05a-6e65-403b-a5df-ff877f60d429'
      const anotherUserId = '8833f1f3-e943-46fd-9b46-eae415dec818'
      const anotherDeckId = '2a5829bc-a88a-4101-87cf-d1d0a3afdb83'
      const anotherCardId = 'e03ab306-ee88-4828-ac60-906810cea1e0'

      await prismaClient.user.create({
        data: {
          id: anotherUserId,
          name: 'user name',
          email: 'email@email.com',
          password: '123456',
          decks: {
            create: {
              id: anotherDeckId,
              name: 'deck name',
              description: 'deck description',
              cards: {
                create: {
                  id: anotherCardId,
                  audioFileName: 'audio.mp3',
                  originalText: 'original text',
                  translatedText: 'translated text'
                }
              }
            }
          }
        }
      })

      await prismaClient.card.create({
        data: {
          id: cardIdAvailable,
          audioFileName: 'audio.mp3',
          originalText: 'original text',
          translatedText: 'translated text',
          deckId
        }
      })

      await request(app)
        .get('/cards/study')
        .set('authorization', `Bearer ${token}`)
        .send()
        .expect(200)
        .then((response) => {
          expect(response.body.cards).toHaveLength(1)
          expect(response.body.cards[0].id).toBe(cardIdAvailable)
        })
    })

    it('should not be possible to return cards without the JWT token', async () => {
      await request(app).post('/cards/study').expect(403)
    })
  })
})
