/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { useExportPassStore } from './export-pass-store.ts';

test('initial state defaults to locked with 0 downloads', () => {
  useExportPassStore.getState().resetPass();
  const state = useExportPassStore.getState();
  assert.equal(state.status, 'locked');
  assert.equal(state.downloadsRemaining, 0);
  assert.equal(state.hasActivePass(), false);
});

test('unlockPass initializes 2 download credits and active 20-min timestamp', () => {
  useExportPassStore.getState().unlockPass();
  const state = useExportPassStore.getState();

  assert.equal(state.status, 'active');
  assert.equal(state.downloadsRemaining, 2);
  assert.ok(state.expiresAt && state.expiresAt > Date.now());
  assert.equal(state.hasActivePass(), true);
  assert.ok(state.getFormattedTimeRemaining()?.includes(':'));
});

test('consumeDownloadCredit deducts credits sequentially and transitions to expired after 2 uses', () => {
  useExportPassStore.getState().unlockPass();

  // 1st consumption: 2 -> 1
  const success1 = useExportPassStore.getState().consumeDownloadCredit();
  assert.equal(success1, true);
  assert.equal(useExportPassStore.getState().downloadsRemaining, 1);
  assert.equal(useExportPassStore.getState().status, 'active');

  // 2nd consumption: 1 -> 0, transitions to expired
  const success2 = useExportPassStore.getState().consumeDownloadCredit();
  assert.equal(success2, true);
  assert.equal(useExportPassStore.getState().downloadsRemaining, 0);
  assert.equal(useExportPassStore.getState().status, 'expired');
  assert.equal(useExportPassStore.getState().hasActivePass(), false);

  // 3rd consumption: fails because already expired
  const success3 = useExportPassStore.getState().consumeDownloadCredit();
  assert.equal(success3, false);
});
