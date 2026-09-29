# Skill Progress Tracker audit

Reviewed 29 September 2026. This audit preserves the existing React/NestJS application. No deployment was performed. Passing builds and isolated tests do not certify production readiness; the dependency and integration limitations below must be resolved before rollout.

## Bugs found and changes made

| Area | Finding and correction |
| --- | --- |
| Frontend configuration | Replaced hardcoded API/auth origins with public build-time `VITE_API_URL` and `VITE_AUTH_URL`; added a generic example and same-origin fallback. |
| Authentication | Shared Mongoose's MongoDB connection with Better Auth; configured trusted origins, credentialed CORS, HTTP-only cookies and explicit SameSite behavior. Production and cross-site cookie configurations require HTTPS. |
| Configuration | Validated ports, origins, secrets and optional SMTP settings. Removed infrastructure-specific examples and ignored local environment files. |
| Authorization | Protected roadmap job polling by owner and checked chapter ownership before assessment access/submission. Internal queue errors are hidden from clients. |
| Quizzes | Removed correct answers/explanations from generated quiz responses until submission; validated submitted answer arrays. |
| Data consistency | Path/chapter deletion now removes dependent records; chapter changes update progress. Streak updates use MongoDB ObjectIds and UTC dates, with a conditional update to avoid duplicate same-day increments. |
| AI | Validates generated JSON and resource URLs, handles malformed/fenced responses, bounds requests, sanitizes provider errors and removes VPN advice. Failed roadmap saves trigger partial-path cleanup. |
| Redis | Retained required BullMQ jobs, configured Redis authentication/TLS and bounded job retention; replaced an incompatible recommendation cache adapter with process-local caching. |
| Frontend behavior | Added error/retry states, resource polling, cache cleanup on logout, form constraints, keyboard controls and modal focus handling. Existing visual design is retained. |
| PWA/build | Caches only the application shell; private API responses receive no-store. Fixed service-worker generation for the apostrophe in the Windows project path. |
| Cleanup | Removed obsolete empty scaffolding and starter assets; corrected `.gitignore` so npm caches and TypeScript build state are ignored. Excluded compiled output from HTTP-test mock discovery. |
| Dependencies | Updated compatible dependencies and lockfiles, including Better Auth, Mongoose, Axios, React Router and Vite. Remaining backend advisories are listed below. |
| Runtime compatibility | Adapted auth initialization to Better Auth 1.7's field definitions/types. Changed Mongoose Connection imports to type-only imports, fixing a compiled ESM startup failure. Added a runtime module-loading smoke command. Excluded local npm caches from Docker build contexts. |

## Validation and evidence

Tests isolate dependencies and do not contact Gemini or send email. The HTTP suite exercises application contracts with mocked authentication/services, rather than a real database session. The compiled-module check uses synthetic environment settings and does not start the server or connect to services.

| Check | Final result |
| --- | --- |
| Backend `npm run build` | Passed on Node 22.14.0 |
| Backend `npm run lint` | Passed |
| Backend `npm run test:runtime` | Passed; compiled auth and application modules load under Node ESM |
| Backend `npm test -- --runInBand` | 20 tests passed across 5 suites |
| Backend `npm run test:e2e -- --runInBand` | 5 tests passed across 2 isolated HTTP/notification suites |
| Frontend `npm run build` | Passed, including service-worker generation with Vite 7.3.6 |
| Frontend `npm run lint` | Passed |
| Dependency installation/update | Compatible updates installed successfully in both packages; backend audit exits nonzero for the remaining advisories below |
| Repository checks | Manifest dependency ranges match lockfiles, documentation file links resolve, generated caches are ignored and `git diff --check` passed |

The roadmap tests intentionally provoke and log invalid-output/save errors; these are passing failure-path tests. Missing SMTP in the isolated test environment is intentional.

The previous audit run rendered the home, login and registration pages in a browser, checked the mobile registration layout and required-field validation. That check predates this run's dependency updates; authenticated user flows still require the integration checklist in [TESTING_GUIDE.md](TESTING_GUIDE.md).

## Features and incomplete work

Code inspection confirms implementations for authentication, paths, chapters, notes, completion/progress, dashboard summaries, UTC streaks, queued roadmaps, resource suggestions, recommendations, quizzes, written challenges, toasts and optional SMTP reminders. See the [README feature table](../README.md#implemented-features) for their precise scope.

There is no email verification/password-reset UI, quiz-history screen, notification inbox, measured study timer, offline private-data mode or AI grading of challenge responses. Resource suggestions are generated links, not verified live search results. These are boundaries of the current application, not features claimed to be complete.

## Security and deployment limitations

- The frontend dependency update reports zero npm advisories (previously 28). The backend decreased from 47 advisories, including two critical, to 24: 9 high, 11 moderate and 4 low; zero critical remain. A second compatible-fix pass made no further changes. Advisories include NestJS core/platform/tooling, Nodemailer, Multer, lodash, js-yaml, file-type, qs and development tooling dependencies. npm proposes major NestJS/Nodemailer upgrades for part of the remaining tree. A reviewed migration and subsequent integration testing are required before treating the backend as production-ready. Do not run `npm audit fix --force` without reviewing its framework/API changes. Counts include development dependencies and are a registry snapshot, not an exploitability assessment.
- Live MongoDB, Redis, Gemini, SMTP and HTTPS cookie behavior have not been verified in this environment. Docker is not available on PATH, so Compose/container execution was not tested.
- Cross-site authentication depends on browser third-party-cookie policy. Prefer one browser origin through a reverse proxy; unrelated HTTPS domains need `AUTH_COOKIE_SAME_SITE=none` and browser testing.
- Resource discovery runs in process and can be interrupted by restart. Cascading deletes and roadmap saves span multiple documents without a transaction. Abrupt termination/concurrent writes can still require cleanup; historical orphan records are not migrated.
- Rate limiting and recommendation caches are process-local. Scheduled reminders run per backend instance. Use one instance until shared limits and single-owner scheduling are implemented.
- The health route is process liveness only. Production operations still need dependency readiness monitoring, backups, HTTPS termination, Redis persistence/private networking and environment-specific smoke tests.

## Environment and local run commands

Required backend settings: `MONGODB_URI`, `DB_NAME`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_URL`, `REDIS_HOST`, `REDIS_PORT`. Defaults and optional `PORT`, `NODE_ENV`, `AUTH_COOKIE_SAME_SITE`, `TRUST_PROXY_HOPS`, `REDIS_PASSWORD`, `REDIS_TLS`, `GEMINI_API_KEY`, `GEMINI_MODEL` and SMTP settings are described in the [README](../README.md#environment-variables). AI needs a backend-only Gemini key; reminders need SMTP configuration. Frontend variables are public and embedded at build time.

From `SkillProgressTracker-main`, in PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste the generated value into `BETTER_AUTH_SECRET` in `backend/.env`. Preserve existing `.env` files if already configured. With Docker Desktop/Compose installed:

```powershell
docker compose up -d mongodb redis
cd backend
npm ci
npm run start:dev
```

In a second PowerShell terminal, from `SkillProgressTracker-main`:

```powershell
cd frontend
npm ci
npm run dev -- --host localhost
```

Open http://localhost:5173. Alternatively provide your own MongoDB/Redis instances and update the backend environment. Full local container setup is `docker compose up --build` after configuring `backend/.env`. This is a development configuration; production preparation is documented in the [README](../README.md#production-preparation).

## Files changed

The work spans frontend configuration, auth/client hooks, pages, chapter/assessment/dashboard components, service-worker/build/container files; backend auth/config/bootstrap, AI, assessment, challenge, chapter, path, dashboard, notification and streak modules and tests; both package manifests/lockfiles; Compose, `.gitignore` and documentation. The complete file list is in [CHANGED_FILES.md](CHANGED_FILES.md).
