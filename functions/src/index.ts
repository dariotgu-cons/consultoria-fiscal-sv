import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

export const ping = onRequest((request, response) => {
  logger.info("ping invocado", { structuredData: true });
  response.json({ status: "ok", service: "consultoria-fiscal-sv" });
});