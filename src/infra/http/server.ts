import { connect as connectDatabase } from '@shared/PrismaUtils'

const bootstrap = async () => {
  await connectDatabase()

  const app = (await import('./app')).default

  const port = process.env.PORT

  app.listen(port, () => console.log('Server online'))
}

bootstrap()
