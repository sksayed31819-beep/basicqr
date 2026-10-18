/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  LayoutTemplate,
  Search,
  Sparkles,
  Check,
  Tag,
  Palette,
  Layers,
  ShieldCheck,
  Bookmark,
} from 'lucide-react';
import { useEditorStore } from '../../stores/editor-store.ts';
import {
  GLOBAL_TEMPLATES,
  type TemplateCategory,
  type QrTemplatePreset,
} from '../../features/templates/template-catalog.ts';

const CATEGORIES: ('All' | TemplateCategory)[] = [
  'All',
  'Hospitality',
  'Business',
  'Creator',
  'Packaging',
  'Events',
  'Marketing',
  'Tech',
];

export const TemplatesPanel: React.FC = () => {
  const { activeTemplateId, applyTemplate } = useEditorStore();

  const [selectedCategory, setSelectedCategory] = useState<'All' | TemplateCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [preserveContent, setPreserveContent] = useState(true);

  const filteredTemplates = useMemo(() => {
    return GLOBAL_TEMPLATES.filter((tpl) => {
      const matchesCategory =
        selectedCategory === 'All' || tpl.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col space-y-5 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold tracking-wider uppercase text-token-secondary">
            Design Preset Library
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border studio-border studio-surface text-token-secondary">
            15 Presets
          </span>
        </div>
        <p className="text-xs text-token-tertiary">
          1-Click production designs engineered for high contrast and instant scannability.
        </p>
      </div>

      {/* Preserve Content Toggle */}
      <div className="p-3.5 rounded-xl studio-surface border studio-border flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-token-primary block">
            Keep My Current Content
          </span>
          <p className="text-[11px] text-token-tertiary">
            Apply layout, colors & frames without replacing your URL/data
          </p>
        </div>
        <input
          type="checkbox"
          checked={preserveContent}
          onChange={(e) => setPreserveContent(e.target.checked)}
          className="w-4 h-4 rounded studio-border text-purple-600 focus:ring-0 cursor-pointer"
        />
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-token-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search presets (e.g. Wi-Fi, Menu, Cyberpunk)..."
          className="w-full pl-8 pr-3 py-2 text-xs studio-panel border studio-border rounded-xl text-token-primary placeholder:text-token-tertiary focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {CATEGORIES.map((cat) => {
          const count =
            cat === 'All'
              ? GLOBAL_TEMPLATES.length
              : GLOBAL_TEMPLATES.filter((t) => t.category === cat).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap border transition cursor-pointer ${
                isSelected
                  ? 'border-2 border-[var(--accent)] bg-[var(--accent-light)] text-token-primary font-bold'
                  : 'studio-panel border border-[var(--border)] text-token-secondary hover:text-token-primary'
              }`}
            >
              {cat} <span className="opacity-60 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Template Cards List */}
      <div className="space-y-3 pb-2">
        {filteredTemplates.map((tpl) => {
          const isSelected = activeTemplateId === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => applyTemplate(tpl, preserveContent)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-2 border-[var(--accent)] bg-[var(--accent-light)] shadow-md'
                  : 'studio-panel border border-[var(--border)] hover:border-purple-400/50 hover:bg-purple-500/5'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow-xs">
                  <Check className="w-3 h-3" />
                  <span>Applied</span>
                </div>
              )}

              {/* Header Info */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25">
                  {tpl.category}
                </span>
                <span className="text-xs font-bold text-token-primary">
                  {tpl.name}
                </span>
              </div>

              <p className="text-[11px] text-token-tertiary mb-3 leading-relaxed">
                {tpl.description}
              </p>

              {/* Visual Mini-Preview Swatch Bar */}
              <div
                className="p-2.5 rounded-xl border studio-border flex items-center justify-between gap-2"
                style={{ backgroundColor: tpl.style.backgroundColor }}
              >
                {/* Foreground Dot Swatch Preview */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-md shadow-xs border border-black/10 shrink-0"
                    style={{
                      background: tpl.style.dotGradient.enabled
                        ? `linear-gradient(${tpl.style.dotGradient.rotation}deg, ${tpl.style.dotGradient.color1}, ${tpl.style.dotGradient.color2})`
                        : tpl.style.dotColor,
                    }}
                  />
                  <div className="space-y-0.5">
                    <span
                      className="text-[10px] font-bold uppercase block tracking-wider"
                      style={{
                        color:
                          tpl.style.backgroundColor === '#FFFFFF' ||
                          tpl.style.backgroundColor === '#F8F6F0' ||
                          tpl.style.backgroundColor === '#FFF3E5' ||
                          tpl.style.backgroundColor === '#F7F0E2' ||
                          tpl.style.backgroundColor === '#FFF7FB' ||
                          tpl.style.backgroundColor === '#F8FAFC' ||
                          tpl.style.backgroundColor === '#F5E9D5' ||
                          tpl.style.backgroundColor === '#F8FAF7' ||
                          tpl.style.backgroundColor === '#F5F0E8'
                            ? '#111827'
                            : '#F9FAFB',
                      }}
                    >
                      {tpl.style.dotType}
                    </span>
                    <span className="text-[9px] opacity-70 block font-mono text-slate-500">
                      {tpl.frame.style}
                    </span>
                  </div>
                </div>

                {/* Frame CTA Tag */}
                {tpl.frame.text && (
                  <div
                    className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase shrink-0 shadow-xs"
                    style={{
                      backgroundColor: tpl.frame.color,
                      color: tpl.frame.textColor,
                    }}
                  >
                    {tpl.frame.text}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredTemplates.length === 0 && (
          <div className="p-8 text-center studio-surface rounded-xl border studio-border">
            <LayoutTemplate className="w-8 h-8 text-token-tertiary mx-auto mb-2 opacity-50" />
            <p className="text-xs text-token-secondary font-medium">
              No presets matched "{searchQuery}"
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-2 text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
