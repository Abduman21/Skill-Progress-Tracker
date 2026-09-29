# Validation

From the backend run `npm run build`, `npm run lint`, `npm run test:runtime`, `npm test -- --runInBand` and `npm run test:e2e -- --runInBand`. From the frontend run `npm run build` and `npm run lint`. The runtime smoke check loads emitted ESM using synthetic configuration without starting Nest or connecting to services; it catches CommonJS/ESM import failures that mocked Jest tests miss.

The automated suites cover environment validation, UTC streak updates/resets, roadmap job ownership, quiz answer privacy/ownership, HTTP answer validation and escaping names in reminder HTML. Dependencies are isolated. The historic streak "e2e" suite required an unregistered User model and was replaced by focused regression tests; the HTTP suite does not claim real database/auth coverage. Notification tests mock delivery and never send mail.

## Manual integration smoke test

The roadmap processor regression suite additionally checks invalid JSON, empty chapter arrays, fenced JSON and cleanup after chapter persistence fails.

Use a disposable local database, Redis instance and test account. Configure values from the root README.

1. Register, log out, log back in, refresh and confirm session persistence.
2. Create a path and two chapters. Complete one and verify 50% progress and a one-day streak; complete the second on the same UTC day and verify the streak stays at one. Undo completion and verify progress.
3. Append a note, rename a chapter, and delete it. Verify dashboard counts and progress update.
4. Generate a roadmap with a configured Gemini key. Observe the waiting/active/completed flow and resource completion. Retry a failed resource request.
5. Generate a quiz; inspect its response and confirm no answers/explanations are sent before submission. Submit all answers and inspect scored feedback. Generate and respond to a challenge.
6. With two distinct users, try another user's path, chapter, quiz submission and roadmap job. Access must fail. Clear/sign out, change accounts, and verify the previous user's cached UI data never appears.
7. Disable the API temporarily: verify error states and retry controls. Verify protected routes redirect when the session expires.
8. Use a mobile viewport and keyboard navigation, including modal Escape/Tab behavior.
9. In an HTTPS staging environment, inspect HTTP-only secure cookies, the exact CORS origin, and both same-site and cross-site configurations. Test a browser with third-party cookies blocked; use a same-origin proxy when needed.
10. Test reminder rendering with mocks. To test real delivery, explicitly configure your own test mailbox and SMTP server; automated tests do not send messages.

Docker and live MongoDB/Redis/Gemini/SMTP tests require services and credentials. A passing build or isolated test suite does not substitute for these integration checks.
