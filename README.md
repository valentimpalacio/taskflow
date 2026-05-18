<div align="center">

# 🚀 TaskFlow

**Modern Task Management — Full Stack Application**

> 🌐 **Live:** [taskflow-gestao.vercel.app](https://taskflow-gestao.vercel.app)

![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma 7](https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/valentimpalacio/taskflow/pulls)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Built_with-Next.js_16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Live Demo](https://img.shields.io/badge/Live_Demo-←_Click-8B5CF6?style=flat-square&logo=vercel)](https://taskflow-gestao.vercel.app)

<p align="center">
  <strong>🇧🇷 Português · 🇺🇸 English · 🇪🇸 Español</strong>
</p>

---


</div>

<br/>

## ✨ Features

| Feature | Description |
|---------|------------|
| 🌐 **Multilingual** | Portuguese, English, and Spanish — switch with one click |
| 🔐 **Authentication** | Secure sign-up/sign-in with NextAuth.js & bcrypt |
| 📋 **Kanban Board** | Drag-and-drop tasks with optimistic updates for zero-latency UX |
| 📊 **Productivity Analytics** | Interactive bar charts powered by Recharts |
| 🗂️ **Gantt Chart View** | Visual timeline of project tasks |
| 📅 **Calendar View** | See tasks organized by due dates in a calendar layout |
| 🔍 **Advanced Search & Filters** | Real-time search and project filtering |
| 🏷️ **Tags System** | Categorize and filter tasks with custom tags |
| 📝 **Subtasks** | Break down tasks into checklist subtasks |
| 💬 **Comments** | Discuss tasks with inline comments |
| 🔔 **Notifications** | Real-time notification bell with unread indicators |
| 🔗 **Project Sharing** | Share projects with other users |
| 🔁 **Duplicate Tasks** | Clone tasks with a single click |
| 📋 **Advanced Reports** | Detailed productivity and project reports |
| 🕸️ **Webhooks** | Integrate with external services via webhooks |
| 📤 **CSV Export** | Export your tasks to CSV with one click |
| 🌙 **Dark Mode** | System-aware theme with manual toggle, persisted in localStorage |
| 📱 **Fully Responsive** | Mobile-first design that works on every screen size |
| ⚡ **Server State Management** | Expert-level caching with TanStack Query |
| 🎨 **Animated UI** | Smooth animations, counters, and micro-interactions |
| 🛡️ **Type Safety** | Full TypeScript with strict mode |
| 🧪 **CI/CD & E2E Testing** | Jest unit tests + Playwright E2E tests |

<br/>

## 📸 Screenshots

### Authentication Views

<div align="center">

| Portuguese | English | Spanish |
|-----------|---------|---------|
| ![Sign In PT](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/01-pt-signin.png) | ![Sign In EN](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/02-en-signin.png) | ![Sign In ES](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/03-es-signin.png) |

</div>

### Dashboard & Main Views

<div align="center">

| Portuguese | English | Spanish |
|-----------|---------|---------|
| ![Dashboard PT](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/04-pt-dashboard.png) | ![Dashboard EN](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/05-en-dashboard.png) | ![Dashboard ES](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/06-es-dashboard.png) |

</div>

### Feature Showcases

<div align="center">

| Kanban Board | Gantt Chart | Calendar View |
|-----------|---------|---------|
| ![Kanban Board](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/07-pt-kanban.png) | ![Gantt Chart](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/08-pt-gantt.png) | ![Calendar View](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/09-pt-calendar.png) |

</div>

### Advanced Features

<div align="center">

| Analytics | Reports | Dark Mode |
|-----------|---------|-----------|
| ![Analytics](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/10-pt-analytics.png) | ![Reports](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/11-pt-reports.png) | ![Dark Mode](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/12-pt-dark-mode.png) |

</div>

### Responsive Design

<div align="center">

| Mobile View |
|-----------|
| ![Mobile](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/13-pt-mobile.png) |

</div>

<br/>


## �🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Icons** | Lucide React |
| **Database** | PostgreSQL 16 + Prisma ORM 7 |
| **Auth** | NextAuth.js v4 |
| **State Management** | TanStack Query v5 |
| **Charts** | Recharts |
| **i18n** | next-intl |
| **Validation** | Zod |
| **Testing** | Jest + Playwright |
| **DevOps** | Docker + GitHub Actions |

<br/>

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm
- PostgreSQL 16 (or use Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/valentimpalacio/taskflow.git
cd taskflow

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### Seed Demo Data

```bash
npm run seed
```

This creates a demo user:
- **Email:** `demo@taskflow.com`
- **Password:** `demo123456`

With **3 sample projects** and **10 tasks** to explore.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — automatically redirects to Portuguese.

| Language | URL |
|----------|-----|
| 🇧🇷 Português | [http://localhost:3000/pt](http://localhost:3000/pt) |
| 🇺🇸 English | [http://localhost:3000/en](http://localhost:3000/en) |
| 🇪🇸 Español | [http://localhost:3000/es](http://localhost:3000/es) |

<br/>

## 🌍 Internationalization

TaskFlow supports **3 languages** out of the box:

| Language | Code | Status |
|----------|------|--------|
| 🇧🇷 Português | `pt` | ✅ Default |
| 🇺🇸 English | `en` | ✅ Supported |
| 🇪🇸 Español | `es` | ✅ Supported |

Translations are stored in JSON files under `src/i18n/messages/`.

<br/>

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── auth/
│   │   │   ├── signin/    # Sign-in page
│   │   │   └── signup/    # Sign-up page
│   │   ├── profile/       # User profile page
│   │   ├── error.tsx      # Error boundary
│   │   ├── loading.tsx    # Loading state
│   │   ├── not-found.tsx  # 404 page
│   │   ├── layout.tsx     # Locale layout
│   │   └── page.tsx       # Dashboard page
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth + signup
│   │   ├── comments/      # Task comments
│   │   ├── duplicate/     # Duplicate tasks
│   │   ├── health/        # Health check
│   │   ├── notifications/ # User notifications
│   │   ├── project-access/# Project sharing
│   │   ├── projects/      # CRUD projects (+ templates)
│   │   ├── subtasks/      # Task subtasks
│   │   ├── tags/          # Task tags
│   │   ├── tasks/         # CRUD tasks (+ dependencies)
│   │   ├── test-db/       # DB connection test
│   │   ├── user/          # User profile
│   │   └── webhooks/      # Webhook management
│   └── globals.css        # Global styles + animations
├── components/
│   ├── Dashboard.tsx       # Main dashboard
│   └── dashboard/         # Dashboard sub-components
│       ├── Header.tsx
│       ├── StatsCards.tsx
│       ├── KanbanBoard.tsx
│       ├── ProjectList.tsx
│       ├── AllTasks.tsx
│       ├── ProjectForm.tsx
│       ├── TaskForm.tsx
│       ├── TaskEditModal.tsx
│       ├── ProjectEditModal.tsx
│       ├── Modal.tsx
│       ├── Toast.tsx
│       ├── ProductivityChart.tsx
│       ├── AdvancedReports.tsx
│       ├── CalendarView.tsx
│       ├── CommentsSection.tsx
│       ├── DuplicateTaskModal.tsx
│       ├── GanttChartView.tsx
│       ├── NotificationBell.tsx
│       ├── ProjectSharingModal.tsx
│       ├── SubtasksPanel.tsx
│       ├── TagsInput.tsx
│       └── WebhookManager.tsx
├── i18n/                  # Internationalization config
├── lib/                   # Utilities, auth, prisma
└── types/                 # TypeScript types
```

<br/>

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/signin` | Sign in (NextAuth) |
| GET | `/api/auth/session` | Get current session |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all user projects with tasks |
| POST | `/api/projects` | Create a new project |
| PUT | `/api/projects/[id]` | Update a project |
| DELETE | `/api/projects/[id]` | Delete a project and its tasks |
| GET | `/api/projects/templates` | Get project templates |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/[id]` | Update a task |
| DELETE | `/api/tasks/[id]` | Delete a task |
| POST | `/api/tasks/dependencies` | Manage task dependencies |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments` | Get task comments |
| POST | `/api/comments` | Add a comment |

### Subtasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subtasks` | Get task subtasks |
| POST | `/api/subtasks` | Create / update subtasks |

### Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | Get all tags |
| POST | `/api/tags` | Create / manage tags |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications |
| PUT | `/api/notifications` | Mark as read |

### Project Sharing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/project-access` | Get project collaborators |
| POST | `/api/project-access` | Share project with user |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/webhooks` | List webhooks |
| POST | `/api/webhooks` | Create / manage webhook |

### Duplicate
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/duplicate` | Duplicate a task |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get current user profile |
| PUT | `/api/user/profile` | Update display name |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Application health check |
| GET | `/api/test-db` | Database connection test |

<br/>

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests (Playwright)
npx playwright test
```

<br/>

## 🐳 Docker

```bash
# Start PostgreSQL
docker compose up -d

# Run the app
npm run dev
```

<br/>

## 🛡️ Security

- Passwords hashed with **bcrypt** (10 salt rounds)
- **JWT**-based session management
- All API routes protected with session authentication
- Server-side **input validation** on all endpoints
- **Cascade deletion** ensures data consistency
- **Rate limiting** on auth endpoints

<br/>

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run seed` | Seed database with demo data |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |

<br/>

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br/>

---

<div align="center">
  <sub>Built with ❤️ using Next.js, TypeScript, Prisma, and Tailwind CSS</sub>
  <br/>
  <sub>⭐ Star this repo if you find it useful!</sub>
</div>
