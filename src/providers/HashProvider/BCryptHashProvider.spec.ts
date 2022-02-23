import { BCryptHashProvider } from './BCryptHashProvider'
import { hash, compare } from 'bcrypt'

jest.mock('bcrypt')

describe('BCryptHashProvider', () => {
  let bCryptHashProvider: BCryptHashProvider

  beforeEach(() => {
    bCryptHashProvider = new BCryptHashProvider()
  })

  it('should call the library function with correct param to create a hash', async () => {
    await bCryptHashProvider.hash('text')
    expect(hash).toHaveBeenCalledWith('text', 10)
  })

  it('should call the library function with correct params to compare', async () => {
    await bCryptHashProvider.compare({
      plainText: 'plain_text',
      hashText: 'hash_text'
    })
    expect(compare).toHaveBeenCalledWith('plain_text', 'hash_text')
  })
})
