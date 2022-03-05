import { BCryptHashProvider } from '@providers/HashProvider/BCryptHashProvider'
import { prismaClient } from '@shared/PrismaUtils'
import { clearDatabase } from './prismaTestUtils'
import app from '@infra/http/app'
import request from 'supertest'

describe('Auth e2e', () => {
  beforeAll(async () => await clearDatabase())
  beforeEach(async () => await prismaClient.user.deleteMany())
  afterAll(async () => await clearDatabase())

  describe('POST /v1/auth', () => {
    it('should generate a token', async () => {
      const userId = 'd7387bf2-37bc-4847-9e1c-cd435bd940d0'
      const email = 'email@email.com'
      const name = 'user name'
      const password = '123456'
      const hashedPassword = await new BCryptHashProvider().hash(password)

      await prismaClient.user.create({
        data: {
          id: userId,
          name,
          email,
          password: hashedPassword
        }
      })

      await request(app)
        .post('/v1/auth')
        .send({
          email,
          password
        })
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            user: {
              id: userId,
              name,
              email
            },
            token: expect.any(String)
          })
          expect(response.body.user).not.toHaveProperty('password')
        })
    })
  })
})
