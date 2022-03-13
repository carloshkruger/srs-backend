import { prismaClient } from '@shared/PrismaUtils'
import { clearDatabase } from './prismaTestUtils'
import request from 'supertest'
import app from '@infra/http/app'
import { JWTAuthTokenProvider } from '@providers/AuthTokenProvider/JWTAuthTokenProvider'

describe('Decks e2e', () => {
  let token: string
  const userId = 'd7387bf2-37bc-4847-9e1c-cd435bd940d0'

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

    token = new JWTAuthTokenProvider().generate(userId)
  })
  beforeEach(async () => await prismaClient.deck.deleteMany())
  afterAll(async () => await clearDatabase())

  describe('POST /v1/decks', () => {
    it('should create a deck', async () => {
      await request(app)
        .post('/v1/decks')
        .set('authorization', `Bearer ${token}`)
        .send({
          name: 'deck name',
          description: 'deck description'
        })
        .expect(201)
        .then((result) => {
          expect(result.body).toMatchObject({
            id: expect.any(String)
          })
        })

      const deckCount = await prismaClient.deck.count()
      expect(deckCount).toBe(1)
    })

    it('should not be possible to create a deck without the JWT token', async () => {
      await request(app)
        .post('/v1/decks')
        .send({
          name: 'deck name',
          description: 'deck description'
        })
        .expect(403)
    })
  })

  describe('PUT /v1/decks/:id', () => {
    it('should update a deck', async () => {
      const deckId = 'a02413e0-4ee9-4f5d-be85-ca0e8511030c'

      await prismaClient.deck.create({
        data: {
          id: deckId,
          name: 'deck name',
          description: 'deck description',
          userId
        }
      })

      await request(app)
        .put(`/v1/decks/${deckId}`)
        .set('authorization', `Bearer ${token}`)
        .send({
          name: 'deck name 2',
          description: 'deck description 2'
        })
        .expect(204)

      const deckCount = await prismaClient.deck.count()
      expect(deckCount).toBe(1)
      const deckModel = await prismaClient.deck.findUnique({
        where: {
          id: deckId
        }
      })
      expect(deckModel.name).toBe('deck name 2')
      expect(deckModel.description).toBe('deck description 2')
    })

    it('should not be possible to update a deck without the JWT token', async () => {
      const deckId = 'a02413e0-4ee9-4f5d-be85-ca0e8511030c'

      await request(app)
        .put(`/v1/decks/${deckId}`)
        .send({
          name: 'deck name 2',
          description: 'deck description 2'
        })
        .expect(403)
    })
  })

  describe('DELETE /v1/decks/:id', () => {
    it('should delete a deck and its cards', async () => {
      const deckId = 'a02413e0-4ee9-4f5d-be85-ca0e8511030c'

      await prismaClient.deck.create({
        data: {
          id: deckId,
          name: 'deck name',
          description: 'deck description',
          userId,
          cards: {
            create: [
              {
                id: 'eabe71e4-cbd2-409a-bac6-0d0a984a21d8',
                audioFileName: 'audio.mp3',
                originalText: 'original text',
                translatedText: 'translated text'
              }
            ]
          }
        }
      })

      const cardsCountBeforeDelete = await prismaClient.card.count({
        where: {
          deckId
        }
      })
      expect(cardsCountBeforeDelete).toBe(1)

      await request(app)
        .delete(`/v1/decks/${deckId}`)
        .set('authorization', `Bearer ${token}`)
        .expect(204)

      const deckCount = await prismaClient.deck.count()
      const cardsCountAfterDelete = await prismaClient.card.count({
        where: {
          deckId
        }
      })

      expect(deckCount).toBe(0)
      expect(cardsCountAfterDelete).toBe(0)
    })

    it('should not be possible to delete a deck without the JWT token', async () => {
      const deckId = 'a02413e0-4ee9-4f5d-be85-ca0e8511030c'

      await request(app).delete(`/v1/decks/${deckId}`).expect(403)
    })
  })

  describe('GET /v1/decks/:id', () => {
    it('should find deck info', async () => {
      const deckId = 'a02413e0-4ee9-4f5d-be85-ca0e8511030c'

      await prismaClient.deck.create({
        data: {
          id: deckId,
          name: 'deck name',
          description: 'deck description',
          userId,
          cards: {
            create: [
              {
                id: 'eabe71e4-cbd2-409a-bac6-0d0a984a21d8',
                audioFileName: 'audio.mp3',
                originalText: 'original text',
                translatedText: 'translated text',
                nextReviewAt: new Date()
              }
            ]
          }
        }
      })

      await request(app)
        .get(`/v1/decks/${deckId}`)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) =>
          expect(response.body).toEqual({
            id: deckId,
            name: 'deck name',
            description: 'deck description',
            userId,
            cards: {
              totalQuantity: 1,
              availableForStudyQuantity: 1
            }
          })
        )
    })

    it('should not be possible to find deck info without the JWT token', async () => {
      const deckId = 'a02413e0-4ee9-4f5d-be85-ca0e8511030c'

      await request(app).get(`/v1/decks/${deckId}`).expect(403)
    })
  })

  describe('GET /v1/decks/:id/cards', () => {
    it('should find all deck cards, even the ones not available for study', async () => {
      const deckId = 'a02413e0-4ee9-4f5d-be85-ca0e8511030c'
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)

      await prismaClient.deck.create({
        data: {
          id: deckId,
          name: 'deck name',
          description: 'deck description',
          userId,
          cards: {
            create: [
              {
                id: 'eabe71e4-cbd2-409a-bac6-0d0a984a21d8',
                audioFileName: 'audio.mp3',
                originalText: 'original text',
                translatedText: 'translated text',
                nextReviewAt: new Date()
              },
              {
                id: '2229832e-85b9-4d8e-aff5-bcf32286670d',
                audioFileName: 'audio2.mp3',
                originalText: 'original text 2',
                translatedText: 'translated text 2',
                nextReviewAt: futureDate
              }
            ]
          }
        }
      })

      await request(app)
        .get(`/v1/decks/${deckId}/cards`)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => expect(response.body.cards).toHaveLength(2))
    })

    it('should not be possible to find all deck cards without the JWT token', async () => {
      const deckId = 'a02413e0-4ee9-4f5d-be85-ca0e8511030c'

      await request(app).get(`/v1/decks/${deckId}/cards`).expect(403)
    })
  })

  describe('GET /v1/decks/study', () => {
    it('should return a list of decks and quantity of cards', async () => {
      await prismaClient.deck.create({
        data: {
          id: 'a02413e0-4ee9-4f5d-be85-ca0e8511030c',
          name: 'deck name',
          description: 'deck description',
          userId,
          cards: {
            create: [
              {
                id: 'eabe71e4-cbd2-409a-bac6-0d0a984a21d8',
                audioFileName: 'audio.mp3',
                originalText: 'original text',
                translatedText: 'translated text'
              }
            ]
          }
        }
      })

      await request(app)
        .get('/v1/decks/study')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .then((response) => {
          expect(response.body.decks).toHaveLength(1)
        })
    })

    it('should return an empty list if there is no deck created', async () => {
      await request(app)
        .get('/v1/decks/study')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .then((response) => {
          expect(response.body.decks).toHaveLength(0)
        })
    })

    it('should return an empty list if the user do not have decks created', async () => {
      const userDifferentFromTheOneOnToken =
        'a5754269-decf-43ce-8b6b-ade85806e248'

      await prismaClient.user.create({
        data: {
          id: userDifferentFromTheOneOnToken,
          name: 'user name',
          email: 'email@email.com',
          password: '123456'
        }
      })

      await prismaClient.deck.create({
        data: {
          id: 'a02413e0-4ee9-4f5d-be85-ca0e8511030c',
          name: 'deck name',
          description: 'deck description',
          userId: userDifferentFromTheOneOnToken,
          cards: {
            create: [
              {
                id: 'eabe71e4-cbd2-409a-bac6-0d0a984a21d8',
                audioFileName: 'audio.mp3',
                originalText: 'original text',
                translatedText: 'translated text'
              }
            ]
          }
        }
      })

      await request(app)
        .get('/v1/decks/study')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .then((response) => {
          expect(response.body.decks).toHaveLength(0)
        })
    })

    it('should not be possible to return a list of decks without the JWT token', async () => {
      await request(app).get('/v1/decks/study').expect(403)
    })
  })
})
