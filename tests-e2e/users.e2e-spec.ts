import app from '@infra/http/app'
import { JWTAuthTokenProvider } from '@providers/AuthTokenProvider/JWTAuthTokenProvider'
import { BCryptHashProvider } from '@providers/HashProvider/BCryptHashProvider'
import { prismaClient } from '@shared/PrismaUtils'
import request from 'supertest'
import { clearDatabase } from './prismaTestUtils'

describe('Users e2e', () => {
  beforeAll(async () => await clearDatabase())
  beforeEach(async () => await prismaClient.user.deleteMany())
  afterAll(async () => await clearDatabase())

  describe('POST /v1/users', () => {
    it('should create an user', async () => {
      await request(app)
        .post('/v1/users')
        .send({
          name: 'user name',
          email: 'email@email.com',
          password: '123456'
        })
        .expect(201)
        .then((result) => {
          expect(result.body).toMatchObject({
            id: expect.any(String)
          })
        })

      const userCount = await prismaClient.user.count()
      expect(userCount).toBe(1)
    })
  })

  describe('PUT /v1/users', () => {
    it('should update an user', async () => {
      const userId = 'd7387bf2-37bc-4847-9e1c-cd435bd940d0'
      await prismaClient.user.create({
        data: {
          id: userId,
          name: 'user name',
          email: 'email@email.com',
          password: '123456'
        }
      })

      const token = new JWTAuthTokenProvider().generate(userId)

      await request(app)
        .put('/v1/users')
        .set('authorization', `Bearer ${token}`)
        .send({
          name: 'user name 2',
          email: 'email2@email.com'
        })
        .expect(204)

      const userCount = await prismaClient.user.count()
      expect(userCount).toBe(1)

      const user = await prismaClient.user.findUnique({
        where: {
          id: userId
        }
      })

      expect(user.name).toBe('user name 2')
      expect(user.email).toBe('email2@email.com')
    })

    it('should not be possible to update an user without the JWT token', async () => {
      await request(app)
        .put('/v1/users')
        .send({
          name: 'user name 2',
          email: 'email2@email.com'
        })
        .expect(403)
    })
  })

  describe('DELETE /v1/users', () => {
    it('should delete an user', async () => {
      const userId = 'd7387bf2-37bc-4847-9e1c-cd435bd940d0'
      await prismaClient.user.create({
        data: {
          id: userId,
          name: 'user name',
          email: 'email@email.com',
          password: '123456'
        }
      })

      const token = new JWTAuthTokenProvider().generate(userId)

      await request(app)
        .delete('/v1/users')
        .set('authorization', `Bearer ${token}`)
        .send()
        .expect(204)

      const userCount = await prismaClient.user.count()
      expect(userCount).toBe(0)
    })

    it('should not be possible to delete an user without the JWT token', async () => {
      await request(app).delete('/v1/users').send().expect(403)
    })
  })

  describe('PUT /v1/users/password', () => {
    it('should update the user password', async () => {
      const userId = 'd7387bf2-37bc-4847-9e1c-cd435bd940d0'
      const hashedPassword = await new BCryptHashProvider().hash('123456')

      await prismaClient.user.create({
        data: {
          id: userId,
          name: 'user name',
          email: 'email@email.com',
          password: hashedPassword
        }
      })

      const token = new JWTAuthTokenProvider().generate(userId)

      await request(app)
        .put(`/v1/users/password`)
        .set('authorization', `Bearer ${token}`)
        .send({
          currentPassword: '123456',
          newPassword: '12345678'
        })
        .expect(204)

      const user = await prismaClient.user.findUnique({
        where: {
          id: userId
        }
      })

      expect(user.password).not.toBe(hashedPassword)
    })

    it('should not be possible to update the user password without the JWT token', async () => {
      await request(app)
        .put(`/v1/users/password`)
        .send({
          currentPassword: '123456',
          newPassword: '12345678'
        })
        .expect(403)
    })
  })
})
