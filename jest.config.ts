import { pathsToModuleNameMapper } from 'ts-jest/utils'
import { compilerOptions } from './tsconfig.json'

module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/@types/**',
    '!src/**/index.ts',
    '!src/**/*Stub.ts',
    '!src/api/Controller.ts',
    '!src/infra/**',
    '!src/index.ts',
    '!src/entities/Entity.ts',
    '!src/**/mocks/**',
    '!src/shared/PrismaUtils.ts',
    '!src/repositories/**',
    '!src/providers/MailTemplateProvider/**',
    '!src/providers/MailProvider/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/'
  }),
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}
