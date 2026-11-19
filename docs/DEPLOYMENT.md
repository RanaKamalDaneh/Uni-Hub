# Naajah — Deployment

> Draft. This document is completed in Phase 12. The production setup does **not** use Docker or `embedded-postgres`.

## Topology

- **PostgreSQL 14+:** managed (e.g. Azure Database for PostgreSQL, AWS RDS, Neon) or self-hosted. Turn on daily automated backups and point-in-time recovery.
- **API:** `node apps/api/dist/main.js` under a process manager (PM2 or systemd), behind an HTTPS reverse proxy (Nginx or IIS ARR).
- **Web:** `next start` (or any Node host that supports Next.js), with `API_INTERNAL_URL` pointing at the API.
- **Object storage:** S3-compatible (`STORAGE_DRIVER=s3`).
- **Email:** SMTP provider (`MAIL_DRIVER=smtp`).

## Release steps

```bash
npm ci
npm run build
npm -w apps/api run prisma:deploy     # applies committed migrations only; never `migrate dev` in production
# start the API and web processes
```

## Checklist

- [ ] `NODE_ENV=production`; strong, unique `JWT_ACCESS_SECRET` and `PAYMENT_WEBHOOK_SECRET`
- [ ] `CORS_ORIGINS` set to the exact production web origin
- [ ] HTTPS everywhere (cookies are `Secure` in production)
- [ ] Swagger is disabled automatically in production
- [ ] The seed script refuses to run in production. Create the first Super Admin with a one-off script (Phase 12)
- [ ] Database backups verified with a test restore
