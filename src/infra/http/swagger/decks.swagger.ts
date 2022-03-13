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
  '/v1/decks': {
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
  '/v1/decks/:id': {
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
    },
    get: {
      security: [{ bearerAuth: [] }],
      tags: ['Decks'],
      summary: 'Find deck info',
      parameters: [deckIdParameter],
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
  '/v1/decks/study': {
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
  }
}
