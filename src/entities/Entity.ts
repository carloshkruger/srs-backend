import { randomUUID } from 'crypto'

export abstract class Entity<T> {
  private _props: T
  private _id: string

  constructor(props: T, id?: string) {
    this._props = props
    this._id = !id ? randomUUID() : id
  }

  get props(): T {
    return this._props
  }

  get id(): string {
    return this._id
  }
}
