/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  QrDataType,
  QrPayloads,
  UrlData,
  TextData,
  WifiData,
  VCardData,
  VCardAddress,
  EmailData,
  PhoneData,
} from '../../types/editor.ts';

/**
 * Escapes special characters for ZXing Wi-Fi format:
 * Backslash (\), Semicolon (;), Comma (,), Colon (:), and Double Quote (")
 */
export function escapeWifiString(value: string): string {
  return value.replace(/([\\;,:"'])/g, '\\$1');
}

/**
 * Escapes characters for vCard 3.0 fields according to RFC 2426.
 * Specifically escapes backslashes (\), semicolons (;), commas (,), and newlines (\n).
 */
export function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Normalizes and formats URL strings.
 * Prepends https:// if no protocol scheme exists.
 */
export function encodeUrl(data: UrlData): string {
  const trimmed = data.url.trim();
  if (!trimmed) {
    return '';
  }

  // Check if string already starts with a protocol scheme (e.g. http://, https://, ftp://, etc.)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

/**
 * Encodes plain text.
 */
export function encodeText(data: TextData): string {
  return data.text;
}

/**
 * Encodes Wi-Fi credentials into standard ZXing barcode format.
 * Format: WIFI:S:<ssid>;T:<enc>;P:<password>;H:<hidden>;;
 */
export function encodeWifi(data: WifiData): string {
  const ssid = data.ssid.trim();
  if (!ssid) {
    return '';
  }

  const encType = data.encryption || 'WPA';
  const parts: string[] = [];

  // SSID (escaped)
  parts.push(`S:${escapeWifiString(ssid)}`);

  // Encryption type
  parts.push(`T:${encType}`);

  // Password (only when encryption is not 'nopass' and password is provided)
  if (encType !== 'nopass' && data.password !== undefined && data.password.length > 0) {
    parts.push(`P:${escapeWifiString(data.password)}`);
  }

  // Hidden network flag
  if (data.hidden) {
    parts.push('H:true');
  }

  return `WIFI:${parts.join(';')};;`;
}

/**
 * Formats an address into standard vCard ADR format.
 * ADR;TYPE=WORK:;;Street;City;State;Zip;Country
 */
function formatVCardAddress(address?: VCardAddress): string | null {
  if (!address) return null;
  const { street = '', city = '', state = '', zip = '', country = '' } = address;

  if (!street && !city && !state && !zip && !country) {
    return null;
  }

  const parts = [
    '', // PO Box
    '', // Extended Address
    escapeVCardValue(street.trim()),
    escapeVCardValue(city.trim()),
    escapeVCardValue(state.trim()),
    escapeVCardValue(zip.trim()),
    escapeVCardValue(country.trim()),
  ];

  return `ADR;TYPE=WORK:${parts.join(';')}`;
}

/**
 * Encodes Contact information into standard vCard 3.0 format (RFC 2426).
 */
export function encodeVCard(data: VCardData): string {
  const firstName = data.firstName?.trim() || '';
  const lastName = data.lastName?.trim() || '';

  // Minimal check: if no identifying info exists, return empty
  if (
    !firstName &&
    !lastName &&
    !data.organization?.trim() &&
    !data.phoneMobile?.trim() &&
    !data.email?.trim()
  ) {
    return '';
  }

  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  // Structured Name: N:LastName;FirstName;Middle;Prefix;Suffix
  lines.push(`N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`);

  // Formatted Name: FN:FirstName LastName
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || data.organization?.trim() || 'Contact';
  lines.push(`FN:${escapeVCardValue(fullName)}`);

  if (data.organization && data.organization.trim()) {
    lines.push(`ORG:${escapeVCardValue(data.organization.trim())}`);
  }

  if (data.title && data.title.trim()) {
    lines.push(`TITLE:${escapeVCardValue(data.title.trim())}`);
  }

  if (data.phoneMobile && data.phoneMobile.trim()) {
    lines.push(`TEL;TYPE=CELL,VOICE:${escapeVCardValue(data.phoneMobile.trim())}`);
  }

  if (data.phoneWork && data.phoneWork.trim()) {
    lines.push(`TEL;TYPE=WORK,VOICE:${escapeVCardValue(data.phoneWork.trim())}`);
  }

  if (data.email && data.email.trim()) {
    lines.push(`EMAIL;TYPE=PREF,INTERNET:${escapeVCardValue(data.email.trim())}`);
  }

  if (data.url && data.url.trim()) {
    const trimmedUrl = data.url.trim();
    const formattedUrl = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;
    lines.push(`URL:${escapeVCardValue(formattedUrl)}`);
  }

  const formattedAddress = formatVCardAddress(data.address);
  if (formattedAddress) {
    lines.push(formattedAddress);
  }

  if (data.note && data.note.trim()) {
    lines.push(`NOTE:${escapeVCardValue(data.note.trim())}`);
  }

  lines.push('END:VCARD');

  return lines.join('\n');
}

/**
 * Encodes Email payload into RFC 6068 mailto URI.
 * Example: mailto:hello@example.com?subject=Inquiry&body=Hello
 */
export function encodeEmail(data: EmailData): string {
  const to = data.to.trim();
  if (!to) {
    return '';
  }

  const params: string[] = [];

  if (data.subject && data.subject.trim()) {
    params.push(`subject=${encodeURIComponent(data.subject.trim())}`);
  }

  if (data.body && data.body.trim()) {
    params.push(`body=${encodeURIComponent(data.body.trim())}`);
  }

  if (data.cc && data.cc.trim()) {
    params.push(`cc=${encodeURIComponent(data.cc.trim())}`);
  }

  if (data.bcc && data.bcc.trim()) {
    params.push(`bcc=${encodeURIComponent(data.bcc.trim())}`);
  }

  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${to}${query}`;
}

/**
 * Encodes Phone / WhatsApp data.
 * - For WhatsApp: https://wa.me/<digits>?text=<encoded_text>
 * - For Tel: tel:<digits_or_plus>
 */
export function encodePhone(data: PhoneData): string {
  const rawNumber = `${data.countryCode}${data.phoneNumber}`.trim();
  const digitsOnly = rawNumber.replace(/\D/g, '');

  if (!digitsOnly) {
    return '';
  }

  if (data.protocol === 'whatsapp') {
    const base = `https://wa.me/${digitsOnly}`;
    if (data.whatsappMessage && data.whatsappMessage.trim()) {
      return `${base}?text=${encodeURIComponent(data.whatsappMessage.trim())}`;
    }
    return base;
  }

  // Default to standard tel: URI format
  const formattedTel = rawNumber.startsWith('+') ? `+${digitsOnly}` : digitsOnly;
  return `tel:${formattedTel}`;
}

/**
 * Master dispatcher that encodes any supported payload based on selected data type.
 */
export function encodeQrPayload(type: QrDataType, payloads: QrPayloads): string {
  switch (type) {
    case 'url':
      return encodeUrl(payloads.url);
    case 'text':
      return encodeText(payloads.text);
    case 'wifi':
      return encodeWifi(payloads.wifi);
    case 'vcard':
      return encodeVCard(payloads.vcard);
    case 'email':
      return encodeEmail(payloads.email);
    case 'phone':
      return encodePhone(payloads.phone);
    default:
      return '';
  }
}
