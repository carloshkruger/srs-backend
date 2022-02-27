const cardIdParameter = {
  in: 'path',
  name: 'id',
  schema: {
    type: 'string'
  },
  required: true,
  example: '123'
}

export default {
  '/cards': {
    post: {
      security: [{ bearerAuth: [] }],
      tags: ['Cards'],
      summary: 'Create card',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                deckId: {
                  type: 'string'
                },
                originalText: {
                  type: 'string'
                },
                translatedText: {
                  type: 'string'
                }
              },
              example: {
                deckId: '1234',
                originalText: 'Original text',
                translatedText: 'Translated text'
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
                  },
                  deckId: {
                    type: 'string'
                  },
                  originalText: {
                    type: 'string'
                  },
                  translatedText: {
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
  '/cards/:id': {
    put: {
      security: [{ bearerAuth: [] }],
      tags: ['Cards'],
      summary: 'Update card',
      parameters: [cardIdParameter],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                deckId: {
                  type: 'string'
                },
                originalText: {
                  type: 'string'
                },
                translatedText: {
                  type: 'string'
                }
              },
              example: {
                deckId: '1234',
                originalText: 'Original text',
                translatedText: 'Translated text'
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
      tags: ['Cards'],
      summary: 'Delete card',
      parameters: [cardIdParameter],
      responses: {
        204: {
          description: 'Success'
        }
      }
    }
  },
  '/cards/:id/review': {
    post: {
      security: [{ bearerAuth: [] }],
      tags: ['Cards'],
      summary: 'Create card review',
      parameters: [cardIdParameter],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                difficultyLevel: {
                  type: 'number'
                }
              },
              example: {
                difficultyLevel: 1
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
  '/cards/study': {
    get: {
      security: [{ bearerAuth: [] }],
      tags: ['Cards'],
      summary: 'List all cards available for study',
      parameters: [
        {
          in: 'query',
          name: 'deckId',
          schema: {
            type: 'string'
          },
          required: false,
          example: '123'
        }
      ],
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  cards: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string'
                        },
                        deckId: {
                          type: 'string'
                        },
                        originalText: {
                          type: 'string'
                        },
                        translatedText: {
                          type: 'string'
                        },
                        audioFileName: {
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
    }
  }
}
