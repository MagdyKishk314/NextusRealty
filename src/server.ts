// Local production entrypoint (`npm start` / `npm run dev`). On Vercel the app
// is served from src/app.ts's default export instead - see vercel.json.
import app from "./app.js";
import { config } from "./config.js";

app.listen(config.port, () => {
  console.log(
    `Nextus Realty running at http://localhost:${config.port}  [${config.env}]`,
  );
});
