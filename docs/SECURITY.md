# Naajah — Security

| Area | Control | Status |
|---|---|---|
| Passwords | bcrypt cost 12. Login compares against a dummy hash when the email doesn't exist, so response timing doesn't reveal which emails are registered | ✅ |
| Sessions | 15-minute access JWT kept in memory (never in localStorage). Rotating refresh token in an HttpOnly + SameSite=Strict cookie, stored hashed (SHA-256). Reusing a token revokes its whole family. A password change revokes all sessions | ✅ |
| CSRF | The API uses Bearer auth (not cookies), so it isn't CSRF-prone. The two cookie endpoints (`/auth/refresh`, `/auth/logout`) have SameSite=Strict plus an Origin allow-list | ✅ |
| Authorization | Global `JwtAuthGuard` (deny by default; `@Public()` opts out) plus `AccessGuard` for `@Roles`/`@RequirePermissions`. Ownership checks in services: students only see their own data, and providers only see orders where they are the provider | ✅ guards / ⏳ ownership with each module |
| Granular admin | 24 permissions across 5 staff roles. Super Admin is the only role that can manage roles | ✅ |
| Input validation | Global `ValidationPipe` with whitelist + `forbidNonWhitelisted`. Zod on the client | ✅ |
| SQL injection | Prisma parameterised queries only. `$queryRaw` is used only with tagged templates | ✅ |
| XSS | React escaping. No `dangerouslySetInnerHTML` for user content. Markdown (library docs) will be sanitised. Helmet CSP on the API | ✅ / ⏳ markdown |
| Rate limiting | 120 requests/min globally. Register 5/min, login 10/min, refresh 30/min | ✅ |
| Headers | Helmet (API). nosniff, frame DENY, referrer and permissions policies (web) | ✅ |
| CORS | Explicit allow-list from `CORS_ORIGINS`, with credentials | ✅ |
| Files | Size limits, extension allow-list, magic-byte check, random storage keys, downloads only through an authorised API endpoint | ⏳ Phase 6 |
| Audit | `AuditLog` covers auth events, every admin mutation, order transitions, verification and refunds | ✅ auth / ⏳ others with their modules |
| Secrets | Env-only and validated at boot (`JWT_ACCESS_SECRET` must be ≥ 32 chars). `.env` is gitignored | ✅ |
| Payments | No card data touches Naajah. Status changes to SUCCEEDED only through a signed gateway webhook | ⏳ Phase 9 |
| Login redirects | `next` parameter restricted to relative paths (no open redirect) | ✅ |
