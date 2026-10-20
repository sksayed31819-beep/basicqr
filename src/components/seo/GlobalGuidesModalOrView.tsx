/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  X,
  Search,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useUiStore } from '../../stores/ui-store.ts';

interface GlobalGuidesModalOrViewProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'design' | 'privacy' | 'export' | 'commercial';
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'static-permanent',
    question: 'Are Basic QR codes static and permanent?',
    answer:
      'Yes! Basic QR generates direct, static QR codes that encode your destination URL or data directly into the matrix pattern. Unlike "dynamic" QR services that sneakily route scans through an intermediary redirect server (which they later hold hostage for a monthly subscription), our codes connect directly to your target. They will function permanently with zero dependencies.',
    category: 'design',
  },
  {
    id: 'never-expire',
    question: 'Do Basic QR codes ever expire?',
    answer:
      'No. Because Basic QR codes are 100% static, they have no expiration date. The data lives entirely within the black-and-white module pattern. As long as your destination website URL, Wi-Fi password, or phone number remains valid, the QR code will scan reliably forever.',
    category: 'design',
  },
  {
    id: 'camera-contrast',
    question: 'Why does my camera struggle to scan inverted or low-contrast QR codes?',
    answer:
      'Optical barcode and smartphone camera decoders work by detecting dark-on-light contrast transitions and finding the 3 corner position detection patterns (finder patterns). When the background is darker than the dots (inverted colors) or the contrast ratio is under 4.5:1, light glare and edge algorithms struggle to isolate the grid. Basic QR includes a built-in real-time WCAG 2.2 contrast validator and 1-click auto-fix to ensure your designs scan on every mobile device.',
    category: 'design',
  },
  {
    id: 'export-pass',
    question: 'How does the free 20-minute 4K Export Pass work?',
    answer:
      'Basic QR is fully free and ad-supported. Complete a short 15-second sponsor break to unlock 2 high-resolution / vector downloads for 20 minutes. This unlocks an active Pass granting 2 high-resolution downloads (4K PNG, vector SVG, or 300-DPI print-ready PDF) over a 20-minute window. Standard 512px PNG exports are always 100% unlimited without watching any ads.',
    category: 'export',
  },
  {
    id: 'wifi-privacy',
    question: 'Is my Wi-Fi password or vCard data uploaded to any server?',
    answer:
      'Never. 100% of QR payload encoding, logo background subtraction, raster matrix rendering, and vector SVG generation occurs locally inside your browser tab using Web APIs and JavaScript. Zero credentials, contact cards, or payload strings are ever transmitted over the network or stored in a remote database.',
    category: 'privacy',
  },
  {
    id: 'commercial-use',
    question: 'Can I use these QR codes for commercial product packaging and marketing?',
    answer:
      'Yes, absolutely. All QR codes, frames, vector SVG files, and PDF sheets exported from Basic QR are 100% royalty-free for both personal and commercial use worldwide. You can freely print them on retail product boxes, restaurant menus, billboards, business cards, and digital advertisements without attribution or licensing fees.',
    category: 'commercial',
  },
];

export const GlobalGuidesModalOrView: React.FC<GlobalGuidesModalOrViewProps> = ({
  isOpen,
  onClose,
}) => {
  const { setIsLegalModalOpen } = useUiStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('static-permanent');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-[var(--panel-bg)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-token-primary animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="faq-modal-title" className="font-heading font-bold text-base sm:text-lg">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-token-secondary">
                Clear answers on static permanent codes, client-side privacy, and commercial licensing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close FAQ dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-token-tertiary hover:text-token-primary hover:bg-[var(--surface-hover)] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 sm:px-6 border-b border-[var(--border)] bg-[var(--surface-bg)] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-token-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[var(--panel-bg)] border border-[var(--border)] text-token-primary placeholder:text-token-tertiary focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs shrink-0">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'design', label: 'Design & Scannability' },
              { id: 'export', label: 'High-Res Export Pass' },
              { id: 'privacy', label: 'Privacy & Data Security' },
              { id: 'commercial', label: 'Commercial Use' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-token-secondary hover:text-token-primary hover:bg-[var(--surface-hover)] border border-[var(--border)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible FAQ Accordion List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-token-tertiary text-sm">
              No matching questions found for &ldquo;{searchQuery}&rdquo;. Try another search term!
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl transition duration-150 overflow-hidden ${
                    isExpanded
                      ? 'border-purple-500/50 bg-[var(--surface-bg)]'
                      : 'border-[var(--border)] bg-[var(--panel-bg)] hover:border-purple-500/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-3 cursor-pointer group"
                  >
                    <span className="font-medium text-xs sm:text-sm text-token-primary group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-token-tertiary transition-transform duration-200 shrink-0 ${
                        isExpanded ? 'rotate-180 text-purple-600 dark:text-purple-400' : ''
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-token-secondary border-t border-[var(--border)] leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[var(--border)] bg-[var(--surface-bg)] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-token-secondary">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>100% Free &amp; Client-Side Static QR Codes</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsLegalModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-medium border border-[var(--border)] hover:bg-[var(--surface-hover)] text-token-secondary hover:text-token-primary transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Privacy &amp; Terms</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition cursor-pointer shadow-sm text-center"
            >
              Back to Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
