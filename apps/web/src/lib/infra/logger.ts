import "server-only";
import { createLogger } from "@breeze/logger";

export const logger = createLogger({ service: "web" });
