module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: [],
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: {},
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}
