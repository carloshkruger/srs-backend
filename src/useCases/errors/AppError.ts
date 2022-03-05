export class AppError extends Error {
  private _httpCode: number

  constructor(message: string, httpCode = 400) {
    super(message)
    this.name = AppError.name
    this._httpCode = httpCode
  }

  public get httpCode(): number {
    return this._httpCode
  }
}
