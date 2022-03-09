import { Express } from 'express'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { isProductionEnvironment } from '@shared/environment.utils'

export const setupSentry = (app: Express): void => {
  if (!isProductionEnvironment()) {
    return
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app })
    ]
  })
  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
  app.use(Sentry.Handlers.errorHandler())
}
