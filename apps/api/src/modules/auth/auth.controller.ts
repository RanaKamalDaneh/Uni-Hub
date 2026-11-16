import { Body, Controller, ForbiddenException, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import type { AuthUser } from '../../common/auth.types';
import { CurrentUser, Public } from '../../common/decorators';
import { ChangePasswordDto, LoginDto, RegisterDto } from './auth.dto';
import { AuthService, IssuedSession, SessionContext } from './auth.service';

export const REFRESH_COOKIE = 'uh_rt';
export const SESSION_HINT_COOKIE = 'uh_session';
const COOKIE_PATH = '/api/v1/auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly config: ConfigService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.respond(res, await this.auth.register(dto, this.ctx(req)));
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.respond(res, await this.auth.login(dto, this.ctx(req)));
  }

  @Public()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.assertSameOrigin(req);
    try {
      return this.respond(res, await this.auth.refresh(req.cookies?.[REFRESH_COOKIE], this.ctx(req)));
    } catch (e) {
      this.clear(res);
      throw e;
    }
  }

  @Public()
  @HttpCode(204)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.assertSameOrigin(req);
    await this.auth.logout(req.cookies?.[REFRESH_COOKIE]);
    this.clear(res);
  }

  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.auth.getSessionUser(user.id);
  }

  @ApiBearerAuth()
  @HttpCode(204)
  @Post('change-password')
  async changePassword(@CurrentUser() user: AuthUser, @Body() dto: ChangePasswordDto, @Req() req: Request) {
    await this.auth.changePassword(user.id, dto, this.ctx(req));
  }

  private respond(res: Response, s: IssuedSession) {
    const secure = this.config.get('NODE_ENV') === 'production';
    res.cookie(REFRESH_COOKIE, s.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      path: COOKIE_PATH,
      expires: s.refreshExpiresAt,
    });
    // Non-sensitive hint so the browser knows a session may exist without exposing the token.
    res.cookie(SESSION_HINT_COOKIE, '1', { httpOnly: false, secure, sameSite: 'strict', path: '/', expires: s.refreshExpiresAt });
    return { accessToken: s.accessToken, user: s.user };
  }

  private clear(res: Response) {
    res.clearCookie(REFRESH_COOKIE, { path: COOKIE_PATH });
    res.clearCookie(SESSION_HINT_COOKIE, { path: '/' });
  }

  private ctx(req: Request): SessionContext {
    return { ip: req.ip, userAgent: req.headers['user-agent'] };
  }

  /** CSRF defence for cookie-authenticated endpoints, on top of SameSite=Strict. */
  private assertSameOrigin(req: Request) {
    const origin = req.headers.origin;
    if (!origin) return; // non-browser clients and same-origin navigations
    const allowed = (this.config.get<string>('CORS_ORIGINS') ?? '').split(',').map((s) => s.trim());
    if (!allowed.includes(origin)) throw new ForbiddenException({ code: 'BAD_ORIGIN', message: 'Origin not allowed' });
  }
}
