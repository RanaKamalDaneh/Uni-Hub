import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkOrderTransition, availableOrderActions, canTransitionRequest } from './order-state';

test('provider can accept an order awaiting approval', () => {
  assert.deepEqual(checkOrderTransition('AWAITING_APPROVAL', 'accept', 'PROVIDER'), { ok: true, to: 'APPROVED' });
});

test('student cannot accept their own order', () => {
  assert.deepEqual(checkOrderTransition('AWAITING_APPROVAL', 'accept', 'STUDENT'), {
    ok: false,
    reason: 'FORBIDDEN_ACTOR',
  });
});

test('only the system starts work (after payment confirmation)', () => {
  assert.equal(checkOrderTransition('APPROVED', 'start', 'PROVIDER').ok, false);
  assert.equal(checkOrderTransition('APPROVED', 'start', 'SYSTEM').ok, true);
});

test('completed orders are terminal for students', () => {
  assert.deepEqual(availableOrderActions('COMPLETED', 'STUDENT'), []);
});

test('paid in-progress orders cannot be cancelled directly', () => {
  assert.deepEqual(checkOrderTransition('IN_PROGRESS', 'cancel', 'STUDENT'), { ok: false, reason: 'INVALID_STATE' });
});

test('a delivered order offers revision, approval and dispute to the student', () => {
  assert.deepEqual(availableOrderActions('DELIVERED', 'STUDENT').sort(), [
    'approve_completion',
    'dispute',
    'request_revision',
  ]);
});

test('request lifecycle transitions', () => {
  assert.equal(canTransitionRequest('AWAITING_PROPOSALS', 'PROPOSAL_RECEIVED'), true);
  assert.equal(canTransitionRequest('AWARDED', 'CANCELLED'), false);
});
