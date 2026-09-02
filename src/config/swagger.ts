import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DataPilot AI API',
      version: '1.0.0',
      description: 'API for managing intelligent data import and transformation workflows',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      schemas: {
        ImportJob: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the import job',
            },
            status: {
              type: 'string',
              description: 'Current status of the import job',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        MappingRequest: {
          type: 'object',
          properties: {
            sampleRows: {
              type: 'array',
              items: { type: 'object', additionalProperties: true },
            },
            targetSchema: {
              type: 'object',
              additionalProperties: { type: 'string' },
            },
            userInstruction: {
              type: 'string',
              description: 'Optional additional instruction for the assistant',
            },
          },
          required: ['sampleRows', 'targetSchema'],
        },
        MappingResponse: {
          type: 'object',
          properties: {
            mappings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  targetField: { type: 'string' },
                  sourceColumn: { type: 'string', nullable: true },
                  transformation: { type: 'string', nullable: true },
                  confidence: { type: 'number', format: 'float', minimum: 0, maximum: 1 },
                },
                required: ['targetField', 'sourceColumn', 'transformation', 'confidence'],
              },
            },
          },
        },
      },
    paths: {
      '/api/v1/mappings/suggest': {
        post: {
          summary: 'Suggest mappings from CSV sample rows to a target schema',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MappingRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Mapping suggestions',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/MappingResponse' },
                },
              },
            },
          },
        },
      },
    },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/app.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerSpec, swaggerUi };
