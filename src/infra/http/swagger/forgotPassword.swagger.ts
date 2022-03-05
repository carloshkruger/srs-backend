export default {
  '/v1/forgot-password': {
    post: {
      tags: ['ForgotPassword'],
      summary: 'Send an email to recover the password',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string'
                }
              },
              example: {
                email: 'testuser@email.com'
              }
            }
          }
        }
      },
      responses: {
        204: {
          description: 'Success'
        }
      }
    }
  },
  '/v1/forgot-password/reset': {
    post: {
      tags: ['ForgotPassword'],
      summary: 'Update the password',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                },
                password: {
                  type: 'string'
                }
              },
              example: {
                token: 'token',
                password: '123456'
              }
            }
          }
        }
      },
      responses: {
        204: {
          description: 'Success'
        }
      }
    }
  }
}
