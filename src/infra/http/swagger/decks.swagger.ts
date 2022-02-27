const deckIdParameter = {
  in: 'path',
  name: 'id',
  schema: {
    type: 'string'
  },
  required: true,
  example: '123'
}

export default {
  '/decks': {
    post: {
      security: [{ bearerAuth: [] }],
      tags: ['Decks'],
      summary: 'Create deck',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                }
              },
              example: {
                name: 'Deck name',
                description: 'Deck description'
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
                  name: {
                    type: 'string'
                  },
                  description: {
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
  '/decks/:id': {
    put: {
      security: [{ bearerAuth: [] }],
      tags: ['Decks'],
      summary: 'Update deck',
      parameters: [deckIdParameter],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                }
              },
              example: {
                name: 'Deck name',
                description: 'Deck description'
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
      tags: ['Decks'],
      summary: 'Delete deck',
      parameters: [deckIdParameter],
      responses: {
        204: {
          description: 'Success'
        }
      }
    }
  },
  '/decks/study': {
    get: {
      security: [{ bearerAuth: [] }],
      tags: ['Decks'],
      summary: 'List decks for study',
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  deck: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string'
                      },
                      name: {
                        type: 'string'
                      },
                      description: {
                        type: 'string'
                      }
                    }
                  },
                  cards: {
                    type: 'object',
                    properties: {
                      totalQuantity: {
                        type: 'number'
                      },
                      availableForStudyQuantity: {
                        type: 'number'
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
  },
  '/decks/:id/cards': {
    get: {
      security: [{ bearerAuth: [] }],
      tags: ['Decks'],
      summary: 'List all deck cards',
      parameters: [deckIdParameter],
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
