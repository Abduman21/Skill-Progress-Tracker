import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { json, urlencoded } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";
import { AppModule } from "./app.module.js";
import { auth } from "./auth/auth.service.js";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter.js";
import { loggerConfig } from "./config/logger.config.js";
import type { Env } from "./config/env.validation.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig,
    bodyParser: false,
  });
  const config = app.get(ConfigService<Env, true>);
  const server = app.getHttpAdapter().getInstance();
  server.set("trust proxy", config.get("TRUST_PROXY_HOPS"));
  app.enableShutdownHooks();
  app.enableCors({ origin: config.get("FRONTEND_URL"), credentials: true });
  app.use(helmet());
  app.use("/api", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 1000,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        message: "Too many requests. Please try again later.",
        statusCode: 429,
      },
    }),
  );
  app.use(
    [
      "/api/v1/ai",
      "/api/v1/assessments/generate",
      "/api/v1/challenges/generate",
    ],
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 20,
      skip: (req) => req.method !== "POST",
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        message:
          "AI request limit reached. Please wait 15 minutes before trying again.",
        statusCode: 429,
      },
    }),
  );
  // Better Auth receives the original stream before Express parses request bodies.
  server.all("/api/auth/*", toNodeHandler(auth));
  app.use(json({ limit: "64kb" }));
  app.use(urlencoded({ extended: false, limit: "64kb" }));
  app.use("/api/v1", (req, res, next) => {
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      req.headers.origin !== config.get("FRONTEND_URL")
    ) {
      return res
        .status(403)
        .json({ message: "Untrusted request origin", statusCode: 403 });
    }
    next();
  });
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix("api/v1");
  if (config.get("NODE_ENV") !== "production") {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("Skill Progress Tracker API")
        .setVersion("1.0")
        .addCookieAuth("better-auth.session_token")
        .build(),
    );
    SwaggerModule.setup("api/docs", app, document);
  }
  await app.listen(config.get("PORT"), "0.0.0.0");
}

bootstrap().catch(() => {
  console.error(
    "Backend startup failed. Check environment validation, MongoDB connectivity and Redis availability.",
  );
  process.exitCode = 1;
});
