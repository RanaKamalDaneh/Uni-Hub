import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { timingSafeEqual } from 'node:crypto';

export const INTERNAL_KEY_HEADER = 'x-internal-key';

/**
 * Rate limiting for public traffic. Server-to-server requests from the Next.js web server
 * (which renders every page and would otherwise share one IP for all visitors) carry a secret
 * INTERNAL_API_KEY and are not throttled.
 */
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') return true;
    const expected = process.env.INTERNAL_API_KEY;
    const provided = context.switchToHttp().getRequest().headers?.[INTERNAL_KEY_HEADER];
    if (!expected || expected.length < 24 || typeof provided !== 'string') return false;
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  }
}
