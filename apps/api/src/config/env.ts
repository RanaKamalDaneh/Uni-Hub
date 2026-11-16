import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  WEB_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1),

  // Shared secret the Next.js server sends so its server-side requests are not rate limited.
  INTERNAL_API_KEY: z.string().min(24).optional(),

  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),

  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  STORAGE_LOCAL_DIR: z.string().default('../../.data/uploads'),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),

  MAIL_DRIVER: z.enum(['outbox', 'smtp']).default('outbox'),
  MAIL_OUTBOX_DIR: z.string().default('../../.data/outbox'),
  MAIL_FROM: z.string().default('UniHub <no-reply@unihub.local>'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  PAYMENT_GATEWAY: z.enum(['sandbox', 'stripe']).default('sandbox'),
  PAYMENT_WEBHOOK_SECRET: z.string().min(16),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  AI_DETECTOR_PROVIDER: z.string().optional(),
  AI_DETECTOR_API_URL: z.string().optional(),
  AI_DETECTOR_API_KEY: z.string().optional(),
  GRAMMAR_PROVIDER: z.string().optional(),
  GRAMMAR_API_URL: z.string().optional(),
  SIMILARITY_EXTERNAL_PROVIDER: z.string().optional(),
  SIMILARITY_EXTERNAL_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof schema>;

/** Validates process.env at boot; the app refuses to start with an invalid configuration. */
export function validateEnv(raw: Record<string, unknown>): Env {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return parsed.data;
}
