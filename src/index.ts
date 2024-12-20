import { configDotenv } from "dotenv";
configDotenv();

import App from "./app";
import { AppDataSource } from "./dataSource";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    App.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database", error);
  });
