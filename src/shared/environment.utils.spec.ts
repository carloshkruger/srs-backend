import {
  isDevEnvironment,
  isProductionEnvironment,
  isTestEnvironment
} from './environment.utils'

describe('environment utils', () => {
  const currentEnvironmentVariables = { ...process.env }

  beforeEach(() => {
    process.env = { ...currentEnvironmentVariables }
  })

  afterAll(() => {
    process.env = { ...currentEnvironmentVariables }
  })

  describe('isDevEnvironment', () => {
    it('should return true when is dev environment', () => {
      process.env.NODE_ENV = 'dev'
      expect(isDevEnvironment()).toBe(true)
    })

    it('should return false when is not dev environment', () => {
      process.env.NODE_ENV = ''
      expect(isDevEnvironment()).toBe(false)
    })
  })

  describe('isProductionEnvironment', () => {
    it('should return true when is production environment', () => {
      process.env.NODE_ENV = 'production'
      expect(isProductionEnvironment()).toBe(true)
    })

    it('should return false when is not production environment', () => {
      process.env.NODE_ENV = ''
      expect(isProductionEnvironment()).toBe(false)
    })
  })

  describe('isTestEnvironment', () => {
    it('should return true when is test environment', () => {
      process.env.NODE_ENV = 'test'
      expect(isTestEnvironment()).toBe(true)
    })

    it('should return false when is not test environment', () => {
      process.env.NODE_ENV = ''
      expect(isTestEnvironment()).toBe(false)
    })
  })
})
