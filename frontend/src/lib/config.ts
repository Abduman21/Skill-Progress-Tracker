function endpoint(value: string | undefined, fallback: string): string {
  const url = new URL(value || fallback, window.location.origin);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("API and auth URLs must use HTTP(S) without credentials.");
  }
  return url.href.replace(/\/$/, "");
}

export const API_URL = endpoint(import.meta.env.VITE_API_URL, "/api/v1");
export const AUTH_URL = endpoint(import.meta.env.VITE_AUTH_URL, window.location.origin);
