import type { RoleKey } from '@unihub/shared';

/**
 * Permission catalogue. Keys follow `<resource>.<action>[.<scope>]`.
 * Student/provider capabilities on their OWN data are enforced by ownership checks in services,
 * so those roles need few explicit permissions; staff permissions are granular.
 */
export const PERMISSIONS = {
  // users
  'users.read': 'View users',
  'users.manage': 'Suspend, activate and edit users',
  'roles.manage': 'Manage roles and permissions',
  // providers
  'providers.verify': 'Approve or reject provider verification',
  // catalog
  'catalog.manage': 'Manage categories and subcategories',
  'services.moderate': 'Approve, reject, feature services',
  'services.create': 'Create own services (providers)',
  // requests / proposals / orders
  'requests.create': 'Create project requests',
  'requests.moderate': 'Moderate project requests',
  'proposals.create': 'Submit proposals',
  'orders.read.any': 'View any order',
  'orders.manage': 'Intervene in orders and resolve disputes',
  // money
  'payments.read': 'View payments and transactions',
  'payments.refund': 'Approve and process refunds',
  'commissions.manage': 'Configure commission rates',
  'coupons.manage': 'Manage coupons',
  // content
  'reviews.moderate': 'Hide or restore reviews',
  'resources.manage': 'Manage resource library',
  'academic-tools.manage': 'Configure academic tool integrations',
  // ops
  'support.manage': 'Handle support tickets',
  'notifications.broadcast': 'Send system notifications',
  'reports.read': 'View analytics and export reports',
  'settings.manage': 'Edit system settings',
  'audit.read': 'View audit logs',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

const ALL = Object.keys(PERMISSIONS) as PermissionKey[];

export const ROLE_DEFINITIONS: Record<RoleKey, { name: string; description: string; permissions: PermissionKey[] }> = {
  STUDENT: {
    name: 'Student',
    description: 'Browses services, creates requests and orders',
    permissions: ['requests.create'],
  },
  PROVIDER: {
    name: 'Service Provider',
    description: 'Publishes services and submits proposals',
    permissions: ['services.create', 'proposals.create'],
  },
  SUPER_ADMIN: { name: 'Super Admin', description: 'Full access', permissions: ALL },
  ADMIN: {
    name: 'Administrator',
    description: 'Platform operations (no role management)',
    permissions: ALL.filter((p) => p !== 'roles.manage'),
  },
  MODERATOR: {
    name: 'Moderator',
    description: 'Catalog, requests, reviews and verification',
    permissions: ['users.read', 'providers.verify', 'services.moderate', 'requests.moderate', 'reviews.moderate', 'resources.manage', 'orders.read.any'],
  },
  SUPPORT: {
    name: 'Support Agent',
    description: 'Support tickets and order assistance',
    permissions: ['users.read', 'orders.read.any', 'support.manage'],
  },
  FINANCE: {
    name: 'Finance',
    description: 'Payments, refunds, commissions and reports',
    permissions: ['payments.read', 'payments.refund', 'commissions.manage', 'coupons.manage', 'reports.read', 'orders.read.any'],
  },
};
