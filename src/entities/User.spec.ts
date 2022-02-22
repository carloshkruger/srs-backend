import { User } from './User'

describe('User', () => {
  it('getters should return correct values', () => {
    const user = User.create({
      name: 'name test',
      email: 'email_test@email.com',
      password: '123456'
    })

    expect(user.name).toBe('name test')
    expect(user.email).toBe('email_test@email.com')
    expect(user.password).toBe('123456')
    expect(user.id).toEqual(expect.any(String))
  })

  it('should update values', () => {
    const user = User.create({
      name: 'name test',
      email: 'email_test@email.com',
      password: '123456'
    })

    user.updateName('new name')
    user.updateEmail('newemail@email.com')

    expect(user.name).toBe('new name')
    expect(user.email).toBe('newemail@email.com')
    expect(user.password).toBe('123456')
    expect(user.id).toEqual(expect.any(String))
  })
})
