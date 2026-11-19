# Naajah — Development Roadmap

Each phase leaves the application runnable. A phase is complete only when its checklist items are implemented **and** verified (tests or a recorded manual check). The live status is in [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md).

| # | Phase | Deliverables | Exit criteria |
|---|---|---|---|
| 1 | Architecture | Docs, Prisma schema, first migration, shared state machine | Migration applies on a clean DB; state-machine tests pass |
| 2 | Foundation | NestJS core (config, Prisma, errors, validation, Swagger, throttling, helmet), auth with refresh rotation, RBAC, seed; Next.js app shell, design system, i18n (AR/EN, RTL), auth pages | Register/login/refresh/logout pass e2e; role guard tests pass; UI renders in both languages |
| 3 | Public website | Home (all sections), about, contact (persists messages), FAQ, pricing, header/footer, language switcher | Every nav link resolves; Lighthouse a11y ≥ 90 |
| 4 | Marketplace | Categories, subcategories, service listing with search/filter/sort/pagination, service details (all 17 sections), provider public profile, favorites | Search and filter tests; category counts come from the DB |
| 5 | Portals | Student dashboard/profile/settings; provider dashboard/profile/services CRUD/portfolio; provider verification request | Ownership tests (a student can't read another student's data) |
| 6 | Requests & orders | Requests, proposals, compare, accept → order; order page with timeline, milestones, deliverables + versions, revisions, notes, files | Full happy-path e2e; invalid transitions rejected |
| 7 | Academic tools | Upload + extraction, similarity (n-gram + TF-IDF cosine), AI indicators (stylometric, labelled), citation checker (APA/IEEE/Harvard), quality review, PDF reports | Unit tests on the analyzers with fixed fixtures |
| 8 | Library | Resource CRUD (admin), search/filter/pagination, bookmarks, permissioned downloads, license labels | Download auth tests |
| 9 | Messaging & payments | socket.io chat, notifications (in-app + email outbox), sandbox gateway + webhook, coupons, commissions, refunds, invoices, earnings | A payment succeeds only via the webhook; commission math tests |
| 10 | Admin | All admin sections, granular permissions, analytics from the DB, CSV/PDF export, settings, audit logs | Permission matrix tests |
| 11 | Testing | Jest unit, API integration (supertest on a test DB), Playwright e2e (EN + AR, mobile viewport) | CI script green |
| 12 | Deployment | Production build, env docs, migration/backup runbook, process manager config | Documented clean install → running on a fresh machine |
