/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRODUCTION_AD_CONFIG,
  isThirdPartyAdNetworkActive,
  getUnlockBenefitDescription,
} from './ad-config.ts';

test('Production Ad Config defaults to safe direct_sponsor mode', () => {
  assert.equal(PRODUCTION_AD_CONFIG.network, 'direct_sponsor');
  assert.equal(PRODUCTION_AD_CONFIG.rewardedDurationSeconds, 10);
  assert.equal(PRODUCTION_AD_CONFIG.passDurationMinutes, 10);
  assert.equal(PRODUCTION_AD_CONFIG.downloadsPerPass, 2);
  assert.equal(PRODUCTION_AD_CONFIG.fallbackToSponsorOnAdBlock, true);
});

test('isThirdPartyAdNetworkActive returns false for default direct_sponsor', () => {
  assert.equal(isThirdPartyAdNetworkActive(), false);
});

test('getUnlockBenefitDescription produces user-friendly string', () => {
  const desc = getUnlockBenefitDescription();
  assert.ok(desc.includes('2 High-Res'));
  assert.ok(desc.includes('10 minutes'));
});
