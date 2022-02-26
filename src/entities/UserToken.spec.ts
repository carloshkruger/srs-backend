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

  it('isTokenExpired - should return true if the token is expired', () => {
    const userToken = UserToken.create({
      createdAt: new Date(),
      token: 'token',
      userId: '1234'
    })

    const now = new Date()
    now.setMinutes(now.getMinutes() + userToken.tokenTimeToLiveInMinutes + 1)

    jest.useFakeTimers('modern').setSystemTime(now)

    expect(userToken.isTokenExpired()).toBe(true)
  })

  it('isTokenExpired - should return false if the token is not expired', () => {
    const userToken = UserToken.create({
      createdAt: new Date(),
      token: 'token',
      userId: '1234'
    })

    const now = new Date()
    now.setMinutes(now.getMinutes() + userToken.tokenTimeToLiveInMinutes - 1)

    jest.useFakeTimers('modern').setSystemTime(now)

    expect(userToken.isTokenExpired()).toBe(false)
  })
})
