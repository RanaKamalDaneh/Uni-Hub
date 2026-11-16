import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import type { RoleKey } from '@unihub/shared';
import type { AuthUser } from './auth.types';

export const IS_PUBLIC_KEY = 'isPublic';
/** Route is reachable without a token; `request.user` is still populated when a valid token is sent. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
/** Caller must hold at least one of these roles. */
export const Roles = (...roles: RoleKey[]) => SetMetadata(ROLES_KEY, roles);

export const PERMISSIONS_KEY = 'permissions';
/** Caller must hold every listed permission (SUPER_ADMIN bypasses). */
export const RequirePermissions = (...perms: string[]) => SetMetadata(PERMISSIONS_KEY, perms);

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AuthUser | undefined => {
  return ctx.switchToHttp().getRequest().user;
});
