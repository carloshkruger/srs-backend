export default {
  '/auth': {
    post: {
      tags: ['Auth'],
      summary: 'Authenticate user with email and password',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string'
                },
                password: {
                  type: 'string'
                }
              },
              example: {
                email: 'testuser@email.com',
                password: '123456'
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string'
                      },
                      name: {
                        type: 'string'
                      },
                      email: {
                        type: 'string'
                      }
                    }
                  },
                  token: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
