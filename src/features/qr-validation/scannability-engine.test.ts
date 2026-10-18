/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hexToRgb,
  getRelativeLuminance,
  getContrastRatio,
  isColorInverted,
} from './scannability-engine.ts';

test('hexToRgb correctly parses 6-digit and 3-digit hex strings', () => {
  assert.deepEqual(hexToRgb('#000000'), { r: 0, g: 0, b: 0 });
  assert.deepEqual(hexToRgb('#FFFFFF'), { r: 255, g: 255, b: 255 });
  assert.deepEqual(hexToRgb('#fff'), { r: 255, g: 255, b: 255 });
  assert.deepEqual(hexToRgb('8B5CF6'), { r: 139, g: 92, b: 246 });
  assert.equal(hexToRgb('invalid'), null);
});

test('getRelativeLuminance accurately calculates WCAG 2.2 luminance', () => {
  const blackLum = getRelativeLuminance(0, 0, 0);
  const whiteLum = getRelativeLuminance(255, 255, 255);
  assert.equal(blackLum, 0);
  assert.equal(whiteLum, 1);
});

test('getContrastRatio computes accurate ratio for standard combinations', () => {
  // Pure black on pure white has maximum contrast 21:1
  const blackWhite = getContrastRatio('#000000', '#FFFFFF');
  assert.equal(blackWhite, 21);

  // Same color has 1:1 ratio
  const sameColor = getContrastRatio('#FFFFFF', '#FFFFFF');
  assert.equal(sameColor, 1);

  // High contrast combination
  const studioDarkOnWhite = getContrastRatio('#0B0D12', '#FFFFFF');
  assert.ok(studioDarkOnWhite > 18);
});

test('isColorInverted detects when foreground is brighter than background', () => {
  // Dark foreground on light background is standard (not inverted)
  assert.equal(isColorInverted('#000000', '#FFFFFF'), false);
  assert.equal(isColorInverted('#11141C', '#FFFFFF'), false);

  // Light foreground on dark background is inverted
  assert.equal(isColorInverted('#FFFFFF', '#000000'), true);
  assert.equal(isColorInverted('#E1E5EF', '#11141C'), true);
});
