# Naajah — API Documentation

- **Base URL:** `/api/v1` (proxied by the web app; directly on `http://localhost:4000/api/v1` in dev)
- **Interactive docs:** Swagger UI at `http://localhost:4000/api/docs` (disabled in production)

## Authentication

- `POST /auth/login` and `POST /auth/register` return `{ accessToken, user }` and set two cookies:
  - `uh_rt`: the refresh token. HttpOnly, SameSite=Strict, path `/api/v1/auth`.
  - `uh_session`: a non-sensitive hint that a session exists.
- Send `Authorization: Bearer <accessToken>` on protected routes. Access tokens live for 15 minutes.
- `POST /auth/refresh` rotates the refresh token and returns a new access token. Reusing an old refresh token revokes every session in that family.

## Error format

Every error has the same shape:

```json
{ "statusCode": 400, "code": "VALIDATION_ERROR", "message": "Some fields are invalid", "details": ["email must be an email"] }
```

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | DTO validation failed; `details` lists the problems |
| `UNAUTHENTICATED` / `TOKEN_INVALID` | 401 | Missing or expired access token |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `SESSION_REVOKED` / `SESSION_EXPIRED` / `NO_SESSION` | 401 | Refresh failed; log in again |
| `FORBIDDEN` / `BAD_ORIGIN` / `ACCOUNT_DISABLED` | 403 | Not allowed |
| `NOT_FOUND`, `CATEGORY_NOT_FOUND` | 404 | |
| `ALREADY_EXISTS`, `EMAIL_TAKEN`, `IN_USE` | 409 / 400 | Conflicts |
| `TOO_MANY_REQUESTS` | 429 | Rate limited |

## Endpoints implemented

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | public | Liveness + DB check |
| POST | `/auth/register` | public (5/min) | `{fullName, email, password, accountType: STUDENT\|PROVIDER, locale?, acceptTerms}` |
| POST | `/auth/login` | public (10/min) | `{email, password}` |
| POST | `/auth/refresh` | refresh cookie | Rotate the session |
| POST | `/auth/logout` | refresh cookie | Revoke the session family |
| GET | `/auth/me` | bearer | Current user, roles, permissions |
| POST | `/auth/change-password` | bearer | Signs out all other sessions |
| GET | `/categories` | public | Active categories with live `serviceCount` |
| GET | `/categories/:slug` | public | Category + subcategories with counts |
| GET | `/reference-data` | public | Universities, academic levels |

## Planned endpoints (by phase)

- **Phase 4:**
  - `GET /services`, `GET /services/:slug`
  - `GET/POST/PATCH /provider/services`
  - `GET /providers/:slug`, `GET /providers/featured`
  - `POST/DELETE /favorites/:serviceId`
- **Phase 5:**
  - `GET/PATCH /me/profile`
  - `PATCH /me/provider-profile`
  - `POST /me/provider-profile/verification`
- **Phase 6:**
  - `/requests` CRUD and `/requests/public`
  - `/requests/:id/proposals`
  - `POST /proposals/:id/accept`
  - `/orders`, `POST /orders/:id/actions/:action`
  - `/orders/:id/milestones`, `/orders/:id/deliverables`, `/files/:id`
- **Phase 7:** `/academic/documents`, `POST /academic/documents/:id/analyses`, `GET /academic/analyses/:id/report.pdf`
- **Phase 8:** `/library/resources`, `/library/resources/:slug/download`, `/library/bookmarks`
- **Phase 9:**
  - `/conversations`, `/notifications`
  - `/payments/checkout`, `POST /payments/webhooks/:gateway`
  - `/refunds`, `/coupons/validate`, `/invoices/:id.pdf`
- **Phase 10:** `/admin/*` (each route guarded by a granular permission; see `apps/api/src/modules/rbac/permissions.ts`)
