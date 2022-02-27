import usersSwagger from './users.swagger'
import authSwagger from './auth.swagger'
import decksSwagger from './decks.swagger'
import cardsSwagger from './cards.swagger'
import forgotPasswordSwagger from './forgotPassword.swagger'

export default {
  openapi: '3.0.0',
  info: {
    title: 'API - Spaced Repetition System',
    description: '',
    version: '1.0.0'
  },
  tags: [
    {
      name: 'Users'
    },
    {
      name: 'Auth'
    },
    {
      name: 'Decks'
    },
    {
      name: 'Cards'
    },
    {
      name: 'ForgotPassword'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    ...usersSwagger,
    ...authSwagger,
    ...decksSwagger,
    ...cardsSwagger,
    ...forgotPasswordSwagger
  }
}
