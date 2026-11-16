/**
 * Single source of truth for order & request lifecycles.
 * The API enforces these transitions; the web app uses them to decide which actions to show.
 */
export const ORDER_STATUSES = [
  'AWAITING_APPROVAL',
  'APPROVED',
  'IN_PROGRESS',
  'DELIVERED',
  'REVISION_REQUESTED',
  'COMPLETED',
  'CANCELLED',
  'DISPUTED',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderActor = 'STUDENT' | 'PROVIDER' | 'ADMIN' | 'SYSTEM';

export type OrderAction =
  | 'accept' // provider accepts a direct service order
  | 'decline' // provider declines a direct service order
  | 'start' // system: payment confirmed by the gateway
  | 'deliver' // provider submits deliverables
  | 'request_revision' // student
  | 'resume' // provider resumes after a revision request
  | 'approve_completion' // student accepts the delivery
  | 'cancel'
  | 'dispute'
  | 'resolve_complete' // admin resolves a dispute -> completed
  | 'resolve_cancel'; // admin resolves a dispute -> cancelled

interface Transition {
  from: readonly OrderStatus[];
  to: OrderStatus;
  actors: readonly OrderActor[];
}

export const ORDER_TRANSITIONS: Record<OrderAction, Transition> = {
  accept: { from: ['AWAITING_APPROVAL'], to: 'APPROVED', actors: ['PROVIDER'] },
  decline: { from: ['AWAITING_APPROVAL'], to: 'CANCELLED', actors: ['PROVIDER'] },
  start: { from: ['APPROVED'], to: 'IN_PROGRESS', actors: ['SYSTEM'] },
  deliver: { from: ['IN_PROGRESS'], to: 'DELIVERED', actors: ['PROVIDER'] },
  request_revision: { from: ['DELIVERED'], to: 'REVISION_REQUESTED', actors: ['STUDENT'] },
  resume: { from: ['REVISION_REQUESTED'], to: 'IN_PROGRESS', actors: ['PROVIDER'] },
  approve_completion: { from: ['DELIVERED'], to: 'COMPLETED', actors: ['STUDENT'] },
  // Unpaid orders can be cancelled directly; paid orders go through dispute and refund.
  cancel: { from: ['AWAITING_APPROVAL', 'APPROVED'], to: 'CANCELLED', actors: ['STUDENT', 'PROVIDER', 'ADMIN'] },
  dispute: {
    from: ['IN_PROGRESS', 'DELIVERED', 'REVISION_REQUESTED'],
    to: 'DISPUTED',
    actors: ['STUDENT', 'PROVIDER'],
  },
  resolve_complete: { from: ['DISPUTED'], to: 'COMPLETED', actors: ['ADMIN'] },
  resolve_cancel: { from: ['DISPUTED'], to: 'CANCELLED', actors: ['ADMIN'] },
};

export type TransitionCheck =
  | { ok: true; to: OrderStatus }
  | { ok: false; reason: 'INVALID_STATE' | 'FORBIDDEN_ACTOR' };

export function checkOrderTransition(current: OrderStatus, action: OrderAction, actor: OrderActor): TransitionCheck {
  const t = ORDER_TRANSITIONS[action];
  if (!t) return { ok: false, reason: 'INVALID_STATE' };
  if (!t.from.includes(current)) return { ok: false, reason: 'INVALID_STATE' };
  if (!t.actors.includes(actor)) return { ok: false, reason: 'FORBIDDEN_ACTOR' };
  return { ok: true, to: t.to };
}

/** Actions a given actor may take from the current status (used to render buttons). */
export function availableOrderActions(current: OrderStatus, actor: OrderActor): OrderAction[] {
  return (Object.keys(ORDER_TRANSITIONS) as OrderAction[]).filter(
    (a) => checkOrderTransition(current, a, actor).ok,
  );
}

export const ACTIVE_ORDER_STATUSES: readonly OrderStatus[] = [
  'AWAITING_APPROVAL',
  'APPROVED',
  'IN_PROGRESS',
  'DELIVERED',
  'REVISION_REQUESTED',
  'DISPUTED',
];

// ── Project requests ──
export const REQUEST_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'AWAITING_PROPOSALS',
  'PROPOSAL_RECEIVED',
  'AWARDED',
  'CANCELLED',
  'EXPIRED',
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

const REQUEST_GRAPH: Record<RequestStatus, readonly RequestStatus[]> = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['UNDER_REVIEW', 'AWAITING_PROPOSALS', 'CANCELLED'],
  UNDER_REVIEW: ['AWAITING_PROPOSALS', 'CANCELLED'],
  AWAITING_PROPOSALS: ['PROPOSAL_RECEIVED', 'CANCELLED', 'EXPIRED'],
  PROPOSAL_RECEIVED: ['AWARDED', 'CANCELLED', 'EXPIRED'],
  AWARDED: [],
  CANCELLED: [],
  EXPIRED: [],
};

export function canTransitionRequest(from: RequestStatus, to: RequestStatus): boolean {
  return REQUEST_GRAPH[from].includes(to);
}

/** Statuses in which providers may still submit proposals. */
export const REQUEST_OPEN_STATUSES: readonly RequestStatus[] = ['AWAITING_PROPOSALS', 'PROPOSAL_RECEIVED'];
