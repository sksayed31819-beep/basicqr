/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  encodeUrl,
  encodeText,
  encodeEmail,
  encodeWifi,
  encodeVCard,
  encodePhone,
  escapeWifiString,
  escapeVCardValue,
  encodeQrPayload,
} from './encoders.ts';
import type { QrPayloads } from '../../types/editor.ts';

test('URL encoder prepends https:// if missing', () => {
  assert.equal(encodeUrl({ url: 'example.com' }), 'https://example.com');
  assert.equal(encodeUrl({ url: 'http://my-domain.org/path' }), 'http://my-domain.org/path');
  assert.equal(encodeUrl({ url: 'https://secure.io?foo=bar' }), 'https://secure.io?foo=bar');
  assert.equal(encodeUrl({ url: '   sub.domain.net/test  ' }), 'https://sub.domain.net/test');
  assert.equal(encodeUrl({ url: '' }), '');
});

test('Text encoder returns raw content preserved', () => {
  assert.equal(encodeText({ text: 'Hello World 123! @#$' }), 'Hello World 123! @#$');
  assert.equal(encodeText({ text: '' }), '');
});

test('Email encoder creates valid mailto string with query parameters', () => {
  assert.equal(encodeEmail({ to: 'user@example.com' }), 'mailto:user@example.com');
  assert.equal(
    encodeEmail({
      to: 'user@example.com',
      subject: 'Hello Friend',
      body: 'Check this out!',
    }),
    'mailto:user@example.com?subject=Hello%20Friend&body=Check%20this%20out!'
  );
  assert.equal(encodeEmail({ to: '' }), '');
});

test('Wi-Fi encoder creates valid ZXing format and escapes special characters', () => {
  assert.equal(
    escapeWifiString('My;Wi-Fi:Pass,word"\\test'),
    'My\\;Wi-Fi\\:Pass\\,word\\"\\\\test'
  );

  const wifiNormal = encodeWifi({
    ssid: 'Office_Guest',
    password: 'secretPassword',
    encryption: 'WPA',
    hidden: false,
  });
  assert.equal(wifiNormal, 'WIFI:S:Office_Guest;T:WPA;P:secretPassword;;');

  const wifiOpen = encodeWifi({
    ssid: 'PublicLibrary',
    encryption: 'nopass',
  });
  assert.equal(wifiOpen, 'WIFI:S:PublicLibrary;T:nopass;;');

  assert.equal(encodeWifi({ ssid: '', encryption: 'WPA' }), '');
});

test('vCard 3.0 encoder generates compliant RFC 2426 format', () => {
  assert.equal(escapeVCardValue('Smith, Jr.; John\nCEO'), 'Smith\\, Jr.\\; John\\nCEO');

  const vcard = encodeVCard({
    firstName: 'Jane',
    lastName: 'Doe',
    organization: 'Acme Corp',
    title: 'Senior Engineer',
    phoneMobile: '+1 555-0199',
    phoneWork: '+1 555-0100',
    email: 'jane.doe@acme.com',
    url: 'acme.com/jane',
  });

  assert.match(vcard, /^BEGIN:VCARD\r?\nVERSION:3\.0/);
  assert.match(vcard, /N:Doe;Jane;;;/);
  assert.match(vcard, /FN:Jane Doe/);
  assert.match(vcard, /ORG:Acme Corp/);
  assert.match(vcard, /TITLE:Senior Engineer/);
  assert.match(vcard, /END:VCARD$/);
});

test('Phone and WhatsApp encoder generates correct protocols', () => {
  const tel = encodePhone({
    protocol: 'tel',
    countryCode: '+1',
    phoneNumber: '555-123-4567',
  });
  assert.equal(tel, 'tel:+15551234567');

  const wa = encodePhone({
    protocol: 'whatsapp',
    countryCode: '+1',
    phoneNumber: '555 123 4567',
    whatsappMessage: 'Hello, I scanned your QR code!',
  });
  assert.equal(
    wa,
    'https://wa.me/15551234567?text=Hello%2C%20I%20scanned%20your%20QR%20code!'
  );
});

test('encodeQrPayload dispatches correctly for all 6 types', () => {
  const samplePayloads: QrPayloads = {
    url: { url: 'https://test.dev' },
    text: { text: 'Testing dispatcher' },
    wifi: { ssid: 'DispatchNet', encryption: 'WPA' },
    vcard: { firstName: 'Bob', lastName: 'Builder' },
    email: { to: 'test@dispatch.org' },
    phone: { protocol: 'tel', countryCode: '+1', phoneNumber: '5550001' },
  };

  assert.equal(encodeQrPayload('url', samplePayloads), 'https://test.dev');
  assert.equal(encodeQrPayload('text', samplePayloads), 'Testing dispatcher');
  assert.equal(encodeQrPayload('wifi', samplePayloads), 'WIFI:S:DispatchNet;T:WPA;;');
  assert.match(encodeQrPayload('vcard', samplePayloads), /FN:Bob Builder/);
  assert.equal(encodeQrPayload('email', samplePayloads), 'mailto:test@dispatch.org');
  assert.equal(encodeQrPayload('phone', samplePayloads), 'tel:+15550001');
});
