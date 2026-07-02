import { createApp } from "./app.js";
import { config } from "./config.js";
// Importing the database module initializes the connection + schema on boot.
import "./db/database.js";

const app = createApp();

app.listen(config.port, () => {
  console.log(
    `Nextus Realty running at http://localhost:${config.port}  [${config.env}]`,
  );
});
