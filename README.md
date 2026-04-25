# TaskFlow

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![NextAuth](https://img.shields.io/badge/NextAuth-4-1DA1F1)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest)
![Playwright](https://img.shields.io/badge/Playwright-2EA343?logo=playwright)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

[![CI](https://github.com/your-username/taskflow/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/taskflow/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/your-username/taskflow/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/taskflow)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/your-username/taskflow/pulls)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/your-username/taskflow/graphs/commit-activity)

A modern, full-stack task management application with a beautiful UI, kanban board, dark mode, and more.

</div>

## Screenshots

<div align="center">

### Dashboard Overview
![Dashboard](https://via.placeholder.com/800x400/1a202c/ffffff?text=Dashboard+Overview+with+Kanban+Board)

### Task Management
![Tasks](https://via.placeholder.com/800x400/2d3748/ffffff?text=Task+Management+Interface)

### Project Creation
![Projects](https://via.placeholder.com/800x400/3182ce/ffffff?text=Create+and+Manage+Projects)

### Authentication
![Auth](https://via.placeholder.com/800x400/4a5568/ffffff?text=Secure+Authentication+System)

</div>

## Features

- **Multilingual Support** — Portuguese (PT), English (EN), and Spanish (ES) with seamless language switching
- **Authentication** — Secure sign-up/sign-in with NextAuth.js and bcrypt password hashing
- **Project Management** — Create, view, and delete projects
- **Task Management** — Create, update status, search, filter, and delete tasks
- **Kanban Board** — Drag-and-drop tasks between columns (To Do, In Progress, Done)
- **Dark Mode** — System-aware theme with manual toggle, persisted in localStorage
- **CSV Export** — Export your tasks to CSV with one click
- **Responsive Design** — Mobile-first layout that works on all screen sizes
- **Toast Notifications** — User-friendly feedback for all actions
- **Loading States** — Skeleton loaders and spinners for async operations
- **Type Safety** — Full TypeScript with strict typing
- **Input Validation** — Server-side validation for all API endpoints
- **Docker Support** — Dockerfile and docker-compose for easy deployment
- **CI/CD** — GitHub Actions pipeline for lint, type-check, build, and test

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Backend | Next.js API Routes, NextAuth.js v4 |
| Database | SQLite with Prisma ORM 7 |
| Language | TypeScript 5 |
| Testing | Jest, Testing Library |
| DevOps | Docker, GitHub Actions |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
npm install
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Seed Demo Data (optional)

```bash
npm run seed
```

This creates a demo user:
- **Email:** demo@taskflow.com
- **Password:** demo123456

With 3 sample projects and 10 tasks.

### Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key
DATABASE_URL="postgresql://username:password@localhost:5432/taskflow?schema=public"
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - automatically redirects to Portuguese (PT)
- Portuguese: [http://localhost:3000/pt](http://localhost:3000/pt)
- English: [http://localhost:3000/en](http://localhost:3000/en)
- Spanish: [http://localhost:3000/es](http://localhost:3000/es)

## Internationalization (i18n)

TaskFlow supports **3 languages**: Portuguese, English, and Spanish.

### Supported Languages

| Language | Code | Status |
|----------|------|--------|
| Português | PT | ✅ Default |
| English | EN | ✅ Supported |
| Español | ES | ✅ Supported |

### Switching Languages

Use the language switcher in the header (PT | EN | ES buttons) to change the interface language. Your preference is maintained within your session.

### Translation Files

Translation strings are stored in JSON format under `src/i18n/messages/`:

```
src/i18n/
  config.ts              # Language configuration
  messages/
    pt.json             # Portuguese translations
    en.json             # English translations
    es.json             # Spanish translations
  request.ts            # i18n request configuration
```

### Adding New Translations

To add new strings or modify translations:

1. Edit the corresponding JSON file in `src/i18n/messages/`
2. Use the `useTranslations()` hook in your components
3. Reference strings with namespace and key: `t('dashboard.newProject')`

Example:

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('dashboard');
  return <button>{t('newProject')}</button>;
}
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/signin` | Sign in (handled by NextAuth) |
| GET | `/api/auth/session` | Get current session |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all user projects (with tasks) |
| POST | `/api/projects` | Create a new project |
| DELETE | `/api/projects/:id` | Delete a project and its tasks |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task (status, title, description) |
| DELETE | `/api/tasks/:id` | Delete a task |

## Project Structure

```
src/
  app/
    [locale]/
      auth/
        signin/page.tsx
        signup/page.tsx
      profile/page.tsx
      page.tsx
    api/
      auth/
        [...nextauth]/route.ts
        signup/route.ts
      projects/route.ts
      projects/[id]/route.ts
      tasks/route.ts
      tasks/[id]/route.ts
    globals.css
    layout.tsx
  components/
    dashboard/
      Header.tsx
      StatsCards.tsx
      ProjectForm.tsx
      TaskForm.tsx
      ProjectList.tsx
      KanbanBoard.tsx
      AllTasks.tsx
      Modal.tsx
      Toast.tsx
    Dashboard.tsx
    LanguageSwitcher.tsx
    SessionProvider.tsx
  i18n/
    config.ts
    messages/
      pt.json
      en.json
      es.json
    request.ts
  lib/
    auth.ts
    prisma.ts
    validators.ts
  types/
```
    index.ts
  __tests__/
    validators.test.ts
prisma/
  schema.prisma
  seed.ts
  migrations/
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run seed` | Seed database with demo data |

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT-based session management
- All API routes protected with session authentication
- Server-side input validation on all endpoints
- Cascade deletion ensures data consistency

## License

MIT

---

Built with Next.js, TypeScript, Prisma, and Tailwind CSS.
