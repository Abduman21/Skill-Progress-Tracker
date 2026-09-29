import { validate } from "./env.validation";
const local = {
  MONGODB_URI: "mongodb://127.0.0.1:27017",
  FRONTEND_URL: "http://localhost:5173",
  BETTER_AUTH_URL: "http://localhost:5000",
  BETTER_AUTH_SECRET: "test-only-secret-with-at-least-32-characters",
};
describe("environment validation", () => {
  it("supports local CRUD without Gemini or SMTP", () => {
    expect(validate(local)).toMatchObject({
      DB_NAME: "skill-tracker",
      REDIS_PORT: 6379,
      AUTH_COOKIE_SAME_SITE: "lax",
    });
  });
  it("rejects insecure production and SameSite=None deployments", () => {
    expect(() => validate({ ...local, NODE_ENV: "production" })).toThrow(
      "HTTPS",
    );
    expect(() => validate({ ...local, AUTH_COOKIE_SAME_SITE: "none" })).toThrow(
      "HTTPS",
    );
  });
  it("accepts HTTPS cross-site cookies and a numeric Redis port", () => {
    expect(
      validate({
        ...local,
        NODE_ENV: "production",
        AUTH_COOKIE_SAME_SITE: "none",
        FRONTEND_URL: "https://app.example.com",
        BETTER_AUTH_URL: "https://api.example.net",
        REDIS_PORT: "6380",
      }).REDIS_PORT,
    ).toBe(6380);
  });
  it("does not disclose a supplied secret in validation errors", () => {
    expect(() => validate({ ...local, BETTER_AUTH_SECRET: "private" })).toThrow(
      "BETTER_AUTH_SECRET",
    );
    try {
      validate({ ...local, BETTER_AUTH_SECRET: "private" });
    } catch (error) {
      expect(String(error)).not.toContain("private");
    }
  });
  it("rejects invalid ports, URL paths and incomplete SMTP settings", () => {
    expect(() => validate({ ...local, REDIS_PORT: "bad" })).toThrow();
    expect(() =>
      validate({ ...local, FRONTEND_URL: "https://example.com/path" }),
    ).toThrow();
    expect(() =>
      validate({ ...local, SMTP_HOST: "smtp.example.com" }),
    ).toThrow();
  });
});
