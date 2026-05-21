# Discovery Hub

Discovery Hub is a full-stack content discovery platform that aggregates **YouTube videos**, **Product Hunt products**, and **arXiv research papers** in one place. Users can search live APIs, browse a synced library, save items, build collections, and get a personalized For You feed.

## Features

- **Live discover** — search external APIs with source filters (videos, products, papers)
- **Library search** — full-text search over synced content in PostgreSQL
- **Saved library** — bookmark and unsave content
- **Collections** — create public lists, upvote community collections, curate items
- **For You feed** — recommendations from interests, saves, interactions, and embeddings
- **Profile & preferences** — interests, theme (light / dark / system)
- **Landing page** — marketing site at `/` with app at `/app`

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL 15 |
| Shared types | npm workspace `@discovery-hub/shared` |
| Infra | Docker Compose (optional) |

## Project structure

```
content-discovery-platform/
├── shared/           # Shared TypeScript types
├── backend/          # Express API (port 5001 locally)
├── frontend/         # Next.js app (port 3000)
├── db-schema.sql     # Database schema
├── db-seed.sql       # Optional category seed (no default users)
└── docker-compose.yml
```

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- (Optional) [YouTube Data API key](https://console.cloud.google.com/) for video discovery

## Quick start (local)

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Database

```bash
npm run db:setup
```

Or manually:

```bash
createdb content_discovery
psql content_discovery -f db-schema.sql
npm run db:seed
```

### 3. Environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env`:

- `DATABASE_URL` — your Postgres connection string
- `JWT_SECRET` — long random string for production
- `YOUTUBE_API_KEY` — optional; required for YouTube results

`frontend/.env.local` should include:

```env
API_URL=http://localhost:5001
```

> **macOS note:** Port **5001** is used locally because macOS AirPlay often blocks port 5000 with 403 errors.

### 4. Run dev servers

```bash
npm run dev
```

- Landing: [http://localhost:3000](http://localhost:3000)
- App: [http://localhost:3000/app](http://localhost:3000/app)
- API health: [http://localhost:5001/health](http://localhost:5001/health)

Create an account via **Sign up** on the site (no default demo user is seeded).

If the frontend shows a stale build error, run:

```bash
npm run dev:clean
```

## Quick start (Docker)

```bash
docker compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend (inside compose): [http://localhost:5000/health](http://localhost:5000/health)

Pass a YouTube key when starting:

```bash
YOUTUBE_API_KEY=your-key docker compose up --build
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Backend + frontend concurrently |
| `npm run dev:clean` | Clear Next.js cache and start frontend |
| `npm run build` | Build shared, backend, and frontend |
| `npm run test` | Backend unit tests (Vitest) |
| `npm run db:setup` | Create DB, apply schema, seed categories |
| `npm run db:seed` | Re-run category seed only |

## API overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | — | Health + DB status |
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/content/discover` | — | Live API search |
| GET | `/api/content/search` | — | Library full-text search |
| POST | `/api/content/ingest` | ✓ | Upsert item to library |
| POST | `/api/content/sync` | ✓ | Fetch + store from external APIs |
| GET | `/api/recommendations/feed` | ✓ | Personalized feed |
| GET/PATCH | `/api/users/me` | ✓ | Profile |
| GET/PATCH | `/api/users/me/preferences` | ✓ | Theme & preferences |
| GET/POST/DELETE | `/api/users/me/saved/:id` | ✓ | Saved items |
| GET | `/api/collections/public` | — | Public collections |
| GET | `/api/collections/mine` | ✓ | Your collections |
| POST | `/api/collections/:id/vote` | ✓ | Upvote / downvote |

## Security

- Never commit `backend/.env` or `frontend/.env.local` (see `.gitignore`)
- Use strong `JWT_SECRET` in production
- Rotate API keys if they were ever exposed

## License

Private / educational use unless otherwise specified.
