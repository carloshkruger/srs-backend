import { prismaClient } from '@shared/PrismaUtils'
import { clearDatabase } from './prismaTestUtils'
import app from '@infra/http/app'
import request from 'supertest'

describe('ForgotPassword e2e', () => {
  beforeAll(async () => await clearDatabase())
  beforeEach(async () => await prismaClient.user.deleteMany())
  afterAll(async () => await clearDatabase())

  describe('POST /v1/forgot-password', () => {
    it('should create a request to change the password', async () => {
      const userId = 'd7387bf2-37bc-4847-9e1c-cd435bd940d0'
      const email = 'email@email.com'
      await prismaClient.user.create({
        data: {
          id: userId,
          name: 'user name',
          email,
          password: '123456'
        }
      })

      await request(app).post('/v1/forgot-password').send({ email }).expect(204)

      const userTokenCount = await prismaClient.userToken.count()
      expect(userTokenCount).toBe(1)
    })

    it('should return success even if the email does not exists', async () => {
      const email = 'email@email.com'

      await request(app).post('/v1/forgot-password').send({ email }).expect(204)
      const userTokenCount = await prismaClient.userToken.count()
      expect(userTokenCount).toBe(0)
    })
  })

  describe('POST /v1/forgot-password/reset', () => {
    it('should reset the password', async () => {
      const userId = 'd7387bf2-37bc-4847-9e1c-cd435bd940d0'
      const token = '215698d0-a6cd-4481-b355-490e76b26cf7'
      const password = '123456'

      await prismaClient.user.create({
        data: {
          id: userId,
          name: 'user name',
          email: 'email@email.com',
          password,
          userToken: {
            create: {
              id: '4f3f7550-23df-4074-9534-df0ecf141de7',
              token,
              createdAt: new Date()
            }
          }
        }
      })

      await request(app)
        .post('/v1/forgot-password/reset')
        .send({
          token,
          password: '12345678'
        })
        .expect(204)

      const user = await prismaClient.user.findUnique({
        where: {
          id: userId
        }
      })
      expect(user.password).not.toBe(password)

      const userTokenCount = await prismaClient.userToken.count()
      expect(userTokenCount).toBe(0)
    })
  })
})
