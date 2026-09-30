<div align="center">

# 🚀 Skill Progress Tracker

### Learn with direction. Track every step.

A modern full-stack learning and skill-development platform for creating structured learning paths, tracking chapter progress, building study streaks, and using AI-assisted roadmaps, recommendations, assessments, resources, and practical challenges.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20App-4f46e5?style=for-the-badge&logo=vercel&logoColor=white)](https://skill-progress-tracker-blond.vercel.app/)
[![React](https://img.shields.io/badge/React-19-20232a?style=for-the-badge&logo=react&logoColor=61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Backend-e0234e?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**[Live Demo](https://skill-progress-tracker-blond.vercel.app/)** · **[Repository](https://github.com/Abduman21/Skill-Progress-Tracker)**

</div>

---

## ✨ Overview

Skill Progress Tracker helps learners turn broad goals into structured, trackable learning journeys. Users can create learning paths manually or generate them with AI, work through chapters, keep notes, complete assessments and practical challenges, discover suggested resources, and monitor progress from a focused dashboard.

The application uses a **React + TypeScript + Vite** frontend and a **NestJS + MongoDB** backend, with **Better Auth** for sessions, **Redis/BullMQ** for queued AI roadmap generation, and **Gemini** for supported AI-assisted study features.

> The hosted frontend is available through the live demo above. Some backend-dependent or external integrations require the corresponding production services and environment configuration to be available.

---

## 📸 Application Preview

### Dashboard / Learning Overview

![Skill Progress Tracker Preview 1](Screenshot%202026-09-30%20201926.png)

### Learning Experience

![Skill Progress Tracker Preview 2](Screenshot%202026-09-30%20201936.png)

### Progress & Study Tools

![Skill Progress Tracker Preview 3](Screenshot%202026-09-30%20201957.png)

---

## 🌟 Core Features

| Feature | What it does |
| --- | --- |
| 🔐 **Authentication** | Better Auth email/password signup, login, logout, and database-backed sessions |
| 🗺️ **Learning Paths** | Create, view, update, and organize structured learning journeys |
| 📚 **Chapters** | Track completion, rename/delete chapters, and attach notes |
| ✨ **AI Roadmaps** | Generate learning paths through Gemini-backed queued jobs using BullMQ |
| 🔎 **Resource Discovery** | Suggest documentation and video resources for chapters |
| 💡 **Recommendations** | Suggest a remaining chapter based on current learning progress |
| 🧠 **Assessments** | Generate and submit multiple-choice quizzes with scoring |
| 🛠️ **Challenges** | Generate practical tasks and store learner responses |
| 📊 **Dashboard** | View learning-path counts, chapter progress, skill levels, and estimated study duration |
| 🔥 **Streaks** | Track daily chapter-completion streaks |
| 🔔 **Notifications** | In-app success/error feedback plus optional SMTP streak reminders |
| 📱 **PWA** | Cache the application shell for a smoother installable app experience |

---

## 🧰 Tech Stack

### Frontend

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS 4**
- **React Router**
- **TanStack Query**
- **Zustand**
- **Axios**
- **Lucide React**
- **Better Auth client**
- **Vite PWA / Workbox**

### Backend

- **NestJS**
- **Node.js**
- **TypeScript**
- **MongoDB + Mongoose**
- **Better Auth**
- **Redis + BullMQ**
- **Gemini AI integration**
- **SMTP email reminders**

### Infrastructure / Tooling

- **Docker & Docker Compose**
- **Nginx**
- **Vercel frontend deployment**
- **ESLint / Prettier**
- **Automated tests**

---

## 🏗️ Architecture

```text
Skill-Progress-Tracker/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── stores/
│   │   └── ...
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── learning-paths/
│   │   ├── chapters/
│   │   ├── ai/
│   │   ├── assessments/
│   │   ├── challenges/
│   │   └── ...
│   ├── Dockerfile
│   └── package.json
│
├── docs/
│   ├── AUDIT_REPORT.md
│   ├── TESTING_GUIDE.md
│   └── VERCEL_SERVICES.md
│
├── docker-compose.yml
├── vercel.json
└── README.md
```

---

## 🔄 How the AI Roadmap Flow Works

```text
User submits learning goal
        ↓
Frontend sends request
        ↓
NestJS API validates request
        ↓
BullMQ queues roadmap job
        ↓
Gemini generates roadmap
        ↓
Backend saves learning path + chapters
        ↓
Frontend polls job status
        ↓
Generated learning path becomes available
```

This keeps long-running AI generation work separate from the initial HTTP request and gives the UI a clear queued/processing/success flow.

---

## 💻 Local Development

### Prerequisites

- **Node.js 22.14+**
- **npm**
- **MongoDB**
- **Redis**
- Docker Desktop is recommended for MongoDB and Redis

### 1. Clone the repository

```bash
git clone https://github.com/Abduman21/Skill-Progress-Tracker.git
cd Skill-Progress-Tracker
```

### 2. Create environment files

PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the generated value for `BETTER_AUTH_SECRET` in `backend/.env`.

Set `GEMINI_API_KEY` if you want to use AI features. Keep it on the backend only.

For separate native frontend/backend processes, use:

```dotenv
VITE_API_URL=http://localhost:5000/api/v1
VITE_AUTH_URL=http://localhost:5000
```

### 3. Start MongoDB and Redis

```powershell
docker compose up -d mongodb redis
```

### 4. Start the backend

```powershell
cd backend
npm install
npm run start:dev
```

Backend:

```text
http://localhost:5000
```

### 5. Start the frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev -- --host localhost
```

Frontend:

```text
http://localhost:5173
```

> Use `localhost` consistently when running frontend and backend locally so cookie and CORS origins remain aligned.

---

## 🐳 Docker

Run the complete local stack with:

```bash
docker compose up --build
```

The bundled Compose configuration provides the local application stack and supporting services. Review environment values before using the project outside local development.

---

## 🔐 Environment Variables

### Backend

| Variable | Purpose |
| --- | --- |
| `NODE_ENV`, `PORT` | Runtime environment and backend port |
| `MONGODB_URI`, `DB_NAME` | MongoDB connection and database name |
| `BETTER_AUTH_SECRET` | Secure Better Auth secret |
| `BETTER_AUTH_URL` | Browser-visible authentication origin |
| `FRONTEND_URL` | Trusted frontend origin for CORS |
| `AUTH_COOKIE_SAME_SITE` | Cookie SameSite policy |
| `TRUST_PROXY_HOPS` | Trusted proxy count |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Backend AI configuration |
| `REDIS_HOST`, `REDIS_PORT` | BullMQ Redis connection |
| `REDIS_PASSWORD`, `REDIS_TLS` | Optional Redis security settings |
| `SMTP_HOST`, `SMTP_PORT`, `EMAIL_FROM` | Optional streak-reminder email configuration |
| `SMTP_USER`, `SMTP_PASS` | Optional SMTP credentials |

### Frontend

```dotenv
VITE_API_URL=https://api.example.com/api/v1
VITE_AUTH_URL=https://api.example.com
```

These are public **build-time** settings. Never place secrets such as the Gemini API key in frontend environment variables.

---

## 🌐 Main API Routes

All application routes require a valid session where appropriate. Cookie-authenticated writes also rely on the configured trusted origin.

| Area | Routes |
| --- | --- |
| Auth | `/api/auth/sign-up/email`, `/api/auth/sign-in/email`, `/api/auth/sign-out`, `/api/auth/get-session` |
| Learning Paths | `/api/v1/learning-paths`, `/api/v1/learning-paths/:id` |
| Chapters | `/api/v1/chapters/in-path/:pathId`, `/api/v1/chapters/:id`, completion and notes routes |
| AI | `/api/v1/ai/generate-roadmap`, `/api/v1/ai/job-status/:jobId`, recommendations and resources |
| Assessments | `/api/v1/assessments/generate`, `/api/v1/assessments/submit`, history route |
| Challenges | generation, chapter lookup, history, and response routes under `/api/v1/challenges` |
| Dashboard | `/api/v1/dashboard/stats` |

---

## ✅ Validation Commands

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

For reproducible CI/container builds, prefer `npm ci` with the committed lockfiles.

---

## ⚠️ Current Boundaries

This repository intentionally documents what the application does **and what it does not yet guarantee**:

- AI resource suggestions are generated suggestions, not verified live-search results.
- Practical challenge responses are stored and completed, but they are **not AI-graded**.
- PWA caching covers the application shell; private API data still requires network access.
- Dashboard study duration is estimated, not measured session time.
- Email delivery, Gemini responses, database connectivity, and production cookie behavior depend on the configured deployment environment.
- Resource discovery currently runs in-process, so a server restart can interrupt an active discovery task.
- Production dependency and deployment considerations are documented in the repository audit.

For deeper technical details, see:

- [`docs/AUDIT_REPORT.md`](docs/AUDIT_REPORT.md)
- [`docs/TESTING_GUIDE.md`](docs/TESTING_GUIDE.md)
- [`docs/VERCEL_SERVICES.md`](docs/VERCEL_SERVICES.md)

---

## 🛣️ Future Improvements

- Richer assessment history UI
- Production-ready background-worker deployment
- Verified resource discovery/search
- Shared rate limiting for horizontal scaling
- More advanced learning analytics
- Broader notification options
- Improved offline experience where technically appropriate

---

## 👨‍💻 Developer

**Abdulmalik Muze**

- GitHub: [@Abduman21](https://github.com/Abduman21)
- LinkedIn: [Abdulmalik Muze](https://www.linkedin.com/in/abdulmalik-muze-819951319/)
- Portfolio: [abdulmalikmuz.dev](https://abdulmalikmuz.dev)

---

<div align="center">

### Skill Progress Tracker

**Learn with direction. Track every step.**

[Live Demo](https://skill-progress-tracker-blond.vercel.app/) · [GitHub Repository](https://github.com/Abduman21/Skill-Progress-Tracker)

</div>
