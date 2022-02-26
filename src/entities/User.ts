import { Entity } from './Entity'

export type UserProps = {
  name: string
  password?: string
  email: string
}

export class User extends Entity<UserProps> {
  public get name(): string {
    return this.props.name
  }

  public get password(): string | undefined {
    return this.props.password
  }

  public get email(): string {
    return this.props.email
  }

  private constructor(props: UserProps, id?: string) {
    super(props, id)
  }

  public static create(props: UserProps, id?: string): User {
    return new User(
      {
        ...props,
        name: props.name.trim(),
        email: props.email.trim()
      },
      id
    )
  }

  public updateName(name: string): void {
    this.props.name = name
  }

  public updateEmail(email: string): void {
    this.props.email = email
  }

  public updatePassword(password: string): void {
    this.props.password = password
  }
}
