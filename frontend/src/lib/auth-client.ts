import { createAuthClient } from "better-auth/react";
import { AUTH_URL } from "./config";

export const authClient = createAuthClient({
  baseURL: AUTH_URL,
  fetchOptions: { credentials: "include" },
});
export const { signIn, signUp, useSession, signOut } = authClient;
