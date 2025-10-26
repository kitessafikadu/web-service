import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Management API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing students, teachers, courses, and enrollments',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Student: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'dob'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the student'
            },
            firstName: {
              type: 'string',
              description: 'Student\'s first name'
            },
            lastName: {
              type: 'string',
              description: 'Student\'s last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Student\'s email address'
            },
            dob: {
              type: 'string',
              format: 'date',
              description: 'Student\'s date of birth'
            },
            enrollments: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Enrollment'
              },
              description: 'Student\'s course enrollments'
            }
          }
        },
        Teacher: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'department'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the teacher'
            },
            firstName: {
              type: 'string',
              description: 'Teacher\'s first name'
            },
            lastName: {
              type: 'string',
              description: 'Teacher\'s last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Teacher\'s email address'
            },
            department: {
              type: 'string',
              description: 'Teacher\'s department'
            }
          }
        },
        Course: {
          type: 'object',
          required: ['name', 'code', 'credits'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the course'
            },
            name: {
              type: 'string',
              description: 'Course name'
            },
            code: {
              type: 'string',
              description: 'Course code'
            },
            credits: {
              type: 'integer',
              description: 'Number of credits for the course'
            }
          }
        },
        Enrollment: {
          type: 'object',
          required: ['studentId', 'courseId'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the enrollment'
            },
            studentId: {
              type: 'integer',
              description: 'ID of the enrolled student'
            },
            courseId: {
              type: 'integer',
              description: 'ID of the enrolled course'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Student Management API Documentation'
  }));
};

export default specs;
