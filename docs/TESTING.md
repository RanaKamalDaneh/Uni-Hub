# UniHub — Testing

| Layer | Tool | Location | Command |
|---|---|---|---|
| Shared logic | `node:test` | `packages/shared/src/*.test.ts` | `npm -w packages/shared test` |
| API unit | Jest + ts-jest | `apps/api/src/**/*.spec.ts` | `npm -w apps/api test` |
| API integration | Jest + supertest against the `unihub_test` DB | `apps/api/test/*.e2e-spec.ts` | `npm -w apps/api run test:e2e` (Phase 11) |
| UI smoke / screenshots | Playwright | `scripts/screenshots.mjs` | `node scripts/screenshots.mjs <outDir>` |
| E2E | Playwright Test (EN + AR, desktop + 390px mobile) | `e2e/` | Phase 11 |

## Current results

- Shared state machine: **7/7 passing**
- API `AccessGuard`: **5/5 passing**
- Playwright smoke: homepage EN/AR/mobile render with **0 console errors**; the UI register flow succeeds

## Required coverage (QA checklist from the spec)

Registration, login, logout, role permissions, profiles, service CRUD/search/details, requests, proposals, acceptance, orders, tracking, file upload and download, messaging, notifications, sandbox payments, admin operations, reports, Arabic RTL, English LTR, mobile. Each is tracked in [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) as its phase lands.
