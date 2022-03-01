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

  describe('POST /users', () => {
    it('should create an user', async () => {
      await request(app)
        .post('/users')
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

  describe('PUT /users/:id', () => {
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
        .put(`/users/${userId}`)
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
      const userId = 'd7387bf2-37bc-4847-9e1c-cd435bd940d0'

      await request(app)
        .put(`/users/${userId}`)
        .send({
          name: 'user name 2',
          email: 'email2@email.com'
        })
        .expect(403)
    })
  })

  describe('DELETE /users/:id', () => {
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
        .delete(`/users/${userId}`)
        .set('authorization', `Bearer ${token}`)
        .send()
        .expect(204)

      const userCount = await prismaClient.user.count()
      expect(userCount).toBe(0)
    })

    it('should not be possible to delete an user without the JWT token', async () => {
      const userId = 'd7387bf2-37bc-4847-9e1c-cd435bd940d0'

      await request(app).delete(`/users/${userId}`).send().expect(403)
    })
  })

  describe('PUT /users/:id/password', () => {
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
        .put(`/users/${userId}/password`)
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
      const userId = 'd7387bf2-37bc-4847-9e1c-cd435bd940d0'

      await request(app)
        .put(`/users/${userId}/password`)
        .send({
          currentPassword: '123456',
          newPassword: '12345678'
        })
        .expect(403)
    })
  })
})
