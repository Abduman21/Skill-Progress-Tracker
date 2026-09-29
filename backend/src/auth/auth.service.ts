import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import type { Connection } from "mongoose";
import type { Env } from "../config/env.validation.js";

// Initialized by Nest's connection factory; all services share this client.
export let mongoClient: ReturnType<Connection["getClient"]>;
export let auth: ReturnType<typeof createAuth>;

export function initializeAuth(connection: Connection, env: Env) {
  mongoClient = connection.getClient();
  auth = createAuth(connection, env);
  return connection;
}

function createAuth(connection: Connection, env: Env) {
  return betterAuth({
    database: mongodbAdapter(connection.db),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.FRONTEND_URL],
    emailAndPassword: { enabled: true, requireEmailVerification: false },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    advanced: {
      useSecureCookies: env.BETTER_AUTH_URL.startsWith("https://"),
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: env.AUTH_COOKIE_SAME_SITE,
      },
    },
    user: {
      additionalFields: {
        learningStreak: {
          type: "number",
          defaultValue: 0,
          input: false,
        },
        lastActiveDate: {
          type: "string",
          defaultValue: "",
          input: false,
        },
      },
    },
  });
}
