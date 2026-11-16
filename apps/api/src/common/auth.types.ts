import type { RoleKey } from '@unihub/shared';

/** Claims carried in the short-lived access token. */
export interface AccessTokenPayload {
  sub: string;
  email: string;
  roles: RoleKey[];
  perms: string[];
}

/** The authenticated principal attached to `request.user`. */
export interface AuthUser {
  id: string;
  email: string;
  roles: RoleKey[];
  permissions: Set<string>;
}

export function hasRole(user: AuthUser | undefined, ...roles: RoleKey[]): boolean {
  return !!user && roles.some((r) => user.roles.includes(r));
}

export function isStaff(user: AuthUser | undefined): boolean {
  return hasRole(user, 'ADMIN', 'SUPER_ADMIN', 'SUPPORT', 'FINANCE', 'MODERATOR');
}

export function can(user: AuthUser | undefined, permission: string): boolean {
  return !!user && (user.permissions.has(permission) || user.roles.includes('SUPER_ADMIN'));
}
