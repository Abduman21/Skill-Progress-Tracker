# Vercel Services configuration

Import the repository with the project Root Directory set to the repository
root, not `frontend`. The root `vercel.json` owns both service builds and routing.
The previous frontend-only Vercel configuration has been consolidated into it.

## Routing and calls

- `backend`: NestJS, public at `/api` and `/api/*`. The original path is
  preserved: Better Auth handles `/api/auth/*`; application controllers handle
  `/api/v1/*`. Unknown API routes remain backend 404s.
- `frontend`: static Vite application, public on all remaining paths. Its
  service-local SPA rewrite serves `index.html` for client-side navigation.
- No service bindings: the frontend has no server functions. Requests originate
  in the browser, using the public same-origin API. The backend does not call
  the frontend. MongoDB, Redis, Gemini and SMTP are external dependencies, not
  HTTP services declared in this project.
- Docker hostnames in `docker-compose.yml` and `frontend/nginx.conf` belong to
  the separate local Docker setup; Vercel does not run that Compose network.

## Environment

Leave `VITE_API_URL` and `VITE_AUTH_URL` unset/empty for this deployment. Remove
previous localhost or separately hosted backend overrides before building.
Do not expose a runtime service binding as a `VITE_*` build variable.

Set backend variables in Vercel, not in committed files:

- `NODE_ENV=production`
- `MONGODB_URI`, `DB_NAME`: a reachable MongoDB database
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS`: a reachable Redis
  instance supporting BullMQ; Docker service names are not valid here
- `BETTER_AUTH_SECRET`: a new random secret of at least 32 characters
- `FRONTEND_URL` and `BETTER_AUTH_URL`: the same exact public HTTPS origin,
  without a trailing slash or path
- `AUTH_COOKIE_SAME_SITE=lax`
- `GEMINI_API_KEY` and `GEMINI_MODEL` for AI functionality
- Optional SMTP variables from `backend/.env.example`

Configure `TRUST_PROXY_HOPS` against the actual trusted proxy topology; do not
copy the Docker proxy count blindly. Preview origins need environment-specific
auth/CORS configuration and isolated data. Do not loosen the origin check to
accept arbitrary preview hosts. Vercel logging uses console output only.

## Background execution decision still required

This is an HTTP routing/build configuration, not a completed migration of the
background execution model. The current backend starts a BullMQ roadmap worker,
Nest scheduled streak/reminder jobs, and in-process resource discovery. A
request-driven NestJS Function cannot be assumed to keep these jobs running
reliably after responses or while there is no traffic.

Before production deployment, choose either a migration to durable Vercel
queue/workflow and cron execution, or a separately hosted worker/scheduler with
worker registration disabled in the HTTP function. The latter also needs a
decision for in-process resource discovery. Do not deploy this draft claiming
all background features are operational. MongoDB and Redis are not provisioned
by `vercel.json`.

## Validation

Run both application builds, backend runtime smoke tests and frontend lint.
Run `npx vercel@latest dev --local --listen 3000` from the repository root with
local MongoDB/Redis and development auth origins set to `http://localhost:3000`.
Ensure local frontend `.env` overrides are empty for this same-origin test.

Verify `/`, `/login`, and direct `/path/<id>` navigation serve the frontend;
`/api/v1/health` serves backend JSON; unknown API routes do not serve HTML.
Then verify sign-in, path/chapter CRUD, logout and the selected background-job
architecture. Successful TypeScript builds alone do not validate these flows.

References:
- https://vercel.com/docs/services
- https://vercel.com/docs/services/routing
- https://vercel.com/docs/services/bindings
- https://vercel.com/docs/frameworks/backend/nestjs

