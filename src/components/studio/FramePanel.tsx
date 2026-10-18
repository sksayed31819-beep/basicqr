/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
  SquareCode,
  Type,
  Palette,
  Check,
  Smartphone,
  MessageSquare,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { useEditorStore } from '../../stores/editor-store.ts';
import type { FrameStyle } from '../../types/editor.ts';

const FRAME_PRESETS: { id: FrameStyle; label: string; desc: string }[] = [
  { id: 'none', label: 'No Frame', desc: 'Minimalist clean border' },
  { id: 'bottom-banner', label: 'Bottom Banner', desc: 'Standard CTA footer' },
  { id: 'top-banner', label: 'Top Banner', desc: 'Header banner label' },
  { id: 'polaroid', label: 'Polaroid Card', desc: 'Photo-style card' },
  { id: 'badge', label: 'Pill Badge', desc: 'Rounded badge tag' },
  { id: 'balloon', label: 'Chat Balloon', desc: 'Speech bubble callout' },
  { id: 'ticket', label: 'Event Ticket', desc: 'Notched pass stub' },
  { id: 'neon', label: 'Neon Glow', desc: 'High-contrast edge' },
];

const GLOBAL_CTA_CHIPS = [
  'SCAN ME',
  'CONNECT TO WI-FI',
  'VIEW MENU',
  'SAVE CONTACT',
  'LEAVE A REVIEW',
  'GET THE APP',
  'VISIT WEBSITE',
  'ORDER ONLINE',
];

const CURATED_FRAME_COLORS = [
  { name: 'Onyx Black', hex: '#0B0D12' },
  { name: 'Royal Violet', hex: '#8B5CF6' },
  { name: 'Electric Blue', hex: '#3B82F6' },
  { name: 'Emerald Green', hex: '#10B981' },
  { name: 'Sunset Amber', hex: '#F59E0B' },
  { name: 'Rose Pink', hex: '#EC4899' },
  { name: 'Slate Dark', hex: '#1E293B' },
  { name: 'Pure White', hex: '#FFFFFF' },
];

const CURATED_TEXT_COLORS = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Onyx Black', hex: '#0B0D12' },
  { name: 'Light Slate', hex: '#F1F5F9' },
  { name: 'Gold Yellow', hex: '#FEF08A' },
  { name: 'Cyan Glow', hex: '#A5F3FC' },
];

const FONTS = [
  { id: 'Space Grotesk', label: 'Space Grotesk (Modern)' },
  { id: 'Inter', label: 'Inter (Clean Neutral)' },
  { id: 'Outfit', label: 'Outfit (Friendly Bold)' },
  { id: 'Poppins', label: 'Poppins (Geometric)' },
];

export const FramePanel: React.FC = () => {
  const { frame, setFrame } = useEditorStore();

  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showTextPicker, setShowTextPicker] = useState(false);

  return (
    <div className="flex flex-col space-y-6 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold tracking-wider uppercase text-token-secondary">
            Frame & Call-to-Action
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border studio-border studio-surface text-token-secondary">
            Sticker Studio
          </span>
        </div>
        <p className="text-xs text-token-tertiary">
          Wrap your QR code in high-converting CTA banners, badges, or polaroid frames.
        </p>
      </div>

      {/* 1. FRAME STYLE SELECTOR */}
      <div className="p-4 rounded-2xl studio-surface border studio-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-token-primary flex items-center gap-1.5">
            <SquareCode className="w-4 h-4 text-purple-400" />
            Frame Layout Style
          </span>
          <span className="text-[11px] text-purple-400 font-medium capitalize">
            {frame.style.replace('-', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {FRAME_PRESETS.map((pst) => {
            const isSelected = frame.style === pst.id;
            return (
              <button
                key={pst.id}
                type="button"
                onClick={() => setFrame({ style: pst.id })}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[var(--accent)] bg-[var(--accent-light)] shadow-xs'
                    : 'studio-panel border border-[var(--border)] hover:border-purple-400/40'
                }`}
              >
                <div
                  className={`text-xs ${
                    isSelected ? 'text-token-primary font-bold' : 'text-token-primary font-medium'
                  }`}
                >
                  {pst.label}
                </div>
                <div className="text-[10px] text-token-tertiary truncate">{pst.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CALL TO ACTION TEXT & CHIPS */}
      {frame.style !== 'none' && (
        <div className="p-4 rounded-2xl studio-surface border studio-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-token-primary flex items-center gap-1.5">
              <Type className="w-4 h-4 text-purple-400" />
              Call to Action (CTA) Text
            </span>
            <span className="text-[11px] font-mono text-token-tertiary">
              {frame.text.length}/28
            </span>
          </div>

          <input
            type="text"
            maxLength={28}
            value={frame.text}
            onChange={(e) => setFrame({ text: e.target.value.toUpperCase() })}
            placeholder="e.g. SCAN ME"
            className="w-full px-3 py-2 text-xs font-bold tracking-wider studio-panel border studio-border rounded-lg text-token-primary focus:outline-none focus:border-purple-500 uppercase"
          />

          {/* Quick 1-Click CTA Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-token-secondary">Global Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {GLOBAL_CTA_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setFrame({ text: chip })}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    frame.text === chip
                      ? 'border-purple-500 bg-purple-500/15 text-purple-400 font-bold'
                      : 'studio-panel border-studio-border text-token-secondary hover:text-token-primary'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Typography Selector */}
          <div className="space-y-1.5 pt-2 border-t studio-border">
            <label className="text-[11px] text-token-secondary">Headline Font Family</label>
            <div className="grid grid-cols-2 gap-2">
              {FONTS.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setFrame({ font: font.id })}
                  className={`py-1.5 px-2 text-left rounded-lg border text-xs transition cursor-pointer truncate ${
                    frame.font === font.id
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400 font-bold'
                      : 'studio-panel border-studio-border text-token-secondary hover:text-token-primary'
                  }`}
                  style={{ fontFamily: font.id }}
                >
                  {font.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. FRAME COLORS */}
      {frame.style !== 'none' && (
        <div className="p-4 rounded-2xl studio-surface border studio-border space-y-4">
          <span className="text-xs font-bold text-token-primary block">
            Frame Color Palette
          </span>

          {/* Frame Container Color */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-token-secondary">
                Frame Body / Border
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowBgPicker(!showBgPicker)}
                  className="w-6 h-6 rounded-md border studio-border cursor-pointer shadow-xs"
                  style={{ backgroundColor: frame.color }}
                />
                <input
                  type="text"
                  value={frame.color}
                  onChange={(e) => setFrame({ color: e.target.value })}
                  className="w-20 px-2 py-0.5 text-xs font-mono studio-panel border studio-border rounded text-token-primary text-center uppercase"
                />
              </div>
            </div>

            {showBgPicker && (
              <div className="p-3 studio-panel rounded-xl border studio-border shadow-xl space-y-2 z-20">
                <HexColorPicker
                  color={frame.color}
                  onChange={(c) => setFrame({ color: c })}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowBgPicker(false)}
                    className="text-[11px] px-2 py-0.5 rounded bg-purple-600 text-white font-medium cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {CURATED_FRAME_COLORS.map((s) => (
                <button
                  key={s.hex}
                  type="button"
                  onClick={() => setFrame({ color: s.hex })}
                  title={s.name}
                  className={`w-5 h-5 rounded-md border transition cursor-pointer relative ${
                    frame.color.toLowerCase() === s.hex.toLowerCase()
                      ? 'ring-2 ring-purple-500 scale-110 border-white'
                      : 'studio-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: s.hex }}
                >
                  {frame.color.toLowerCase() === s.hex.toLowerCase() && (
                    <Check className={`w-3 h-3 absolute inset-0 m-auto ${s.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Text Color */}
          <div className="space-y-2 pt-2 border-t studio-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-token-secondary">
                CTA Text Color
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowTextPicker(!showTextPicker)}
                  className="w-6 h-6 rounded-md border studio-border cursor-pointer shadow-xs"
                  style={{ backgroundColor: frame.textColor }}
                />
                <input
                  type="text"
                  value={frame.textColor}
                  onChange={(e) => setFrame({ textColor: e.target.value })}
                  className="w-20 px-2 py-0.5 text-xs font-mono studio-panel border studio-border rounded text-token-primary text-center uppercase"
                />
              </div>
            </div>

            {showTextPicker && (
              <div className="p-3 studio-panel rounded-xl border studio-border shadow-xl space-y-2 z-20">
                <HexColorPicker
                  color={frame.textColor}
                  onChange={(c) => setFrame({ textColor: c })}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowTextPicker(false)}
                    className="text-[11px] px-2 py-0.5 rounded bg-purple-600 text-white font-medium cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {CURATED_TEXT_COLORS.map((s) => (
                <button
                  key={s.hex}
                  type="button"
                  onClick={() => setFrame({ textColor: s.hex })}
                  title={s.name}
                  className={`w-5 h-5 rounded-md border transition cursor-pointer relative ${
                    frame.textColor.toLowerCase() === s.hex.toLowerCase()
                      ? 'ring-2 ring-purple-500 scale-110 border-white'
                      : 'studio-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: s.hex }}
                >
                  {frame.textColor.toLowerCase() === s.hex.toLowerCase() && (
                    <Check className={`w-3 h-3 absolute inset-0 m-auto ${s.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
