import { z } from "zod";

const port = z.coerce.number().int().min(1).max(65535);
const origin = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && url.origin === value;
  }, "Use an HTTP(S) origin without a path or trailing slash");
const optionalText = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.string().optional(),
);

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: port.default(5000),
    MONGODB_URI: z
      .string()
      .regex(/^mongodb(?:\+srv)?:\/\//, "Use a MongoDB connection URI"),
    DB_NAME: z.string().min(1).default("skill-tracker"),
    FRONTEND_URL: origin,
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: origin,
    AUTH_COOKIE_SAME_SITE: z.enum(["lax", "none", "strict"]).default("lax"),
    TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(10).default(0),
    GEMINI_API_KEY: optionalText,
    GEMINI_MODEL: z.string().min(1).default("gemini-2.5-flash"),
    REDIS_HOST: z.string().min(1).default("localhost"),
    REDIS_PORT: port.default(6379),
    REDIS_PASSWORD: optionalText,
    REDIS_TLS: z.enum(["true", "false"]).default("false"),
    SMTP_HOST: optionalText,
    SMTP_PORT: z.preprocess((v) => (v === "" ? undefined : v), port.optional()),
    SMTP_USER: optionalText,
    SMTP_PASS: optionalText,
    EMAIL_FROM: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.string().email().optional(),
    ),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production" || env.AUTH_COOKIE_SAME_SITE === "none") {
      for (const key of ["BETTER_AUTH_URL", "FRONTEND_URL"] as const) {
        if (!env[key].startsWith("https://"))
          ctx.addIssue({
            code: "custom",
            path: [key],
            message: "HTTPS required for production or cross-site cookies",
          });
      }
    }
    if (
      env.SMTP_HOST &&
      (!env.SMTP_PORT || !env.EMAIL_FROM || !!env.SMTP_USER !== !!env.SMTP_PASS)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["SMTP_HOST"],
        message:
          "SMTP requires SMTP_PORT, EMAIL_FROM, and both SMTP_USER/SMTP_PASS or neither",
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(
      "Invalid environment configuration: " +
        result.error.issues
          .map((issue) => issue.path.join(".") + ": " + issue.message)
          .join("; "),
    );
  }
  return result.data;
}
