import { User, UserProps } from '@entities/User'

export class UserMockBuilder {
  private data: UserProps = {
    email: 'testemail@email.com',
    name: 'test user',
    password: '123456'
  }
  private id = ''

  static aUser(): UserMockBuilder {
    return new UserMockBuilder()
  }

  withId(id: string): UserMockBuilder {
    this.id = id
    return this
  }

  withName(name: string): UserMockBuilder {
    this.data.name = name
    return this
  }

  withEmail(email: string): UserMockBuilder {
    this.data.email = email
    return this
  }

  withPassword(password: string): UserMockBuilder {
    this.data.password = password
    return this
  }

  build(): User {
    return User.create(this.data, this.id)
  }
}
