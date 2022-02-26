import { User } from './User'
import { UserToken } from './UserToken'

describe('UserToken', () => {
  it('getters should return correct values', () => {
    const userToken = UserToken.create({
      createdAt: new Date(),
      token: 'token',
      userId: '1234'
    })

    expect(userToken.createdAt).toBeInstanceOf(Date)
    expect(userToken.token).toBe('token')
    expect(userToken.userId).toBe('1234')
    expect(userToken.id).toEqual(expect.any(String))
  })
})
