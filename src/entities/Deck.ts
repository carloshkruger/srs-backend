import { Entity } from './Entity'

type DeckProps = {
  userId: string
  name: string
  description?: string
}

export class Deck extends Entity<DeckProps> {
  public get userId(): string {
    return this.props.userId
  }

  public get name(): string {
    return this.props.name
  }

  public get description(): string {
    return this.props.description
  }

  private constructor(props: DeckProps, id?: string) {
    super(props, id)
  }

  public static create(props: DeckProps, id?: string): Deck {
    return new Deck(props, id)
  }
}
