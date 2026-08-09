import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { ensureDataDirs } from "./lib/paths.js";

const app: Express = express();

void ensureDataDirs();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const cause = err instanceof Error && "cause" in err ? err.cause : undefined;
  const pgCode = cause && typeof cause === "object" && "code" in cause ? String(cause.code) : undefined;
  logger.error({ err, pgCode }, "Unhandled API error");

  if (pgCode === "42P01") {
    res.status(503).json({
      error: "Database schema is not initialized. Run: pnpm --filter @workspace/db run push",
    });
    return;
  }

  if (pgCode === "ENOTFOUND" || pgCode === "ENETUNREACH" || pgCode === "ECONNREFUSED") {
    res.status(503).json({ error: "Database connection failed. Check DATABASE_URL and network access." });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
});

export default app;
