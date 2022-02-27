const userIdParameter = {
  in: 'path',
  name: 'id',
  schema: {
    type: 'string'
  },
  required: true,
  example: '123'
}

export default {
  '/users': {
    post: {
      tags: ['Users'],
      summary: 'Create user with e-mail and password',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                },
                password: {
                  type: 'string'
                }
              },
              example: {
                name: 'Test User',
                email: 'testuser@email.com',
                password: '123456'
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/users/{id}': {
    put: {
      security: [{ bearerAuth: [] }],
      tags: ['Users'],
      summary: 'Update user',
      parameters: [userIdParameter],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                }
              },
              example: {
                name: 'Test User',
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
    },
    delete: {
      security: [{ bearerAuth: [] }],
      tags: ['Users'],
      summary: 'Delete user',
      parameters: [userIdParameter],
      responses: {
        204: {
          description: 'Success'
        }
      }
    }
  },
  '/users/{id}/password': {
    put: {
      security: [{ bearerAuth: [] }],
      tags: ['Users'],
      summary: 'Update user password',
      parameters: [userIdParameter],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                },
                password: {
                  type: 'string'
                }
              },
              example: {
                currentPassword: '123456',
                newPassword: '12345678'
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
