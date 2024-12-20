import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stock Price Checker API",
      version: "1.0.0",
      description: "API documentation for the Stock Price Checker application",
    },
    servers: [
      {
        url: "http://localhost:3030",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
