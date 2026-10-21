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

const FEATURES = [
  {
    icon: Download,
    title: '4K PNG and vector SVG',
    text: 'Sharp at any size. Export a 4K PNG for screens or a scalable SVG for printers and designers.',
  },
  {
    icon: Printer,
    title: 'Print-ready PDF',
    text: 'Get an A4 PDF with clean margins, ready for flyers, stickers, menus and table tents.',
  },
  {
    icon: Palette,
    title: 'Your brand, your style',
    text: 'Custom colors, gradients, dot shapes, corner styles, logos and frames, plus 15 ready-made presets.',
  },
  {
    icon: ScanLine,
    title: 'Live scan check',
    text: 'See a real decode test and a contrast rating while you design, before you print anything.',
  },
  {
    icon: Lock,
    title: 'Private by design',
    text: 'Your QR content is generated in your browser. No account is needed to create or download.',
  },
  {
    icon: Wifi,
    title: 'More than links',
    text: 'Wi-Fi, contact cards, email, phone, WhatsApp and plain text, all in one studio.',
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
      {/* Scroll cue (sits right under the studio) */}
      <a className="lp-cue" href="#features">
        <span>
          <strong>Free</strong> · No sign-up · Runs in your browser
        </span>
        <span aria-hidden="true">·</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Learn more <ArrowDown size={14} />
        </span>
      </a>

      {/* HERO (dark card) */}
      <div className="lp-wrap">
        <header className="lp-hero">
          <div>
            <p className="lp-eyebrow">Free QR code studio</p>
            <h1 className="lp-h1">Free QR code generator for 4K, SVG and print.</h1>
            <p className="lp-lead">Design a QR code that looks like your brand and scans every time.</p>
            <ul className="lp-checks">
              {[
                'No sign-up and no expiry on your QR codes',
                '4K PNG, vector SVG and print-ready PDF',
                'Logos, colors, frames and 15 design presets',
                'Generated in your browser, so your content stays with you',
              ].map((t) => (
                <li key={t}>
                  <Check size={16} aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="lp-btn lp-btn-coral" onClick={scrollToStudio}>
              Create your QR code <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="lp-hero-art">
            <div className="lp-art-card">
              <img src="/logo-mark.png" alt="Basic QR logo" width="220" height="220" loading="lazy" />
              <div className="lp-art-tags">
                <span>PNG 4K</span>
                <span>SVG</span>
                <span>PDF</span>
                <span>Wi-Fi</span>
                <span>vCard</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* FEATURES (light cards) */}
      <section className="lp-section" id="features" style={{ paddingTop: 64 }}>
        <div className="lp-wrap">
          <div className="lp-center">
            <h2 className="lp-h2">Everything you need for a QR code people actually scan</h2>
            <p className="lp-sub">
              A focused design studio, not a maze of upsells. Build it, check it, export it.
            </p>
          </div>
          <div className="lp-grid lp-grid-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article className="lp-card" key={title}>
                <div className="lp-icon">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (tinted wash) */}
      <section className="lp-section" id="how">
        <div className="lp-wrap">
          <div className="lp-wash">
            <div className="lp-center">
              <h2 className="lp-h2">How to make a QR code in three steps</h2>
              <p className="lp-sub">It takes about a minute.</p>
            </div>
            <div className="lp-steps">
              <div className="lp-step">
                <div className="lp-step-num">1</div>
                <h3>Choose what to encode</h3>
                <p>Pick a website link, Wi-Fi, contact card, email, phone number or plain text and fill in the details.</p>
              </div>
              <div className="lp-step">
                <div className="lp-step-num">2</div>
                <h3>Style it</h3>
                <p>Change colors, shapes and frame, add your logo, or start from one of the ready-made presets.</p>
              </div>
              <div className="lp-step">
                <div className="lp-step-num">3</div>
                <h3>Check and export</h3>
                <p>Watch the live scan check, then download PNG, SVG or PDF in the quality you need.</p>
              </div>
            </div>
            <div className="lp-cta-row">
              <button type="button" className="lp-btn lp-btn-dark lp-pill" onClick={scrollToStudio}>
                Start designing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QR TYPES */}
      <section className="lp-section" id="types">
        <div className="lp-wrap">
          <div className="lp-center">
            <h2 className="lp-h2">Pick a QR code type and start</h2>
            <p className="lp-sub">Tap a type to jump back into the studio with it selected.</p>
          </div>
          <div className="lp-types">
            {TYPES.map(({ type, icon: Icon, title, text }) => (
              <button type="button" className="lp-type" key={type} onClick={() => startWithType(type)}>
                <span className="lp-icon">
                  <Icon size={22} aria-hidden="true" />
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

      {/* PRIVACY (dark panel) */}
      <section className="lp-section">
        <div className="lp-wrap">
          <div className="lp-panel">
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
              <button type="button" className="lp-btn lp-btn-ghost lp-pill" onClick={() => setIsLegalModalOpen(true)}>
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
      <section className="lp-section" id="faq" style={{ paddingTop: 48 }}>
        <div className="lp-wrap">
          <div className="lp-center">
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
          <div className="lp-cta-row">
            <button type="button" className="lp-btn lp-btn-dark lp-pill" onClick={() => setIsGuidesModalOpen(true)}>
              More guides and answers
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER (dark) */}
      <footer className="lp-footer">
        <div className="lp-wrap">
          <div className="lp-footer-grid">
            <div>
              <span className="lp-brand">
                <img src="/logo-mark.png" alt="" width="40" height="40" loading="lazy" />
                <span>
                  Basic <em>QR</em>
                </span>
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
};
