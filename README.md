# UniHub

**Your University Journey, Made Easier.** UniHub is a bilingual (Arabic/English) platform that connects university students with verified service providers. It also offers academic tools and an openly licensed resource library.

> Current status: **Phase 2 (foundation) complete.** See [docs/DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md).

## Stack

| Layer | Technology |
|---|---|
| Web | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Radix primitives, next-intl, TanStack Query, React Hook Form + Zod |
| API | NestJS 11, REST + Swagger, JWT access tokens + rotating refresh tokens, RBAC |
| Database | PostgreSQL + Prisma 6 |
| Shared | `@unihub/shared`: order/request state machines and constants |
| Tests | Jest (API), node:test (shared), Playwright (e2e/screenshots) |

**No Docker is required.** Local PostgreSQL runs from npm via `embedded-postgres`.

## Prerequisites

- Node.js 20+ (developed on 22)
- Nothing else: PostgreSQL is downloaded as an npm package.

## First-time setup

```bash
npm install
cp apps/api/.env.example apps/api/.env        # then set JWT_ACCESS_SECRET and PAYMENT_WEBHOOK_SECRET
npm run db:start                              # terminal 1: keep running (PostgreSQL on :54329)
npm -w packages/shared run build              # terminal 2
npm run db:migrate                            # apply migrations
npm run db:seed                               # categories, universities, roles, demo accounts
```

## Running

```bash
npm run db:start      # terminal 1: database
npm run dev:api       # terminal 2: API on http://localhost:4000 (Swagger: /api/docs)
npm run dev:web       # terminal 3: web on http://localhost:3000
```

The web app proxies `/api/v1/*` to the API, so the browser only ever talks to `localhost:3000`.

## Demo accounts (development only)

All demo accounts use the password `UniHub2026!`, which you can override with `SEED_DEMO_PASSWORD` when seeding.

| Email | Role |
|---|---|
| admin@demo.unihub.local | Super Admin |
| moderator@demo.unihub.local | Moderator |
| finance@demo.unihub.local | Finance |
| student@demo.unihub.local, student2@demo.unihub.local | Student |
| provider@demo.unihub.local, provider2@demo.unihub.local | Provider (verified) |

## Testing

```bash
npm test                          # shared + API unit tests
node scripts/screenshots.mjs <dir>  # EN/AR/mobile screenshots + UI register smoke test (servers must be running)
```

## Documentation

| Doc | Purpose |
|---|---|
| [PRD](docs/PRD.md) | Product scope, personas, integrity policy |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | System design and key decisions |
| [DATABASE](docs/DATABASE.md) | Schema conventions, ERD, deletion policies |
| [API_DOCUMENTATION](docs/API_DOCUMENTATION.md) | Endpoints and error format |
| [SECURITY](docs/SECURITY.md) | Threat model and controls |
| [ENVIRONMENT_VARIABLES](docs/ENVIRONMENT_VARIABLES.md) | Every env var |
| [TESTING](docs/TESTING.md) | Test strategy and commands |
| [DEPLOYMENT](docs/DEPLOYMENT.md) | Production setup |
| [DEVELOPMENT_ROADMAP](docs/DEVELOPMENT_ROADMAP.md) | Phases and exit criteria |
| [DEVELOPMENT_STATUS](docs/DEVELOPMENT_STATUS.md) | What's done, what's next |
