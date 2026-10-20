/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  X,
  Lock,
  FileText,
  Cookie,
  Info,
  CheckCircle2,
  ExternalLink,
  Mail,
  Cpu,
} from 'lucide-react';
import { useUiStore } from '../../stores/ui-store.ts';
import type { LegalTab } from '../../types/editor.ts';

interface LegalComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalComplianceModal: React.FC<LegalComplianceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeLegalTab, setActiveLegalTab, setIsGuidesModalOpen } = useUiStore();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="studio-panel border studio-border rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col text-token-primary shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b studio-border flex items-center justify-between gap-3 shrink-0 bg-slate-900/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2
                id="legal-modal-title"
                className="font-heading font-bold text-base sm:text-lg tracking-tight text-token-primary truncate"
              >
                Legal Compliance &amp; Zero-Server Privacy
              </h2>
              <p className="text-xs text-token-tertiary hidden sm:block">
                Transparent privacy disclosures, client-side data guarantee, and commercial terms
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal modal"
            className="w-8 h-8 rounded-lg hover:bg-slate-800/60 text-token-secondary hover:text-token-primary flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 py-2 sm:px-6 border-b border-[var(--border)] flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[var(--surface-bg)] shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveLegalTab('privacy')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeLegalTab === 'privacy'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-token-secondary hover:text-token-primary hover:bg-[var(--surface-hover)] border border-[var(--border)]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLegalTab('terms')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeLegalTab === 'terms'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-token-secondary hover:text-token-primary hover:bg-[var(--surface-hover)] border border-[var(--border)]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Use</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLegalTab('ads')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeLegalTab === 'ads'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-token-secondary hover:text-token-primary hover:bg-[var(--surface-hover)] border border-[var(--border)]'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>Advertising &amp; Cookies</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLegalTab('about')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeLegalTab === 'about'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-token-secondary hover:text-token-primary hover:bg-[var(--surface-hover)] border border-[var(--border)]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About &amp; Architecture</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 studio-scroll text-xs sm:text-sm text-token-secondary leading-relaxed">
          {/* ========================================================== */}
          {/* TAB 1: PRIVACY POLICY */}
          {/* ========================================================== */}
          {activeLegalTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-token-primary space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>The 100% Client-Side Privacy Guarantee</span>
                </div>
                <p className="text-xs text-token-secondary">
                  Basic QR is engineered as a zero-telemetry, client-side web application. Every QR matrix calculation, Wi-Fi password encoding, vCard assembly, logo mask, raster canvas rendering, and vector SVG generation happens exclusively inside your browser's local sandbox memory.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-token-primary">
                  1. Information We Do NOT Collect
                </h3>
                <p>
                  Unlike traditional dynamic QR code generators, Basic QR does not have a backend database for user content:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>We never transmit, log, or store the URLs, links, or text you enter.</li>
                  <li>We never see, transmit, or cache your Wi-Fi network names (SSID) or encryption passwords.</li>
                  <li>We never store vCard contact names, phone numbers, email addresses, or physical street addresses.</li>
                  <li>We never upload your custom uploaded logos or branding icons to any cloud storage or remote server.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-token-primary">
                  2. Local Browser Storage &amp; Session Storage
                </h3>
                <p>
                  Basic QR only uses standard browser storage mechanisms for your convenience:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>
                    <strong className="text-token-primary">sessionStorage:</strong> Used solely to store the ephemeral state of your unlocked 20-minute 4K Export Pass (pass expiry timestamp and 2-download counter). This data automatically self-destructs when you close the browser tab.
                  </li>
                  <li>
                    <strong className="text-token-primary">Theme Preference:</strong> Light/Dark theme selection stored locally in your browser so your preferred view is maintained across visits.
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-token-primary">
                  3. GDPR &amp; CCPA / CPRA Compliance
                </h3>
                <p>
                  Under the European Union General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA/CPRA), users possess the right to access, rectify, and erase personal data. Because Basic QR retains zero personal identifying records on any remote infrastructure, your sensitive data cannot be leaked, compromised, subpoenaed, or monetized.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-token-primary">
                  4. Third-Party Advertising &amp; Network Cookies
                </h3>
                <p>
                  To keep Basic QR completely free for all global users without subscriptions, we partner with reputable digital advertising networks (such as Google AdSense, Google Publisher Tag, Monetag, or Adsterra) to serve non-intrusive rewarded ads. Third-party advertising vendors may place and read cookies on your browser to measure ad delivery. You can opt out of personalized ad targeting via{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    Google Ads Settings
                  </a>{' '}
                  or the{' '}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    Digital Advertising Alliance
                  </a>.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 2: TERMS OF USE */}
          {/* ========================================================== */}
          {activeLegalTab === 'terms' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-token-primary">
                  1. 100% Royalty-Free Commercial &amp; Personal License
                </h3>
                <p>
                  Every QR code, vector SVG file, high-resolution PNG image, and printable PDF sheet generated via Basic QR is your property. We grant you a worldwide, perpetual, royalty-free, irrevocable license to use, reproduce, print, display, distribute, and commercially exploit your generated QR codes for any purpose, including:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Retail product packaging, labels, and consumer goods.</li>
                  <li>Restaurant table tents, menus, bar coasters, and hospitality signs.</li>
                  <li>Business cards, conference flyers, event tickets, and promotional merchandise.</li>
                  <li>Outdoor billboards, transit advertising, posters, and digital marketing materials.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-token-primary">
                  2. Static QR Architecture &amp; Destination Responsibility
                </h3>
                <p>
                  Basic QR codes are static: they encode the destination URL or payload directly into the pattern without routing through a redirect server. Consequently:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Your QR codes will never be disabled, redirected, or held hostage by Basic QR.</li>
                  <li>You are solely responsible for ensuring that the destination URL or contact info you enter remains active, accessible, and compliant with applicable laws.</li>
                  <li>Basic QR cannot edit a printed static QR code once distributed. Always perform test scans with multiple phone cameras before sending designs to mass physical print.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-token-primary">
                  3. Prohibited Use
                </h3>
                <p>
                  You agree not to use the service to create QR codes intended to facilitate malware distribution, phishing attacks, deceitful financial schemes, or content that infringes upon the intellectual property rights of third parties.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-token-primary">
                  4. Disclaimer of Warranties
                </h3>
                <p className="text-xs text-token-tertiary">
                  Basic QR is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from the use of the software.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 3: ADVERTISING & COOKIES */}
          {/* ========================================================== */}
          {activeLegalTab === 'ads' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl studio-surface border studio-border space-y-2">
                <h3 className="font-bold text-sm text-token-primary flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-purple-400" />
                  <span>How Our Free-to-Use Business Model Works</span>
                </h3>
                <p className="text-xs text-token-secondary leading-relaxed">
                  Basic QR was built to counteract predatory QR generator subscriptions that lock user codes behind high monthly paywalls. We provide 100% free studio tools funded transparently by non-intrusive rewarded ads and sponsor breaks.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs text-token-primary">
                  The 20-Minute Export Pass
                </h4>
                <p className="text-xs">
                  When you request an ultra-high-resolution 4K PNG, vector SVG, or 300-DPI print-ready PDF, you are presented with a 15-second sponsor break. Completing this break unlocks an active Pass valid for 20 minutes with 2 free high-resolution downloads. The pass is granted when the countdown ends, whether or not an advertisement was displayed.
                </p>
                <p className="text-xs text-token-tertiary">
                  If you prefer not to view ads, standard 512px PNG downloads are permanently free, instant, and require no ads.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs text-token-primary">
                  Third-Party Ad Networks &amp; Consent
                </h4>
                <p className="text-xs">
                  Basic QR uses Monetag as its advertising partner. The Monetag script is loaded only when you start the export sponsor break, not during normal browsing. We never send your QR content to Monetag. Monetag and other advertising partners may use cookies to serve ads based on user visits to this and other websites. You may manage your cookie preferences through your browser settings or opt-out portals such as:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>
                    <a
                      href="https://youradchoices.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Digital Advertising Alliance (DAA)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youronlinechoices.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>European Interactive Digital Advertising Alliance (EDAA)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 4: ABOUT & ARCHITECTURE */}
          {/* ========================================================== */}
          {activeLegalTab === 'about' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl studio-surface border studio-border space-y-2">
                <h3 className="font-bold text-sm text-token-primary flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>Architecture &amp; Open Source Credits</span>
                </h3>
                <p className="text-xs text-token-secondary leading-relaxed">
                  Basic QR is engineered in TypeScript, React, Tailwind CSS, and HTML5 Canvas. We leverage battle-tested open-source libraries to deliver native-grade client-side rendering speed without server dependencies:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
                  <div className="p-2 rounded border studio-border bg-slate-900/40">
                    qr-code-styling
                  </div>
                  <div className="p-2 rounded border studio-border bg-slate-900/40">
                    jspdf (Vector PDF)
                  </div>
                  <div className="p-2 rounded border studio-border bg-slate-900/40">
                    jsQR (Live Decode)
                  </div>
                  <div className="p-2 rounded border studio-border bg-slate-900/40">
                    file-saver (Blob Save)
                  </div>
                  <div className="p-2 rounded border studio-border bg-slate-900/40">
                    lucide-react (Icons)
                  </div>
                  <div className="p-2 rounded border studio-border bg-slate-900/40">
                    zustand (State Store)
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs text-token-primary">
                  Contact &amp; Publisher Inquiries
                </h4>
                <p className="text-xs text-token-secondary">
                  For suggestions, commercial partnership inquiries, or publisher ad integration questions, contact our developer team:
                </p>
                <div className="p-3 rounded-lg studio-panel border studio-border flex items-center gap-2.5 text-xs">
                  <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="font-mono text-token-primary select-all">
                    sheikhsayed9090@gmail.com
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t studio-border bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-token-tertiary shrink-0">
          <div className="flex items-center gap-2">
            <span>Last Updated: October 2026</span>
            <span>•</span>
            <span>Basic QR Version 2.4</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsGuidesModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg border studio-border hover:bg-slate-800/60 text-token-secondary hover:text-token-primary transition cursor-pointer text-xs"
            >
              Open Guides &amp; FAQ
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition cursor-pointer shadow-sm text-center"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
