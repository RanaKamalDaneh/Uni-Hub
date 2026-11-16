import { ForbiddenException, UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthUser } from './auth.types';
import { PERMISSIONS_KEY, ROLES_KEY } from './decorators';
import { AccessGuard } from './guards';

function ctx(user: AuthUser | undefined, meta: Record<string, unknown>): { ctx: ExecutionContext; reflector: Reflector } {
  const handler = () => undefined;
  const reflector = new Reflector();
  jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => meta[key as string] as never);
  const context = {
    getType: () => 'http',
    getHandler: () => handler,
    getClass: () => Object,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
  return { ctx: context, reflector };
}

const user = (roles: AuthUser['roles'], perms: string[] = []): AuthUser => ({
  id: 'u1',
  email: 'u@example.com',
  roles,
  permissions: new Set(perms),
});

describe('AccessGuard', () => {
  it('allows routes without role/permission metadata', () => {
    const { ctx: c, reflector } = ctx(undefined, {});
    expect(new AccessGuard(reflector).canActivate(c)).toBe(true);
  });

  it('rejects anonymous users on protected routes', () => {
    const { ctx: c, reflector } = ctx(undefined, { [ROLES_KEY]: ['STUDENT'] });
    expect(() => new AccessGuard(reflector).canActivate(c)).toThrow(UnauthorizedException);
  });

  it('rejects a student on a provider-only route', () => {
    const { ctx: c, reflector } = ctx(user(['STUDENT']), { [ROLES_KEY]: ['PROVIDER'] });
    expect(() => new AccessGuard(reflector).canActivate(c)).toThrow(ForbiddenException);
  });

  it('requires every listed permission', () => {
    const meta = { [PERMISSIONS_KEY]: ['payments.read', 'payments.refund'] };
    const partial = ctx(user(['FINANCE'], ['payments.read']), meta);
    expect(() => new AccessGuard(partial.reflector).canActivate(partial.ctx)).toThrow(ForbiddenException);
    const full = ctx(user(['FINANCE'], ['payments.read', 'payments.refund']), meta);
    expect(new AccessGuard(full.reflector).canActivate(full.ctx)).toBe(true);
  });

  it('lets SUPER_ADMIN through regardless of permissions', () => {
    const { ctx: c, reflector } = ctx(user(['SUPER_ADMIN']), { [PERMISSIONS_KEY]: ['roles.manage'] });
    expect(new AccessGuard(reflector).canActivate(c)).toBe(true);
  });
});
