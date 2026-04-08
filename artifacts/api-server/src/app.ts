import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { CLERK_PROXY_PATH, clerkProxyMiddleware } from "./middlewares/clerkProxyMiddleware";
import { logger } from "./lib/logger";

const hasDatabase = Boolean(process.env.DATABASE_URL);
const { default: router } = hasDatabase
  ? await import("./routes")
  : await import("./mock/router");
const seedDatabase = hasDatabase
  ? (await import("./routes/seed")).seedDatabase
  : null;

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

if (hasDatabase) {
  app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
}

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (hasDatabase) {
  app.use(clerkMiddleware());
}

app.use("/api", router);

if (seedDatabase) {
  seedDatabase().catch((err) => {
    logger.error({ err }, "Failed to seed database");
  });
}

export default app;
