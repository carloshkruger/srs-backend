import { Entity } from './Entity'

type UserTokenProps = {
  userId: string
  token: string
  createdAt: Date
}

export class UserToken extends Entity<UserTokenProps> {
  public get userId(): string {
    return this.props.userId
  }

  public get token(): string {
    return this.props.token
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  private constructor(props: UserTokenProps, id?: string) {
    super(props, id)
  }

  public static create(props: UserTokenProps, id?: string): UserToken {
    return new UserToken(props, id)
  }
}
