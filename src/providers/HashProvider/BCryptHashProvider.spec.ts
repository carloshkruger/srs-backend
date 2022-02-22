import { BCryptHashProvider } from './BCryptHashProvider'
import { hash } from 'bcrypt'

jest.mock('bcrypt')

describe('BCryptHashProvider', () => {
  let bCryptHashProvider: BCryptHashProvider

  beforeEach(() => {
    bCryptHashProvider = new BCryptHashProvider()
  })

  it('should call the library function with correct params', async () => {
    const result = await bCryptHashProvider.hash('text')
    expect(result).not.toBe('text')
    expect(hash).toHaveBeenCalledWith('text', 10)
  })
})
