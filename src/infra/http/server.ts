import { connect as connectDatabase } from '@shared/PrismaUtils'

const bootstrap = async () => {
  await connectDatabase()

  const app = (await import('./app')).default

  app.listen(3000, () => console.log('Server online'))
}

bootstrap()
