/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
  Shapes,
  Eye,
  Check,
  Link,
  Unlink,
} from 'lucide-react';
import { useEditorStore } from '../../stores/editor-store.ts';
import type {
  DotType,
  CornerSquareType,
  CornerDotType,
} from '../../types/editor.ts';

// -----------------------------------------------------------------------------
// SVG MINI-PREVIEWS FOR DOT PATTERNS
// -----------------------------------------------------------------------------
const DotPatternIcon: React.FC<{ type: DotType }> = ({ type }) => {
  switch (type) {
    case 'square':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <rect x="2" y="2" width="8" height="8" />
          <rect x="14" y="2" width="8" height="8" />
          <rect x="2" y="14" width="8" height="8" />
          <rect x="14" y="14" width="8" height="8" />
        </svg>
      );
    case 'dots':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <circle cx="6" cy="6" r="4" />
          <circle cx="18" cy="6" r="4" />
          <circle cx="6" cy="18" r="4" />
          <circle cx="18" cy="18" r="4" />
        </svg>
      );
    case 'rounded':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <rect x="2" y="2" width="8" height="8" rx="2.5" />
          <rect x="14" y="2" width="8" height="8" rx="2.5" />
          <rect x="2" y="14" width="8" height="8" rx="2.5" />
          <rect x="14" y="14" width="8" height="8" rx="2.5" />
        </svg>
      );
    case 'extra-rounded':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <rect x="2" y="2" width="8" height="8" rx="4" />
          <rect x="14" y="2" width="8" height="8" rx="4" />
          <rect x="2" y="14" width="8" height="8" rx="4" />
          <rect x="14" y="14" width="8" height="8" rx="4" />
        </svg>
      );
    case 'classy':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M2,2 L10,2 L10,10 L6,10 A4,4 0 0,1 2,6 Z" />
          <path d="M14,2 L22,2 L22,6 A4,4 0 0,1 18,10 L14,10 Z" />
          <path d="M2,14 L6,14 A4,4 0 0,1 10,18 L10,22 L2,22 Z" />
          <path d="M18,14 L22,14 L22,22 L14,22 L14,18 A4,4 0 0,1 18,14 Z" />
        </svg>
      );
    case 'classy-rounded':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M2,6 A4,4 0 0,1 6,2 L10,2 L10,6 A4,4 0 0,1 6,10 L2,10 Z" />
          <path d="M14,2 L18,2 A4,4 0 0,1 22,6 L22,10 L18,10 A4,4 0 0,1 14,6 Z" />
          <path d="M2,14 L6,14 A4,4 0 0,1 10,18 L10,22 L6,22 A4,4 0 0,1 2,18 Z" />
          <path d="M14,18 A4,4 0 0,1 18,14 L22,14 L22,18 A4,4 0 0,1 18,22 L14,22 Z" />
        </svg>
      );
    default:
      return null;
  }
};

// -----------------------------------------------------------------------------
// SVG MINI-PREVIEWS FOR CORNER SQUARES & DOTS
// -----------------------------------------------------------------------------
const CornerSquareIcon: React.FC<{ type: CornerSquareType }> = ({ type }) => {
  switch (type) {
    case 'square':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth="2.5">
          <rect x="3" y="3" width="18" height="18" />
        </svg>
      );
    case 'extra-rounded':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth="2.5">
          <rect x="3" y="3" width="18" height="18" rx="6" />
        </svg>
      );
    case 'dot':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth="2.5">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    default:
      return null;
  }
};

const CornerDotIcon: React.FC<{ type: CornerDotType }> = ({ type }) => {
  switch (type) {
    case 'square':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      );
    case 'dot':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
          <circle cx="12" cy="12" r="6" />
        </svg>
      );
    default:
      return null;
  }
};

export const ShapesPanel: React.FC = () => {
  const { style, setStyle } = useEditorStore();

  const [syncSquareColor, setSyncSquareColor] = useState(
    style.cornerSquareColor === style.dotColor
  );
  const [syncDotColor, setSyncDotColor] = useState(
    style.cornerDotColor === style.dotColor
  );

  const [showSquarePicker, setShowSquarePicker] = useState(false);
  const [showDotPicker, setShowDotPicker] = useState(false);

  const dotPatterns: { id: DotType; label: string }[] = [
    { id: 'square', label: 'Classic Square' },
    { id: 'dots', label: 'Circle Dots' },
    { id: 'rounded', label: 'Smooth Rounded' },
    { id: 'extra-rounded', label: 'Pill Rounded' },
    { id: 'classy', label: 'Classy Leaf' },
    { id: 'classy-rounded', label: 'Organic Wave' },
  ];

  const cornerSquares: { id: CornerSquareType; label: string }[] = [
    { id: 'square', label: 'Sharp Box' },
    { id: 'extra-rounded', label: 'Smooth Curves' },
    { id: 'dot', label: 'Circle Ring' },
  ];

  const cornerDots: { id: CornerDotType; label: string }[] = [
    { id: 'square', label: 'Square Pupil' },
    { id: 'dot', label: 'Circle Pupil' },
  ];

  return (
    <div className="flex flex-col space-y-6 select-none">
      {/* Section Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold tracking-wider uppercase text-token-secondary">
            Matrix Shapes & Eyes
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border studio-border studio-surface text-token-secondary">
            Geometry
          </span>
        </div>
        <p className="text-xs text-token-tertiary">
          Customize individual QR module shapes and the 3 finder eyes.
        </p>
      </div>

      {/* 1. DOT / MODULE PATTERN */}
      <div className="p-4 rounded-2xl studio-surface border studio-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-token-primary flex items-center gap-1.5">
            <Shapes className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Module / Dot Style
          </span>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold capitalize">
            {style.dotType.replace('-', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {dotPatterns.map((pat) => {
            const isSelected = style.dotType === pat.id;
            return (
              <button
                key={pat.id}
                type="button"
                onClick={() => setStyle({ dotType: pat.id })}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[var(--accent)] bg-[var(--accent-light)] text-token-primary font-semibold shadow-xs'
                    : 'studio-panel border border-[var(--border)] text-token-secondary hover:text-token-primary hover:border-purple-400/40'
                }`}
              >
                <DotPatternIcon type={pat.id} />
                <span className="text-[10px] truncate w-full">
                  {pat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CORNER FRAME (OUTER EYE) */}
      <div className="p-4 rounded-2xl studio-surface border studio-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-token-primary flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Corner Frame (Outer Eye)
          </span>

          {/* Sync toggle */}
          <button
            type="button"
            onClick={() => {
              const nextSync = !syncSquareColor;
              setSyncSquareColor(nextSync);
              if (nextSync) {
                setStyle({ cornerSquareColor: style.dotColor });
              }
            }}
            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded cursor-pointer transition ${
              syncSquareColor
                ? 'bg-purple-600/15 text-purple-700 dark:text-purple-300 font-semibold'
                : 'text-token-tertiary hover:text-token-primary'
            }`}
          >
            {syncSquareColor ? <Link className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
            <span>Sync Color</span>
          </button>
        </div>

        {/* Outer Eye Shape Selector */}
        <div className="grid grid-cols-3 gap-2">
          {cornerSquares.map((sq) => {
            const isSelected = style.cornerSquareType === sq.id;
            return (
              <button
                key={sq.id}
                type="button"
                onClick={() => setStyle({ cornerSquareType: sq.id })}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[var(--accent)] bg-[var(--accent-light)] text-token-primary font-semibold shadow-xs'
                    : 'studio-panel border border-[var(--border)] text-token-secondary hover:text-token-primary hover:border-purple-400/40'
                }`}
              >
                <CornerSquareIcon type={sq.id} />
                <span className="text-[10px] truncate w-full">
                  {sq.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Outer Eye Custom Color Picker */}
        {!syncSquareColor && (
          <div className="pt-2 border-t studio-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-token-secondary">Outer Eye Color</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowSquarePicker(!showSquarePicker)}
                  className="w-5 h-5 rounded border studio-border cursor-pointer"
                  style={{ backgroundColor: style.cornerSquareColor || style.dotColor }}
                />
                <input
                  type="text"
                  value={style.cornerSquareColor || style.dotColor}
                  onChange={(e) => setStyle({ cornerSquareColor: e.target.value })}
                  className="w-20 px-2 py-0.5 text-xs font-mono studio-panel border studio-border rounded text-token-primary text-center uppercase"
                />
              </div>
            </div>

            {showSquarePicker && (
              <div className="p-3 studio-panel rounded-xl border studio-border shadow-xl space-y-2 z-20">
                <HexColorPicker
                  color={style.cornerSquareColor || style.dotColor}
                  onChange={(c) => setStyle({ cornerSquareColor: c })}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowSquarePicker(false)}
                    className="text-[11px] px-2 py-0.5 rounded bg-purple-600 text-white font-medium cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. CORNER DOT (INNER PUPIL) */}
      <div className="p-4 rounded-2xl studio-surface border studio-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-token-primary flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Corner Pupil (Inner Eye)
          </span>

          {/* Sync toggle */}
          <button
            type="button"
            onClick={() => {
              const nextSync = !syncDotColor;
              setSyncDotColor(nextSync);
              if (nextSync) {
                setStyle({ cornerDotColor: style.dotColor });
              }
            }}
            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded cursor-pointer transition ${
              syncDotColor
                ? 'bg-purple-600/15 text-purple-700 dark:text-purple-300 font-semibold'
                : 'text-token-tertiary hover:text-token-primary'
            }`}
          >
            {syncDotColor ? <Link className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
            <span>Sync Color</span>
          </button>
        </div>

        {/* Inner Eye Shape Selector */}
        <div className="grid grid-cols-2 gap-2">
          {cornerDots.map((cd) => {
            const isSelected = style.cornerDotType === cd.id;
            return (
              <button
                key={cd.id}
                type="button"
                onClick={() => setStyle({ cornerDotType: cd.id })}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[var(--accent)] bg-[var(--accent-light)] text-token-primary font-semibold shadow-xs'
                    : 'studio-panel border border-[var(--border)] text-token-secondary hover:text-token-primary hover:border-purple-400/40'
                }`}
              >
                <CornerDotIcon type={cd.id} />
                <span className="text-[10px] truncate w-full">
                  {cd.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Inner Eye Custom Color Picker */}
        {!syncDotColor && (
          <div className="pt-2 border-t studio-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-token-secondary">Pupil Color</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowDotPicker(!showDotPicker)}
                  className="w-5 h-5 rounded border studio-border cursor-pointer"
                  style={{ backgroundColor: style.cornerDotColor || style.dotColor }}
                />
                <input
                  type="text"
                  value={style.cornerDotColor || style.dotColor}
                  onChange={(e) => setStyle({ cornerDotColor: e.target.value })}
                  className="w-20 px-2 py-0.5 text-xs font-mono studio-panel border studio-border rounded text-token-primary text-center uppercase"
                />
              </div>
            </div>

            {showDotPicker && (
              <div className="p-3 studio-panel rounded-xl border studio-border shadow-xl space-y-2 z-20">
                <HexColorPicker
                  color={style.cornerDotColor || style.dotColor}
                  onChange={(c) => setStyle({ cornerDotColor: c })}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDotPicker(false)}
                    className="text-[11px] px-2 py-0.5 rounded bg-purple-600 text-white font-medium cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
