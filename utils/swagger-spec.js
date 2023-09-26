import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'Sakila API Documentation',
      version: '1.0.0',
      description: 'API documentation for Sakila project',
    },
  },
  // Path to the API files with JSDoc comments
  apis: ['app.js','./routes/actor.route.js'], // Replace 'app.js' with your main Node.js file or other relevant files
};

export default swaggerJSDoc(options);