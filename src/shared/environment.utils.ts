export const isDevEnvironment = () => process.env.NODE_ENV === 'dev'
export const isProductionEnvironment = () =>
  process.env.NODE_ENV === 'production'
export const isTestEnvironment = () => process.env.NODE_ENV === 'test'
