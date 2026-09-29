// Load emitted ESM with synthetic configuration; do not start Nest or connect to services.
Object.assign(process.env, {
  NODE_ENV: "test",
  PORT: "5000",
  MONGODB_URI: "mongodb://127.0.0.1:27017",
  DB_NAME: "runtime-smoke",
  BETTER_AUTH_SECRET: "runtime-smoke-only-not-a-production-secret",
  BETTER_AUTH_URL: "http://localhost:5000",
  FRONTEND_URL: "http://localhost:5173",
  AUTH_COOKIE_SAME_SITE: "lax",
  TRUST_PROXY_HOPS: "0",
  REDIS_HOST: "127.0.0.1",
  REDIS_PORT: "6379",
  REDIS_PASSWORD: "",
  REDIS_TLS: "false",
  GEMINI_API_KEY: "",
  GEMINI_MODEL: "unused-in-smoke-test",
  SMTP_HOST: "",
  SMTP_PORT: "",
  SMTP_USER: "",
  SMTP_PASS: "",
  EMAIL_FROM: "",
});

await import("../dist/auth/auth.service.js");
await import("../dist/app.module.js");
await new Promise((resolve) => setImmediate(resolve));
console.log("Compiled backend modules load successfully");
