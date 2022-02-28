import * as jwt from 'jsonwebtoken'
import { JWTAuthTokenProvider } from './JWTAuthTokenProvider'

jest.mock('jsonwebtoken')

describe('JWTAuthTokenProvider', () => {
  describe('generate', () => {
    it('should call sign method with correct values', () => {
      new JWTAuthTokenProvider().generate('1234')

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: '1234' },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h'
        }
      )
    })
  })
  describe('decrypt', () => {
    it('should call verify method with correct values', () => {
      jest.spyOn(jwt, 'verify').mockReturnValue({
        userId: '1234'
      } as any)
      new JWTAuthTokenProvider().decrypt('token')

      expect(jwt.verify).toHaveBeenCalledWith('token', process.env.JWT_SECRET)
    })
  })
})
