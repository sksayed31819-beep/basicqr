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

test('Production Ad Config uses Monetag with 15s break and 20-minute pass', () => {
  assert.equal(PRODUCTION_AD_CONFIG.network, 'monetag');
  assert.equal(PRODUCTION_AD_CONFIG.rewardedDurationSeconds, 15);
  assert.equal(PRODUCTION_AD_CONFIG.passDurationMinutes, 20);
  assert.equal(PRODUCTION_AD_CONFIG.downloadsPerPass, 2);
  assert.equal(PRODUCTION_AD_CONFIG.fallbackToSponsorOnAdBlock, true);
});

test('isThirdPartyAdNetworkActive is true when Monetag is configured', () => {
  assert.equal(isThirdPartyAdNetworkActive(), true);
});

test('getUnlockBenefitDescription produces user-friendly string', () => {
  const desc = getUnlockBenefitDescription();
  assert.ok(desc.includes('2 High-Res'));
  assert.ok(desc.includes('20 minutes'));
});
