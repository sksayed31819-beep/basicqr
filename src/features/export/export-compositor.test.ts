/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getRasterDimensions,
  computeLayoutMetrics,
} from './export-compositor.ts';

test('getRasterDimensions returns correct dimensions for 512p, 1080p, 2K, 4K', () => {
  assert.deepEqual(getRasterDimensions('512p'), { qrSize: 420, canvasWidth: 512 });
  assert.deepEqual(getRasterDimensions('1080p'), { qrSize: 840, canvasWidth: 1080 });
  assert.deepEqual(getRasterDimensions('2K'), { qrSize: 1600, canvasWidth: 2048 });
  assert.deepEqual(getRasterDimensions('4K'), { qrSize: 3200, canvasWidth: 4096 });
});

test('computeLayoutMetrics calculates dimensions correctly for no frame', () => {
  const metrics = computeLayoutMetrics('none', 1000);
  assert.equal(metrics.width, 1000);
  assert.equal(metrics.height, 1000);
  assert.equal(metrics.qrSize, 1000);
  assert.equal(metrics.qrX, 0);
  assert.equal(metrics.qrY, 0);
});

test('computeLayoutMetrics reserves space for bottom banner CTA', () => {
  const metrics = computeLayoutMetrics('bottom-banner', 1000);
  assert.equal(metrics.width, 1000);
  assert.ok(metrics.height > 1000);
  assert.ok(metrics.qrSize < 1000);
  assert.ok(metrics.textY > metrics.qrY + metrics.qrSize);
  assert.ok(metrics.fontSize > 0);
});

test('computeLayoutMetrics reserves space for top banner CTA', () => {
  const metrics = computeLayoutMetrics('top-banner', 1000);
  assert.equal(metrics.width, 1000);
  assert.ok(metrics.height > 1000);
  assert.ok(metrics.qrY > metrics.textY);
});

test('computeLayoutMetrics calculates polaroid photo card proportions', () => {
  const metrics = computeLayoutMetrics('polaroid', 1000);
  assert.equal(metrics.width, 1000);
  assert.ok(metrics.height > 1200);
  assert.ok(metrics.textY > metrics.qrY + metrics.qrSize);
});
