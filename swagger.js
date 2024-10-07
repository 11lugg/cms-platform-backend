// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CMS Platform API',
      version: '1.0.0',
      description: 'API documentation for the CMS Platform',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      // securitySchemes: {
      //   bearerAuth: {
      //     type: 'http',
      //     scheme: 'bearer',
      //     bearerFormat: 'JWT',
      //   },
      // },
      schemas: {
        // User models
        UserRegister: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'johndoe@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'SecurePassword123',
            },
          },
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'johndoe@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'SecurePassword123',
            },
          },
        },
        AuthToken: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'your_jwt_token',
            },
          },
        },
        AuthError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string',
                    example: 'Invalid email or password',
                  },
                },
              },
            },
          },
        },
        // Content models
        ContentCreate: {
          type: 'object',
          required: ['title', 'body', 'status'],
          properties: {
            title: {
              type: 'string',
              example: 'My First Blog Post',
            },
            slug: {
              type: 'string',
              example: 'my-first-blog-post',
            },
            body: {
              type: 'string',
              example: 'This is the content of my first blog post.',
            },
            status: {
              type: 'string',
              enum: ['draft', 'published'],
              example: 'published',
            },
            templateId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          },
        },
        Content: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            body: {
              type: 'string',
            },
            status: {
              type: 'string',
            },
            authorId: {
              type: 'string',
              format: 'uuid',
            },
            templateId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ContentWithRelations: {
          allOf: [
            { $ref: '#/components/schemas/Content' },
            {
              type: 'object',
              properties: {
                author: {
                  $ref: '#/components/schemas/UserPublic',
                },
                template: {
                  $ref: '#/components/schemas/Template',
                },
              },
            },
          ],
        },
        // Template models
        TemplateCreate: {
          type: 'object',
          required: ['name', 'components'],
          properties: {
            name: {
              type: 'string',
              example: 'Blog Post Template',
            },
            description: {
              type: 'string',
              example: 'Template for blog posts',
            },
            components: {
              type: 'object',
              example: {
                header: true,
                footer: true,
              },
            },
          },
        },
        Template: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            components: {
              type: 'object',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // User models
        UserPublic: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            username: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
          },
        },
        // Validation Error
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  value: {
                    type: 'string',
                  },
                  msg: {
                    type: 'string',
                  },
                  param: {
                    type: 'string',
                  },
                  location: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
