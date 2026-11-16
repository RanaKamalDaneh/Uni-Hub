# UniHub — Architecture

## 1. Overview

UniHub is a bilingual (Arabic/English) marketplace and workspace connecting university students with
verified service providers, plus self-service academic tools and an openly-licensed resource library.

```
┌──────────────────────┐   HTTPS/JSON (REST)    ┌──────────────────────────┐
│  apps/web (Next.js)  │ ─────────────────────▶ │  apps/api (NestJS)       │
│  App Router, RSC +   │ ◀───────────────────── │  /api/v1/*  + Swagger    │
│  client components   │   WebSocket (socket.io)│  Guards: JWT + RBAC      │
└──────────┬───────────┘                        └───┬────────┬────────┬────┘
           │ cookie: locale, refresh (httpOnly)     │        │        │
           ▼                                        ▼        ▼        ▼
     Browser (RTL/LTR)                      PostgreSQL     Storage adapter      Mail adapter
                                             (Prisma)     local disk (dev) /   outbox log (dev) /
                                                          S3-compatible (prod) SMTP (prod)
```

**No Docker is required.** Local development runs PostgreSQL 16 via the `embedded-postgres` npm package
(the binary ships in `node_modules`; data lives in `./.data/pg`). Production uses any PostgreSQL 14+
through `DATABASE_URL`. Redis is optional and only needed for multi-instance deployments.

## 2. Monorepo layout

```
/
├── apps/
│   ├── api/                      NestJS backend
│   │   ├── prisma/               schema.prisma, migrations/, seed.ts
│   │   ├── src/
│   │   │   ├── common/           guards, decorators, filters, pipes, utils
│   │   │   ├── config/           typed env config (zod-validated)
│   │   │   ├── prisma/           PrismaService
│   │   │   └── modules/
│   │   │       ├── auth/         register, login, refresh rotation, logout
│   │   │       ├── users/        profiles, student/provider profile
│   │   │       ├── rbac/         roles, permissions, PermissionsGuard
│   │   │       ├── catalog/      categories, subcategories
│   │   │       ├── services/     services, packages, search/filter
│   │   │       ├── providers/    provider profiles, verification, portfolio
│   │   │       ├── requests/     custom project requests
│   │   │       ├── proposals/    proposals on requests
│   │   │       ├── orders/       orders, state machine, milestones, deliverables
│   │   │       ├── files/        upload/download with access control (S3 adapter)
│   │   │       ├── messaging/    conversations, messages, websocket gateway
│   │   │       ├── notifications/in-app + email (mailer adapter)
│   │   │       ├── payments/     gateway abstraction, sandbox gateway, webhooks,
│   │   │       │                 commissions, refunds, coupons, invoices
│   │   │       ├── reviews/      reviews, favorites
│   │   │       ├── academic-tools/ text extraction, similarity, AI indicators,
│   │   │       │                 citation checker, quality review, PDF reports
│   │   │       ├── library/      resources, bookmarks
│   │   │       ├── support/      support tickets
│   │   │       ├── admin/        analytics, exports, settings
│   │   │       └── audit/        audit log interceptor + queries
│   │   └── test/                 e2e/integration tests (supertest)
│   └── web/                      Next.js frontend
│       ├── messages/             en.json, ar.json (all UI strings)
│       └── src/
│           ├── app/              routes: (public), student/, provider/, admin/
│           ├── components/       ui/ (design-system primitives), layout/, feature/
│           ├── lib/              api client, auth context, query client, utils
│           └── i18n/             next-intl request config (cookie locale)
├── packages/
│   └── shared/                   enums, zod schemas, order state machine, constants
├── docs/                         all project documentation
├── scripts/db.mjs                starts/stops the embedded PostgreSQL for development
└── package.json                  npm workspaces
```

## 3. Key decisions

| Decision | Choice | Reason |
|---|---|---|
| Repo | npm workspaces monorepo | One install, shared types between web and api, no extra tooling (pnpm not installed). |
| Frontend | Next.js 15 App Router + Tailwind + shadcn-style primitives (Radix + cva) | As specified; primitives are written in-repo so they follow the UniHub palette. |
| i18n | `next-intl` without locale prefixes, locale in a `NEXT_LOCALE` cookie | Keeps the exact route map from the spec; the choice persists across sessions; `dir="rtl"` is applied at `<html>`. |
| Backend | NestJS 11, REST, Swagger at `/api/docs` | As specified. |
| ORM | Prisma 6 + PostgreSQL 16 | As specified; migrations are committed. |
| Auth | Short-lived access JWT (15 min) in memory + rotating refresh token in an httpOnly cookie. Refresh tokens are hashed in the DB and grouped by family, so reuse is detected | Refresh rotation with theft detection; the access token is never in localStorage. |
| AuthZ | Role → Permission (granular strings like `orders.read.any`) + ownership checks in services | Admin privileges are granular. Students and providers are confined to their own data. |
| Files | `StorageAdapter` interface: S3 (MinIO/AWS) and local-disk implementations. Every download goes through the API, which checks ownership | Private documents are never publicly addressable. |
| Payments | `PaymentGateway` interface + `SandboxGateway`. A payment becomes `SUCCEEDED` only via the gateway confirmation/webhook path | Stripe or local gateways (e.g. HyperPay, CliQ) plug in later. |
| Real-time | socket.io gateway authenticated with an access JWT; rooms per conversation/user | Messages and notifications. |
| Jobs | In-process scheduler (`@nestjs/schedule`) for deadline reminders; Redis is optional | Keeps dev setup light; BullMQ can replace it when scaling. |
| Local DB | `embedded-postgres` (real PostgreSQL 16 binary from npm) | No Docker and no system install; the same SQL dialect as production. |
| Storage/mail in dev | Local-disk storage in `./.data/uploads`; mail written to `./.data/outbox` | No Docker services needed. S3/SMTP are enabled through env vars. |
| Academic tools | Local processing (pdf-parse, mammoth, n-gram/TF-IDF similarity, stylometric indicators, rule-based citation checks), with adapters for external detectors/grammar services that report `not_configured` until credentials exist | No fabricated results, and no claimed Turnitin/iThenticate integration. |

## 4. Order & request lifecycle

The spec lists one status list with "Under Review" twice. UniHub splits it into two lifecycles:

**ProjectRequest**: `DRAFT → SUBMITTED → UNDER_REVIEW (moderation) → AWAITING_PROPOSALS → PROPOSAL_RECEIVED → AWARDED`, with `CANCELLED`/`EXPIRED` as exits.

**Order**: `AWAITING_APPROVAL → APPROVED → IN_PROGRESS → DELIVERED ("Under Review" by the student) → COMPLETED`.
- `DELIVERED → REVISION_REQUESTED → IN_PROGRESS`
- Any active status can go to `CANCELLED` (rules apply) or `DISPUTED`.

How the steps work:
- A direct service order starts in `AWAITING_APPROVAL`, waiting for the provider to accept.
- Accepting a proposal creates an order in `APPROVED`, because both parties have already agreed.
- `APPROVED → IN_PROGRESS` happens only after the payment is confirmed by the gateway.

Transitions are defined once, in `packages/shared/src/order-state.ts`, with the allowed actor role for each. The backend enforces them, and every change writes `OrderStatusHistory`.

## 5. Security model (summary — see SECURITY.md)

- bcrypt password hashing (cost 12), with zod/class-validator input validation on every DTO.
- Helmet, strict CORS allow-list, and `@nestjs/throttler` rate limits (stricter on auth routes).
- Uploads: size limit, MIME + magic-byte validation and an extension allow-list. Files get random storage keys, and downloads are authorized per request.
- All mutations by admins and sensitive actions are written to `AuditLog`.
- The refresh cookie is `SameSite=Strict`, httpOnly, and Secure in production. The API authenticates with a Bearer header, so CSRF exposure is limited to the refresh endpoint, which is protected by SameSite plus an Origin check.
