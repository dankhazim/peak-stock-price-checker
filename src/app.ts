import express, { Application } from "express";
import { StockController } from "./controllers";
import { errorHandler } from "./middlewares/ErrorHandler";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

class App {
  public express: Application;

  constructor() {
    this.express = express();

    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));

    this.initControllers();

    // Initialize Swagger
    this.express.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, { explorer: true })
    );

    this.express.get("/api-docs.json", function (req, res) {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });

    // Initialize error handler
    this.express.use(errorHandler);
  }

  initControllers() {
    this.express.use("/stock", StockController);
  }
}

export default new App().express;
