import { config } from 'dotenv'

const result = config({
  path: `${__dirname}/../.env.test`
})

if (result.error) {
  throw new Error(result.error.message)
}

process.env = Object.assign(process.env, result.parsed)
