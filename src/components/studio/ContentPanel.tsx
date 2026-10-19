/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe,
  Wifi,
  Contact,
  FileText,
  Mail,
  PhoneCall,
  MessageSquare,
  Eye,
  EyeOff,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useEditorStore } from '../../stores/editor-store.ts';
import type { QrDataType, WifiEncryption } from '../../types/editor.ts';

const DATA_TYPES: { id: QrDataType; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { id: 'url', label: 'Website URL', icon: Globe, desc: 'Websites, links, blogs' },
  { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi, desc: 'One-tap router join' },
  { id: 'vcard', label: 'vCard 3.0', icon: Contact, desc: 'Complete contact card' },
  { id: 'text', label: 'Plain Text', icon: FileText, desc: 'Notes, codes, offline' },
  { id: 'email', label: 'Email', icon: Mail, desc: 'Pre-filled mailto' },
  { id: 'phone', label: 'Phone / WhatsApp', icon: PhoneCall, desc: 'Direct dial or chat' },
];

export const ContentPanel: React.FC = () => {
  const {
    dataType,
    payloads,
    setDataType,
    updateUrlPayload,
    updateTextPayload,
    updateWifiPayload,
    updateVCardPayload,
    updateVCardAddress,
    updateEmailPayload,
    updatePhonePayload,
    getEncodedContent,
  } = useEditorStore();

  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [showVCardAddress, setShowVCardAddress] = useState(false);
  const [showEmailCcBcc, setShowEmailCcBcc] = useState(false);
  const [copied, setCopied] = useState(false);

  const rawPayload = getEncodedContent();

  const handleCopyPayload = () => {
    if (!rawPayload) return;
    navigator.clipboard.writeText(rawPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col space-y-5 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold tracking-wider uppercase text-token-secondary">
            QR Data Type
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border studio-border studio-surface text-token-secondary">
            6 Encoders
          </span>
        </div>
        <p className="text-xs text-token-tertiary">
          Select standard payload format to encode into the QR matrix.
        </p>
      </div>

      {/* Data Type Grid Selector */}
      <div className="grid grid-cols-2 gap-2">
        {DATA_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = dataType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setDataType(type.id)}
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-2 border-[var(--accent)] bg-[var(--accent-light)] text-token-primary shadow-xs'
                  : 'studio-border studio-surface hover:border-purple-400/40 text-token-secondary hover:text-token-primary'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  isSelected ? 'bg-purple-600 text-white' : 'studio-surface border studio-border text-token-secondary'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div
                  className={`text-xs truncate ${
                    isSelected ? 'text-token-primary font-bold' : 'text-token-primary font-medium'
                  }`}
                >
                  {type.label}
                </div>
                <div className="text-[10px] text-token-tertiary truncate">{type.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Form Fields Card */}
      <div className="p-4 rounded-2xl studio-surface border studio-border space-y-4">
        {/* 1. URL FORM */}
        {dataType === 'url' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-token-primary flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                Target Website URL
              </label>
              <span className="text-[11px] text-purple-400 font-medium">Auto https://</span>
            </div>
            <input
              type="text"
              value={payloads.url.url}
              onChange={(e) => updateUrlPayload({ url: e.target.value })}
              placeholder="e.g. basicqr.bond or github.com"
              className="w-full px-3 py-2 text-xs studio-panel border studio-border rounded-lg text-token-primary placeholder:text-token-tertiary focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] text-token-tertiary">Quick test:</span>
              <button
                type="button"
                onClick={() => updateUrlPayload({ url: 'https://basicqr.bond' })}
                className="text-[11px] px-2 py-0.5 rounded studio-panel border studio-border text-token-secondary hover:text-token-primary cursor-pointer transition"
              >
                basicqr.bond
              </button>
              <button
                type="button"
                onClick={() => updateUrlPayload({ url: 'wikipedia.org/wiki/QR_code' })}
                className="text-[11px] px-2 py-0.5 rounded studio-panel border studio-border text-token-secondary hover:text-token-primary cursor-pointer transition"
              >
                Wikipedia
              </button>
            </div>
          </div>
        )}

        {/* 2. WI-FI FORM */}
        {dataType === 'wifi' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-token-primary flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-purple-400" />
                Wi-Fi Network Setup (ZXing Protocol)
              </label>
              <span className="text-[11px] text-token-tertiary">Auto-escapes chars</span>
            </div>

            <div>
              <label className="block text-[11px] text-token-secondary mb-1">Network SSID (Name) *</label>
              <input
                type="text"
                value={payloads.wifi.ssid}
                onChange={(e) => updateWifiPayload({ ssid: e.target.value })}
                placeholder="e.g. CoffeeShop_Guest_5G"
                className="w-full px-3 py-2 text-xs studio-panel border studio-border rounded-lg text-token-primary placeholder:text-token-tertiary focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-token-secondary mb-1">Security / Encryption</label>
                <select
                  value={payloads.wifi.encryption}
                  onChange={(e) => updateWifiPayload({ encryption: e.target.value as WifiEncryption })}
                  className="w-full px-2.5 py-2 text-xs studio-panel border studio-border rounded-lg text-token-primary focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="WPA">WPA / WPA2 (Default)</option>
                  <option value="WPA3">WPA3 (Modern)</option>
                  <option value="WEP">WEP (Legacy)</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>

              {payloads.wifi.encryption !== 'nopass' && (
                <div>
                  <label className="block text-[11px] text-token-secondary mb-1">Network Password</label>
                  <div className="relative">
                    <input
                      type={showWifiPassword ? 'text' : 'password'}
                      value={payloads.wifi.password || ''}
                      onChange={(e) => updateWifiPayload({ password: e.target.value })}
                      placeholder="Password..."
                      className="w-full px-3 py-2 pr-8 text-xs studio-panel border studio-border rounded-lg text-token-primary placeholder:text-token-tertiary focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWifiPassword(!showWifiPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-token-secondary hover:text-token-primary cursor-pointer"
                    >
                      {showWifiPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(payloads.wifi.hidden)}
                onChange={(e) => updateWifiPayload({ hidden: e.target.checked })}
                className="w-3.5 h-3.5 rounded studio-border text-purple-600 focus:ring-0 cursor-pointer"
              />
              <span className="text-[11px] text-token-secondary">Hidden Network (SSID broadcast disabled)</span>
            </label>
          </div>
        )}

        {/* 3. VCARD 3.0 FORM */}
        {dataType === 'vcard' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-token-primary flex items-center gap-1.5">
                <Contact className="w-3.5 h-3.5 text-purple-400" />
                Contact Profile (vCard 3.0 RFC 2426)
              </label>
              <span className="text-[11px] text-token-tertiary">Phone address book</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-token-secondary mb-1">First Name *</label>
                <input
                  type="text"
                  value={payloads.vcard.firstName}
                  onChange={(e) => updateVCardPayload({ firstName: e.target.value })}
                  placeholder="e.g. Alex"
                  className="w-full px-2.5 py-1.5 text-xs studio-panel border studio-border rounded-lg text-token-primary focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-token-secondary mb-1">Last Name</label>
                <input
                  type="text"
                  value={payloads.vcard.lastName || ''}
                  onChange={(e) => updateVCardPayload({ lastName: e.target.value })}
                  placeholder="e.g. Morgan"
                  className="w-full px-2.5 py-1.5 text-xs studio-panel border studio-border rounded-lg text-token-primary focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-token-secondary mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={payloads.vcard.organization || ''}
                  onChange={(e) => updateVCardPayload({ organization: e.target.value })}
                  placeholder="Studio Lab"
                  className="w-full px-2.5 py-1.5 text-xs studio-panel border studio-border rounded-lg text-token-primary focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-token-secondary mb-1">Job Title</label>
                <input
                  type="text"
                  value={payloads.vcard.title || ''}
                  onChange={(e) => updateVCardPayload({ title: e.target.value })}
                  placeholder="Design Lead"
                  className="w-full px-2.5 py-1.5 text-xs studio-panel border studio-border rounded-lg text-token-primary focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-token-secondary mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  value={payloads.vcard.phoneMobile || ''}
                  onChange={(e) => updateVCardPayload({ phoneMobile: e.target.value })}
                  placeholder="+1 (555) 012-3456"
                  className="w-full px-2.5 py-1.5 text-xs studio-panel border studio-border rounded-lg text-token-primary focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-token-secondary mb-1">Email Address</label>
                <input
                  type="email"
                  value={payloads.vcard.email || ''}
                  onChange={(e) => updateVCardPayload({ email: e.target.value })}
                  placeholder="alex@domain.com"
                  className="w-full px-2.5 py-1.5 text-xs studio-panel border studio-border rounded-lg text-token-primary focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowVCardAddress(!showVCardAddress)}
              className="text-[11px] text-purple-500 hover:text-purple-400 font-medium inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              {showVCardAddress ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showVCardAddress ? 'Hide Address & Notes' : 'Add Physical Address, Website & Notes'}
            </button>

            {showVCardAddress && (
              <div className="p-3 studio-panel rounded-xl border studio-border space-y-2.5">
                <div>
                  <label className="block text-[10px] text-token-secondary mb-0.5">Website URL</label>
                  <input
                    type="text"
                    value={payloads.vcard.url || ''}
                    onChange={(e) => updateVCardPayload({ url: e.target.value })}
                    placeholder="https://mysite.com"
                    className="w-full px-2.5 py-1.5 text-xs studio-surface border studio-border rounded text-token-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-token-secondary mb-0.5">Street Address</label>
                  <input
                    type="text"
                    value={payloads.vcard.address?.street || ''}
                    onChange={(e) => updateVCardAddress({ street: e.target.value })}
                    placeholder="123 Market St, Suite 400"
                    className="w-full px-2.5 py-1.5 text-xs studio-surface border studio-border rounded text-token-primary"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={payloads.vcard.address?.city || ''}
                    onChange={(e) => updateVCardAddress({ city: e.target.value })}
                    placeholder="City"
                    className="w-full px-2 py-1 text-xs studio-surface border studio-border rounded text-token-primary"
                  />
                  <input
                    type="text"
                    value={payloads.vcard.address?.state || ''}
                    onChange={(e) => updateVCardAddress({ state: e.target.value })}
                    placeholder="State"
                    className="w-full px-2 py-1 text-xs studio-surface border studio-border rounded text-token-primary"
                  />
                  <input
                    type="text"
                    value={payloads.vcard.address?.country || ''}
                    onChange={(e) => updateVCardAddress({ country: e.target.value })}
                    placeholder="Country"
                    className="w-full px-2 py-1 text-xs studio-surface border studio-border rounded text-token-primary"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. PLAIN TEXT FORM */}
        {dataType === 'text' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-token-primary flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                Raw UTF-8 Plain Text
              </label>
              <span className="text-[11px] text-token-tertiary font-mono">
                {payloads.text.text.length} chars
              </span>
            </div>
            <textarea
              rows={5}
              value={payloads.text.text}
              onChange={(e) => updateTextPayload({ text: e.target.value })}
              placeholder="Enter message, coupon token, instructions, or offline data..."
              className="w-full px-3 py-2 text-xs studio-panel border studio-border rounded-lg text-token-primary placeholder:text-token-tertiary focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
        )}

        {/* 5. EMAIL FORM */}
        {dataType === 'email' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-token-primary flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                Email Pre-fill (RFC 6068 mailto:)
              </label>
              <span className="text-[11px] text-token-tertiary">Direct mail client</span>
            </div>

            <div>
              <label className="block text-[11px] text-token-secondary mb-1">To: Recipient Email *</label>
              <input
                type="email"
                value={payloads.email.to}
                onChange={(e) => updateEmailPayload({ to: e.target.value })}
                placeholder="contact@business.com"
                className="w-full px-3 py-2 text-xs studio-panel border studio-border rounded-lg text-token-primary focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-token-secondary mb-1">Subject</label>
              <input
                type="text"
                value={payloads.email.subject || ''}
                onChange={(e) => updateEmailPayload({ subject: e.target.value })}
                placeholder="e.g. Question regarding service"
                className="w-full px-3 py-2 text-xs studio-panel border studio-border rounded-lg text-token-primary focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-token-secondary mb-1">Email Body</label>
              <textarea
                rows={3}
                value={payloads.email.body || ''}
                onChange={(e) => updateEmailPayload({ body: e.target.value })}
                placeholder="Draft message for sender..."
                className="w-full px-3 py-2 text-xs studio-panel border studio-border rounded-lg text-token-primary focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowEmailCcBcc(!showEmailCcBcc)}
              className="text-[11px] text-purple-500 hover:text-purple-400 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              {showEmailCcBcc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showEmailCcBcc ? 'Hide CC / BCC' : 'Show CC / BCC Options'}
            </button>

            {showEmailCcBcc && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] text-token-secondary mb-0.5">CC</label>
                  <input
                    type="text"
                    value={payloads.email.cc || ''}
                    onChange={(e) => updateEmailPayload({ cc: e.target.value })}
                    placeholder="cc@domain.com"
                    className="w-full px-2.5 py-1.5 text-xs studio-panel border studio-border rounded text-token-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-token-secondary mb-0.5">BCC</label>
                  <input
                    type="text"
                    value={payloads.email.bcc || ''}
                    onChange={(e) => updateEmailPayload({ bcc: e.target.value })}
                    placeholder="bcc@domain.com"
                    className="w-full px-2.5 py-1.5 text-xs studio-panel border studio-border rounded text-token-primary"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. PHONE / WHATSAPP FORM */}
        {dataType === 'phone' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-token-primary flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-purple-400" />
                Phone & WhatsApp Messaging
              </label>
              <div className="flex studio-panel p-0.5 rounded-lg border studio-border">
                <button
                  type="button"
                  onClick={() => updatePhonePayload({ protocol: 'whatsapp' })}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                    payloads.phone.protocol === 'whatsapp'
                      ? 'bg-emerald-600 text-white'
                      : 'text-token-secondary hover:text-token-primary'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => updatePhonePayload({ protocol: 'tel' })}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                    payloads.phone.protocol === 'tel'
                      ? 'bg-purple-600 text-white'
                      : 'text-token-secondary hover:text-token-primary'
                  }`}
                >
                  Telephone
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-token-secondary mb-1">Country Code</label>
                <input
                  type="text"
                  value={payloads.phone.countryCode}
                  onChange={(e) => updatePhonePayload({ countryCode: e.target.value })}
                  placeholder="+1"
                  className="w-full px-2.5 py-2 text-xs studio-panel border studio-border rounded-lg text-token-primary font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] text-token-secondary mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={payloads.phone.phoneNumber}
                  onChange={(e) => updatePhonePayload({ phoneNumber: e.target.value })}
                  placeholder="5551234567"
                  className="w-full px-3 py-2 text-xs studio-panel border studio-border rounded-lg text-token-primary font-mono"
                />
              </div>
            </div>

            {payloads.phone.protocol === 'whatsapp' && (
              <div>
                <label className="block text-[11px] text-token-secondary mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-emerald-500" />
                  Pre-filled WhatsApp Message (Optional)
                </label>
                <textarea
                  rows={3}
                  value={payloads.phone.whatsappMessage || ''}
                  onChange={(e) => updatePhonePayload({ whatsappMessage: e.target.value })}
                  placeholder="Hi there! I saw your QR code and wanted to connect..."
                  className="w-full px-3 py-2 text-xs studio-panel border studio-border rounded-lg text-token-primary focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Encoded Payload Box */}
      <div className="p-3.5 rounded-xl studio-surface border studio-border space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-token-primary">Live Encoded Payload</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-token-tertiary">
              {new TextEncoder().encode(rawPayload).length} bytes
            </span>
            <button
              type="button"
              onClick={handleCopyPayload}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] studio-panel border studio-border hover:bg-purple-600/10 text-token-secondary hover:text-token-primary transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="p-2.5 rounded studio-panel border studio-border font-mono text-[11px] text-emerald-500 break-all select-all max-h-24 overflow-y-auto">
          {rawPayload || '// Empty payload'}
        </div>
      </div>
    </div>
  );
};
