const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hospital Management System API',
      version: '1.0.0',
      description: 'API documentation for the Hospital Management System',
      contact: {
        name: 'API Support',
        email: 'support@hospitalms.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.hospitalms.com/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer &lt;token&gt;'
        }
      },
      schemas: {
        Doctor: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            doctorName: { type: 'string', example: 'Dr. John Doe' },
            email: { type: 'string', example: 'john.doe@hospital.com' },
            department: { type: 'string', example: 'Cardiology' },
            specialization: { type: 'string', example: 'Interventional Cardiology' },
            phoneNumber: { type: 'string', example: '+1234567890' },
            isActive: { type: 'boolean', default: true },
            yearsOfExperience: { type: 'number', example: 10 },
            averageRating: { type: 'number', example: 4.5 }
          }
        },
        Patient: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            patientName: { type: 'string', example: 'Jane Smith' },
            email: { type: 'string', example: 'jane.smith@example.com' },
            phone: { type: 'string', example: '+1234567890' },
            bloodGroup: { type: 'string', example: 'A+' },
            doctorId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            isActive: { type: 'boolean', default: true }
          }
        },
        AvailabilitySlot: {
          type: 'object',
          properties: {
            dayOfWeek: { type: 'number', example: 1, description: '0-6 (Sunday-Saturday)' },
            startTime: { type: 'string', example: '09:00' },
            endTime: { type: 'string', example: '17:00' },
            slotDuration: { type: 'number', example: 30, description: 'in minutes' },
            isRecurring: { type: 'boolean', default: true }
          }
        },
        LeaveRequest: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            reason: { type: 'string', example: 'Medical conference' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'], default: 'pending' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Prescription: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439014' },
            date: { type: 'string', format: 'date-time' },
            doctorName: { type: 'string', example: 'Dr. John Doe' },
            diagnosis: { type: 'string', example: 'Hypertension' },
            notes: { type: 'string', example: 'Follow up in 2 weeks' },
            medications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Lisinopril' },
                  dosage: { type: 'string', example: '10mg' },
                  frequency: { type: 'string', example: 'Once daily' },
                  duration: { type: 'string', example: '30 days' },
                  instructions: { type: 'string', example: 'Take with water in the morning' }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message describing the issue' },
            error: { type: 'string', example: 'Detailed error message for debugging' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js'
  ]
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Hospital Management System API',
  customfavIcon: '/favicon.ico'
};

module.exports = { specs, swaggerUi, swaggerOptions };
