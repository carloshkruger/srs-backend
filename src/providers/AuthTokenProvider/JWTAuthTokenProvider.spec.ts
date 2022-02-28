import { sign } from 'jsonwebtoken'
import { JWTAuthTokenProvider } from './JWTAuthTokenProvider'

jest.mock('jsonwebtoken')

describe('JWTAuthTokenProvider', () => {
  describe('generate', () => {
    it('should call sign method with correct values', () => {
      new JWTAuthTokenProvider().generate('1234')

      expect(sign).toHaveBeenCalledWith(
        { userId: '1234' },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h'
        }
      )
    })
  })
})
