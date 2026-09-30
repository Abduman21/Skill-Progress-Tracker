# Skill Progress Tracker

Existing React/Vite/TypeScript frontend and NestJS/Mongoose backend for learning paths, chapters and AI-assisted study. This repository is maintained in place; it is not a replacement application.

## Implemented features

| Feature | Actual behavior |
| --- | --- |
| Authentication | Better Auth email/password signup, login, logout and seven-day database sessions. No email verification or password-reset UI. |
| Learning paths | Create/list/view in the UI; update/delete also available through the API. Progress derives from chapter completion. |
| Chapters and notes | Create, rename, delete, complete/undo completion, and append notes. |
| AI roadmaps | BullMQ queues a Gemini request, saves the path and chapters, and exposes an owner-protected polling endpoint. |
| Resources | Gemini suggests HTTPS documentation/video links. These are not live-search results; existence and quality are not verified. Discovery runs in process and can be retried. |
| Recommendations | Suggests a remaining chapter; falls back to the next incomplete chapter. A five-minute process-local cache varies with remaining chapters. |
| Assessments | Generates/caches 3–5 multiple-choice questions. Answers stay on the server until submission. Scoring and attempt-history API are implemented; no history screen. |
| Challenges | Generates a practical task, stores a written response and marks it complete. Responses are not AI-graded. |
| Dashboard | Path/chapter counts, progress, skill levels and estimated study duration (not measured time). |
| Streaks | One increment per UTC day when completing a chapter. Resets after a missed UTC day. |
| Notifications | UI success/error toasts and optional daily SMTP streak reminders at 18:00 UTC. No notification inbox or push notifications. |
| PWA | Cached application shell only. Private API data requires a network connection. |

These are implementation descriptions, not a claim that live external integrations have been verified. See [the audit report](docs/AUDIT_REPORT.md) for validation and limitations.

## Local setup (PowerShell)

Run commands from `SkillProgressTracker-main`. Use Node.js 22.14 or later and npm. MongoDB and Redis are required. Docker Desktop with Compose is the easiest way to run those two services; alternatively supply your own running instances.

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste the generated value into `BETTER_AUTH_SECRET` in `backend/.env`. Set `GEMINI_API_KEY` if you want AI features. Leaving it blank allows manual CRUD but AI generation reports unavailable. Never put that key in the frontend.

For the separate native processes below, set `VITE_API_URL=http://localhost:5000/api/v1`
and `VITE_AUTH_URL=http://localhost:5000` in `frontend/.env`. Leave them empty for
same-origin Vercel Services. The proposed multi-service deployment and its pending
background-job decisions are documented in [Vercel Services setup](docs/VERCEL_SERVICES.md).

```powershell
docker compose up -d mongodb redis
cd backend
npm install
npm run start:dev
```

In a second terminal, from `SkillProgressTracker-main`:

```powershell
cd frontend
npm install
npm run dev -- --host localhost
```

Open [the local frontend](http://localhost:5173). Use `localhost` consistently; mixing it with `127.0.0.1` changes cookie/CORS origins. MongoDB is on port 27017 and Redis on 6379.

For a full local Docker run, after creating `backend/.env`:

```powershell
docker compose up --build
```

The UI remains at port 5173 and proxies `/api/` to the backend. Compose deliberately overrides local origins and service hostnames; it is a local example, not a production deployment. Do not run the native frontend and Docker frontend on the same port.

## Environment variables

`backend/.env.example` contains only generic local values.

| Variable | Purpose |
| --- | --- |
| `NODE_ENV`, `PORT` | development/production/test; API port, default 5000 |
| `MONGODB_URI`, `DB_NAME` | Connection URI and explicit database name shared by auth and application models |
| `BETTER_AUTH_SECRET` | Required random secret of at least 32 characters |
| `BETTER_AUTH_URL` | Browser-visible auth origin, no path or trailing slash |
| `FRONTEND_URL` | Exact trusted browser origin for CORS and cookie-authenticated writes |
| `AUTH_COOKIE_SAME_SITE` | `lax` by default; `none` for genuinely cross-site HTTPS deployments |
| `TRUST_PROXY_HOPS` | 0 directly; exact proxy count when behind trusted reverse proxies |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Backend-only AI key and model identifier; confirm model access in your Google project |
| `REDIS_HOST`, `REDIS_PORT` | Required BullMQ Redis connection |
| `REDIS_PASSWORD`, `REDIS_TLS` | Optional Redis authentication; TLS is `true` or `false` |
| `SMTP_HOST`, `SMTP_PORT`, `EMAIL_FROM` | Optional reminder delivery; all three required when enabled |
| `SMTP_USER`, `SMTP_PASS` | Optional paired SMTP credentials |

Frontend variables are public **build-time** settings:

```dotenv
VITE_API_URL=https://api.example.com/api/v1
VITE_AUTH_URL=https://api.example.com
```

Copy them into `frontend/.env` before building, or configure them in the hosting build environment. When omitted, requests use same-origin `/api/v1` and auth; a reverse proxy is then required. Docker accepts these as build arguments. Changing runtime container variables does not rewrite an already-built frontend.

## Production preparation

The 29 September 2026 dependency audit still reports 24 backend advisories (9 high, 11 moderate, 4 low) after compatible updates. The frontend reports zero. Review the [audit report](docs/AUDIT_REPORT.md) and resolve the backend dependency migration and live integration checks before production rollout.

1. Run both builds and tests below. Provision MongoDB and Redis with private networking, authentication, backups and TLS as appropriate. Use Redis persistence and `maxmemory-policy noeviction` for jobs.
2. Set `NODE_ENV=production`, HTTPS `FRONTEND_URL` and `BETTER_AUTH_URL`, and a new random secret. Both auth and Mongoose reuse one database connection and the same `DB_NAME`.
3. Prefer one browser origin with a reverse proxy, or frontend/API subdomains under one site. For unrelated sites, set `AUTH_COOKIE_SAME_SITE=none`; cookies are HTTP-only and secure with HTTPS. Browsers that block third-party cookies may still block login. A same-origin proxy avoids that limitation; see [Better Auth cookie guidance](https://better-auth.com/docs/concepts/cookies).
4. Terminate HTTPS at a trusted proxy and set `TRUST_PROXY_HOPS` to the actual number of trusted hops. Prevent direct public access to the backend when trusting forwarded headers. The bundled Nginx configuration is for the local one-proxy Compose setup; adapt HTTPS forwarding for your hosting topology.
5. Build the frontend with its public URLs, serve `dist` with SPA fallback, and proxy API paths without rewriting them. Do not cache `/api/`; serve `sw.js` and `index.html` without long-lived caches.
6. Start the backend with `npm run start:prod`. `GET /api/v1/health` is a process liveness endpoint, not a complete dependency readiness check. Development API documentation is at `/api/docs` and is disabled in production.
7. Use one backend instance initially. Rate limits and recommendation caches are process-local; scheduled email jobs also run per instance. Horizontal scaling needs a shared limiter and a single scheduled-job owner.

No deployment has been performed.

## Validation commands

```powershell
cd backend
npm install
npm run build
npm run lint
npm run test:runtime
npm test -- --runInBand
npm run test:e2e -- --runInBand
cd ../frontend
npm install
npm run build
npm run lint
```

Use `npm ci` with the committed lockfiles for reproducible CI/container builds. The backend lint command formats files with ESLint/Prettier. Unit tests and HTTP contract tests use isolated dependencies and never send email or call Gemini; they are not live MongoDB/Redis end-to-end tests. See [testing instructions](docs/TESTING_GUIDE.md).

## API routes

All application routes below require a valid Better Auth session cookie. Writes also require the configured `Origin` header. AI-generating POST routes have a separate rate limit; polling does not consume that limit.

- Auth: `/api/auth/sign-up/email`, `/api/auth/sign-in/email`, `/api/auth/sign-out`, `/api/auth/get-session`
- Paths: `/api/v1/learning-paths`, `/api/v1/learning-paths/:id`
- Chapters: `/api/v1/chapters/in-path/:pathId`, `/api/v1/chapters/:id`, `:id/complete`, `:id/incomplete`, `:id/notes`
- AI: `/api/v1/ai/generate-roadmap`, `/api/v1/ai/job-status/:jobId`, `/api/v1/ai/recommend`, `/api/v1/ai/discover-resources/:chapterId`, `/api/v1/ai/refresh-resources/:chapterId`
- Quizzes: `/api/v1/assessments/generate`, `/api/v1/assessments/submit`, `/api/v1/assessments/history/:chapterId`
- Challenges: `/api/v1/challenges/generate`, `/api/v1/challenges/chapter/:chapterId`, `/api/v1/challenges/history/:chapterId`, `/api/v1/challenges/:id/respond`
- Dashboard: `/api/v1/dashboard/stats`

## Known boundaries

Resource discovery is in-process: a server restart can interrupt it; use Retry in chapter resources. Roadmap jobs remain in Redis for up to a day and are retained in bounded counts. Handled save failures clean up the partially created path and automatic retries are disabled; abrupt process termination during a multi-document save may still require manual cleanup. Cascading deletions are sequential rather than a database transaction, so concurrent edits/deletes require operational care.

Email delivery, real Gemini responses, production cookie behavior and database connectivity must be smoke-tested in the intended environment. Existing data with already-orphaned chapters or historical incorrect streaks is not automatically migrated. Back up data before any cleanup or production rollout.
