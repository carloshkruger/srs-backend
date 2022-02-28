import rateLimit, { MemoryStore } from 'express-rate-limit'

const ONE_MINUTE_IN_MILISECONDS = 60 * 1000

export const requestLimiter = rateLimit({
  windowMs: ONE_MINUTE_IN_MILISECONDS,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.'
  },
  store: new MemoryStore()
})
