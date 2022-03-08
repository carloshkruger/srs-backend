import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'debug',
      format: format.combine(format.colorize(), format.json())
    }),
    new transports.File({
      filename: 'errors.log',
      level: 'error',
      format: format.combine(
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.json(),
        format.prettyPrint()
      )
    })
  ]
})

class Logger {
  static debug(message: string): void {
    logger.debug(message)
  }

  static info(message: string): void {
    logger.info(message)
  }

  static warn(error: Error): void {
    logger.warn(error)
  }

  static error(error: Error): void {
    logger.error({
      name: error.name,
      message: error.message,
      stack: error?.stack
    })
  }
}

export { Logger }
