const swaggerJsdoc = require('swagger-jsdoc');

const swaggerJsdocOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'BJJ Class Technique Backend',
        version: '1.0.0',
      }
    },
    apis: ['./model/*.js', './routes/api/*.js', './routes/*.js', './config/securityDefinitions.js']
  };

  module.exports = swaggerJsdoc(swaggerJsdocOptions);