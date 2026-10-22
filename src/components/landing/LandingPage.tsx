/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Contact,
  Download,
  FileText,
  Globe,
  Lock,
  Mail,
  Palette,
  PhoneCall,
  Printer,
  ScanLine,
  Sparkles,
  Wifi,
} from 'lucide-react';
import { useEditorStore } from '../../stores/editor-store.ts';
import { useUiStore } from '../../stores/ui-store.ts';
import type { QrDataType } from '../../types/editor.ts';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is Basic QR really free?',
    a: 'Yes. Standard 512px PNG downloads are always free and need no ads. For 4K PNG, vector SVG and print-ready PDF, you complete a short 15-second sponsor break, which unlocks 2 high-resolution downloads for 20 minutes. There is no sign-up and no credit card.',
  },
  {
    q: 'Do the QR codes expire?',
    a: 'No. Basic QR creates static QR codes. Your content is encoded directly into the code, so there is no redirect service that could expire or be switched off.',
  },
  {
    q: 'Is my data private?',
    a: 'Your QR content is generated in your browser. We do not upload the links, Wi-Fi passwords or contact details you type into the studio.',
  },
  {
    q: 'Which export formats are available?',
    a: 'You can export PNG (standard and 4K), scalable vector SVG for print and design software, and a print-ready PDF.',
  },
  {
    q: 'Can I add my logo and brand colors?',
    a: 'Yes. Upload a logo, choose its shape, pick colors and gradients, change dot and corner styles, and add a frame with your own call-to-action text. The scan check updates live as you design.',
  },
  {
    q: 'How do I make sure my QR code scans reliably?',
    a: 'Keep strong contrast between the dots and the background, leave a clear margin around the code, and keep the logo small. Basic QR runs a live decode test and shows a contrast rating, but always test the final print with a real phone.',
  },
  {
    q: 'What can I put in a QR code?',
    a: 'Website links, Wi-Fi network details, contact cards (vCard), plain text, pre-filled emails, and phone or WhatsApp numbers.',
  },
];

const TYPES: { type: QrDataType; icon: React.ElementType; title: string; text: string }[] = [
  { type: 'url', icon: Globe, title: 'Website URL', text: 'Links, landing pages, menus' },
  { type: 'wifi', icon: Wifi, title: 'Wi-Fi network', text: 'One-tap network join' },
  { type: 'vcard', icon: Contact, title: 'vCard contact', text: 'Digital business card' },
  { type: 'text', icon: FileText, title: 'Plain text', text: 'Notes, codes, short messages' },
  { type: 'email', icon: Mail, title: 'Email', text: 'Pre-filled subject and body' },
  { type: 'phone', icon: PhoneCall, title: 'Phone / WhatsApp', text: 'Direct call or chat' },
];

/** Small seeded random generator so the decorative QR art is stable between renders. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Decorative QR-style artwork (not a scannable code). */
const QrArt: React.FC<{ seed: number; from: string; to: string }> = ({ seed, from, to }) => {
  const gid = 'qa' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const n = 25;
  const rand = mulberry32(seed);
  const inFinder = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8);

  const dots: React.ReactElement[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (inFinder(r, c)) continue;
      if (rand() > 0.5) {
        dots.push(<rect key={r + '-' + c} x={c + 0.1} y={r + 0.1} width={0.8} height={0.8} rx={0.32} />);
      }
    }
  }

  const finder = (x: number, y: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      <rect x={0.6} y={0.6} width={5.8} height={5.8} rx={1.7} fill="none" strokeWidth={1.2} stroke={`url(#${gid})`} />
      <rect x={2.1} y={2.1} width={2.8} height={2.8} rx={0.9} />
    </g>
  );

  return (
    <svg viewBox={`0 0 ${n} ${n}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={n} y2={n}>
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <g fill={`url(#${gid})`}>
        {dots}
        {finder(0, 0, 'tl')}
        {finder(n - 7, 0, 'tr')}
        {finder(0, n - 7, 'bl')}
      </g>
    </svg>
  );
};

function scrollToStudio() {
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export const LandingPage: React.FC = () => {
  const setDataType = useEditorStore((s) => s.setDataType);
  const { setActiveRailTab, setIsLegalModalOpen, setIsGuidesModalOpen } = useUiStore();

  const startWithType = (type: QrDataType) => {
    setDataType(type);
    setActiveRailTab('content');
    scrollToStudio();
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="lp" id="learn">
      <a className="lp-cue" href="#overview">
        <span>
          <b>Free</b> · No sign-up · Runs in your browser
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Learn more <ArrowDown size={14} aria-hidden="true" />
        </span>
      </a>

      {/* HERO */}
      <section className="lp-hero" id="overview">
        <div className="lp-wrap">
          <div className="lp-badge">
            <i aria-hidden="true" />
            Free QR code studio
          </div>
          <h1 className="lp-h1">
            The free QR code generator for <span className="lp-grad-text">4K, SVG and print.</span>
          </h1>
          <p className="lp-lead">
            Design a QR code that matches your brand and scans every time. Add your logo, pick your colors, check
            it live and download it in the quality you need.
          </p>
          <div className="lp-actions">
            <button type="button" className="lp-btn lp-btn-primary" onClick={scrollToStudio}>
              Create your QR code <ArrowRight size={18} aria-hidden="true" />
            </button>
            <a className="lp-btn lp-btn-ghost" href="#how">
              See how it works
            </a>
          </div>
          <p className="lp-micro">No sign-up · No expiry on your codes · Your content stays in your browser</p>

          <div className="lp-showcase">
            <div className="lp-qrcard left">
              <QrArt seed={11} from="#0ea5e9" to="#2563eb" />
              <span>WI-FI</span>
            </div>
            <div className="lp-qrcard mid">
              <QrArt seed={7} from="#2563eb" to="#7c3aed" />
              <span>SCAN ME</span>
            </div>
            <div className="lp-qrcard right">
              <QrArt seed={23} from="#7c3aed" to="#db2777" />
              <span>VCARD</span>
            </div>
          </div>
        </div>
      </section>

      {/* FORMAT STRIP */}
      <section style={{ paddingBottom: 8 }}>
        <div className="lp-wrap">
          <div className="lp-strip">
            <div>
              <b>4K PNG</b>
              <span>Sharp on any screen</span>
            </div>
            <div>
              <b>Vector SVG</b>
              <span>Scales without limits</span>
            </div>
            <div>
              <b>Print PDF</b>
              <span>A4, clean margins</span>
            </div>
            <div>
              <b>15 presets</b>
              <span>One-click designs</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-section" id="features">
        <div className="lp-wrap">
          <div className="lp-head">
            <span className="lp-kicker">Why Basic QR</span>
            <h2 className="lp-h2">Everything you need for a QR code people actually scan</h2>
            <p className="lp-sub">A focused design studio. Build it, check it, export it.</p>
          </div>
          <div className="lp-bento">
            <article className="lp-card glow lp-span2">
              <div className="lp-ico">
                <Download size={22} aria-hidden="true" />
              </div>
              <h3>Export in the format your job needs</h3>
              <p>
                Download a 4K PNG for screens, a scalable SVG for printers and designers, or an A4 PDF ready for
                flyers, stickers, menus and table tents.
              </p>
              <div className="lp-chips">
                <span>PNG 4K</span>
                <span>SVG vector</span>
                <span>PDF A4</span>
                <span>Standard PNG free</span>
              </div>
            </article>
            <article className="lp-card">
              <div className="lp-ico">
                <ScanLine size={22} aria-hidden="true" />
              </div>
              <h3>Live scan check</h3>
              <p>See a real decode test and a contrast rating while you design, before you print anything.</p>
            </article>
            <article className="lp-card">
              <div className="lp-ico">
                <Palette size={22} aria-hidden="true" />
              </div>
              <h3>Your brand, your style</h3>
              <p>Custom colors, gradients, dot and corner shapes, logos and frames with your own call to action.</p>
            </article>
            <article className="lp-card">
              <div className="lp-ico">
                <Sparkles size={22} aria-hidden="true" />
              </div>
              <h3>15 ready-made presets</h3>
              <p>Start from a polished design for cafes, events, business cards and more, then make it yours.</p>
            </article>
            <article className="lp-card">
              <div className="lp-ico">
                <Lock size={22} aria-hidden="true" />
              </div>
              <h3>Private by design</h3>
              <p>Your QR content is generated in your browser. No account is needed to create or download.</p>
            </article>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-section" id="how" style={{ paddingTop: 8 }}>
        <div className="lp-wrap">
          <div className="lp-head">
            <span className="lp-kicker">How it works</span>
            <h2 className="lp-h2">Make a QR code in three steps</h2>
            <p className="lp-sub">It takes about a minute.</p>
          </div>
          <div className="lp-steps">
            <div className="lp-step">
              <b>01</b>
              <h3>Choose what to encode</h3>
              <p>Pick a link, Wi-Fi, contact card, email, phone number or plain text and fill in the details.</p>
            </div>
            <div className="lp-step">
              <b>02</b>
              <h3>Style it</h3>
              <p>Change colors, shapes and frame, add your logo, or start from one of the presets.</p>
            </div>
            <div className="lp-step">
              <b>03</b>
              <h3>Check and export</h3>
              <p>Watch the live scan check, then download PNG, SVG or PDF in the quality you need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TYPES */}
      <section className="lp-section" id="types" style={{ paddingTop: 8 }}>
        <div className="lp-wrap">
          <div className="lp-head">
            <span className="lp-kicker">QR code types</span>
            <h2 className="lp-h2">Pick a type and start designing</h2>
            <p className="lp-sub">Tap a type to jump back into the studio with it selected.</p>
          </div>
          <div className="lp-types">
            {TYPES.map(({ type, icon: Icon, title, text }) => (
              <button type="button" className="lp-type" key={type} onClick={() => startWithType(type)}>
                <span className="lp-ico">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="lp-type-text">
                  <strong>{title}</strong>
                  <span>{text}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="lp-section" style={{ paddingTop: 8 }}>
        <div className="lp-wrap">
          <div className="lp-priv">
            <div>
              <h2>Your content stays in your browser</h2>
              <p>
                Basic QR makes static QR codes. What you type is encoded directly into the code, so nothing can
                expire and nobody sits in the middle of your link.
              </p>
              <ul className="lp-checks">
                {[
                  'Static codes with no redirect and no expiry',
                  'No account needed to create or download',
                  'Standard PNG downloads are always free',
                ].map((t) => (
                  <li key={t}>
                    <Check size={16} aria-hidden="true" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <button type="button" className="lp-btn lp-btn-ghost" onClick={() => setIsLegalModalOpen(true)}>
                Read the privacy details
              </button>
            </div>
            <div className="lp-stats">
              <div className="lp-stat">
                <b>0</b>
                <span>Sign-ups needed</span>
              </div>
              <div className="lp-stat">
                <b>3</b>
                <span>Export formats: PNG, SVG, PDF</span>
              </div>
              <div className="lp-stat">
                <b>15</b>
                <span>Ready-made design presets</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-section" id="faq">
        <div className="lp-wrap">
          <div className="lp-head">
            <span className="lp-kicker">FAQ</span>
            <h2 className="lp-h2">Frequently asked questions</h2>
          </div>
          <div className="lp-faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <ChevronDown size={20} aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ paddingBottom: 56 }}>
        <div className="lp-wrap">
          <div className="lp-final">
            <h2>Ready to make your QR code?</h2>
            <p>Free, private and ready in a minute.</p>
            <button type="button" className="lp-btn lp-btn-white" onClick={scrollToStudio}>
              Open the studio <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-wrap">
          <div className="lp-footer-grid">
            <div>
              <span className="lp-brand">
                <img src="/logo-mark.png" alt="" width="40" height="40" loading="lazy" />
                <span>Basic QR</span>
              </span>
              <p>Free QR code studio for 4K PNG, vector SVG and print-ready PDF.</p>
            </div>
            <div>
              <h4>Product</h4>
              <ul>
                <li>
                  <button type="button" className="lp-link" onClick={scrollToStudio}>
                    Create a QR code
                  </button>
                </li>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#how">How it works</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Help</h4>
              <ul>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <button type="button" className="lp-link" onClick={() => setIsGuidesModalOpen(true)}>
                    Guides
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul>
                <li>
                  <button type="button" className="lp-link" onClick={() => setIsLegalModalOpen(true)}>
                    Privacy and terms
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="lp-legal">
            <span>© 2026 Basic QR · basicqr.bond</span>
            <span>Generated in your browser</span>
          </div>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
};
