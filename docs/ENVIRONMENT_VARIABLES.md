# Naajah — Environment Variables

The API validates its configuration at boot (`apps/api/src/config/env.ts`) and refuses to start if it's invalid. The template is in `apps/api/.env.example`.

## API (`apps/api/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | | `development` | `development` \| `test` \| `production` |
| `PORT` | | `4000` | HTTP port |
| `CORS_ORIGINS` | | `http://localhost:3000` | Comma-separated allowed origins (also used for the Origin check on cookie endpoints) |
| `WEB_URL` | | `http://localhost:3000` | Used in email links |
| `DATABASE_URL` | ✅ | | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | ✅ | | ≥ 32 chars, random |
| `JWT_ACCESS_TTL` | | `15m` | Access-token lifetime |
| `REFRESH_TOKEN_TTL_DAYS` | | `30` | Refresh-token lifetime |
| `STORAGE_DRIVER` | | `local` | `local` \| `s3` |
| `STORAGE_LOCAL_DIR` | | `../../.data/uploads` | Local upload directory |
| `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | when `s3` | | S3-compatible storage |
| `MAIL_DRIVER` | | `outbox` | `outbox` (writes `.eml` files) \| `smtp` |
| `MAIL_OUTBOX_DIR` | | `../../.data/outbox` | |
| `MAIL_FROM` | | `Naajah <no-reply@unihub.local>` | |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | when `smtp` | | |
| `PAYMENT_GATEWAY` | | `sandbox` | `sandbox` \| `stripe` |
| `PAYMENT_WEBHOOK_SECRET` | ✅ | | HMAC secret for sandbox webhooks (≥ 16 chars) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | when `stripe` | | |
| `AI_DETECTOR_PROVIDER`, `AI_DETECTOR_API_URL`, `AI_DETECTOR_API_KEY` | optional | | External AI-content detector. Empty means "not configured" in the UI |
| `GRAMMAR_PROVIDER`, `GRAMMAR_API_URL` | optional | | e.g. a self-hosted LanguageTool server |
| `SIMILARITY_EXTERNAL_PROVIDER`, `SIMILARITY_EXTERNAL_API_KEY` | optional | | Licensed external similarity source |

## Seed only

| Variable | Default | Description |
|---|---|---|
| `SEED_DEMO_PASSWORD` | `UniHub2026!` | Password for demo accounts |

## Local database (`scripts/db.mjs`)

| Variable | Default |
|---|---|
| `PGPORT` | `54329` |
| `PGUSER` | `unihub` |
| `PGPASSWORD` | `unihub_dev_password` |
| `PGDATABASE` | `unihub` (a `unihub_test` database is also created) |

## Web (`apps/web/.env.local`, optional)

| Variable | Default | Description |
|---|---|---|
| `API_INTERNAL_URL` | `http://localhost:4000` | Where the Next.js server and proxy reach the API |
