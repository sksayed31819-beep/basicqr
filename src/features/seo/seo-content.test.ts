/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { GLOBAL_TEMPLATES } from '../templates/template-catalog.ts';

test('Template Catalog contains essential presets referenced in guides', () => {
  const wifiTemplate = GLOBAL_TEMPLATES.find((t) => t.id === 'guest-wifi-minimal');
  assert.ok(wifiTemplate, 'guest-wifi-minimal template must exist');
  assert.equal(wifiTemplate.defaultDataType, 'wifi');
  assert.ok(wifiTemplate.style.dotColor);

  const restaurantTemplate = GLOBAL_TEMPLATES.find(
    (t) => t.id === 'restaurant-dark-luxury'
  );
  assert.ok(restaurantTemplate, 'restaurant-dark-luxury template must exist');
  assert.equal(restaurantTemplate.frame.style, 'polaroid');
  assert.equal(restaurantTemplate.frame.text, 'VIEW MENU');
});

test('Physical print sizing 10:1 distance rule calculations', () => {
  // Test distance to size: 10:1 ratio
  const calculateMinQrSizeCm = (readingDistanceMeters: number) => {
    // 1 meter = 100cm. At 10:1 ratio, min QR size = 10cm.
    return (readingDistanceMeters * 100) / 10;
  };

  assert.equal(calculateMinQrSizeCm(0.5), 5); // 50cm dining table -> 5cm QR code
  assert.equal(calculateMinQrSizeCm(1.0), 10); // 1 meter door sign -> 10cm QR code
  assert.equal(calculateMinQrSizeCm(2.0), 20); // 2 meter poster -> 20cm QR code
});
