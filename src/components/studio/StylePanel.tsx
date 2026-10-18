/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
  Palette,
  Sparkles,
  ArrowRightLeft,
  RotateCw,
  AlertTriangle,
  ShieldCheck,
  Check,
  Sliders,
  Maximize2,
} from 'lucide-react';
import { useEditorStore } from '../../stores/editor-store.ts';
import type { ErrorCorrectionLevel } from '../../types/editor.ts';

const CURATED_FG_SWATCHES = [
  { name: 'Studio Dark', hex: '#0B0D12' },
  { name: 'Royal Violet', hex: '#8B5CF6' },
  { name: 'Electric Blue', hex: '#3B82F6' },
  { name: 'Emerald Mint', hex: '#10B981' },
  { name: 'Vibrant Pink', hex: '#EC4899' },
  { name: 'Warm Amber', hex: '#F59E0B' },
  { name: 'Indigo Deep', hex: '#4F46E5' },
  { name: 'Crimson Red', hex: '#EF4444' },
];

const CURATED_BG_SWATCHES = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Soft Ice', hex: '#F8FAFC' },
  { name: 'Cream Light', hex: '#FEF9C3' },
  { name: 'Lilac Tint', hex: '#F3E8FF' },
  { name: 'Studio Black', hex: '#0B0D12' },
  { name: 'Dark Slate', hex: '#11141C' },
];

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  swatches?: { name: string; hex: string }[];
}

const ColorField: React.FC<ColorFieldProps> = ({ label, value, onChange, swatches }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-token-primary">{label}</label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-6 h-6 rounded-md border studio-border shadow-xs cursor-pointer transition hover:scale-105"
            style={{ backgroundColor: value }}
            title="Click to open color palette"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-20 px-2 py-0.5 text-xs font-mono studio-panel border studio-border rounded text-token-primary text-center uppercase focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {isOpen && (
        <div className="p-3 studio-panel rounded-xl border studio-border shadow-xl space-y-2.5 z-20">
          <div className="flex justify-center">
            <HexColorPicker color={value} onChange={onChange} />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[11px] px-2 py-0.5 rounded bg-purple-600 text-white font-medium cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {swatches && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          {swatches.map((s) => (
            <button
              key={s.hex}
              type="button"
              onClick={() => onChange(s.hex)}
              title={s.name}
              className={`w-5 h-5 rounded-md border transition cursor-pointer relative ${
                value.toLowerCase() === s.hex.toLowerCase()
                  ? 'ring-2 ring-purple-500 scale-110 border-white'
                  : 'studio-border hover:scale-105'
              }`}
              style={{ backgroundColor: s.hex }}
            >
              {value.toLowerCase() === s.hex.toLowerCase() && (
                <Check className={`w-3 h-3 absolute inset-0 m-auto ${s.hex === '#FFFFFF' || s.hex === '#FEF9C3' ? 'text-black' : 'text-white'}`} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const StylePanel: React.FC = () => {
  const { style, setStyle, scannability, setScannability } = useEditorStore();

  const isGradient = style.dotGradient.enabled;

  const handleSwapGradient = () => {
    setStyle({
      dotGradient: {
        ...style.dotGradient,
        color1: style.dotGradient.color2,
        color2: style.dotGradient.color1,
      },
    });
  };

  return (
    <div className="flex flex-col space-y-6 select-none">
      {/* Section Title */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold tracking-wider uppercase text-token-secondary">
            Color & Surface Styles
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border studio-border studio-surface text-token-secondary">
            Gradients & Optics
          </span>
        </div>
        <p className="text-xs text-token-tertiary">
          Configure foreground patterns, linear/radial gradients, and background safety margins.
        </p>
      </div>

      {/* 1. FOREGROUND COLOR & GRADIENT CONTROLS */}
      <div className="p-4 rounded-2xl studio-surface border studio-border space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-token-primary flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-purple-400" />
            Foreground Pattern Color
          </span>

          {/* Mode Switch: Solid vs Gradient */}
          <div className="flex studio-panel p-0.5 rounded-lg border studio-border">
            <button
              type="button"
              onClick={() =>
                setStyle({
                  dotGradient: { ...style.dotGradient, enabled: false },
                })
              }
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition cursor-pointer ${
                !isGradient
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-token-secondary hover:text-token-primary'
              }`}
            >
              Solid
            </button>
            <button
              type="button"
              onClick={() =>
                setStyle({
                  dotGradient: { ...style.dotGradient, enabled: true },
                })
              }
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition cursor-pointer ${
                isGradient
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-token-secondary hover:text-token-primary'
              }`}
            >
              Gradient
            </button>
          </div>
        </div>

        {/* Solid Color Field */}
        {!isGradient ? (
          <ColorField
            label="Pattern Fill Color"
            value={style.dotColor}
            onChange={(color) => setStyle({ dotColor: color })}
            swatches={CURATED_FG_SWATCHES}
          />
        ) : (
          /* Gradient Customizer */
          <div className="space-y-4 pt-1 border-t studio-border">
            {/* Linear vs Radial */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-token-secondary">Gradient Type</span>
              <div className="flex studio-panel p-0.5 rounded-lg border studio-border">
                <button
                  type="button"
                  onClick={() =>
                    setStyle({
                      dotGradient: { ...style.dotGradient, type: 'linear' },
                    })
                  }
                  className={`px-2 py-0.5 text-xs rounded font-medium cursor-pointer ${
                    style.dotGradient.type === 'linear'
                      ? 'bg-purple-600 text-white'
                      : 'text-token-secondary'
                  }`}
                >
                  Linear
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStyle({
                      dotGradient: { ...style.dotGradient, type: 'radial' },
                    })
                  }
                  className={`px-2 py-0.5 text-xs rounded font-medium cursor-pointer ${
                    style.dotGradient.type === 'radial'
                      ? 'bg-purple-600 text-white'
                      : 'text-token-secondary'
                  }`}
                >
                  Radial
                </button>
              </div>
            </div>

            {/* Gradient Color Stops */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ColorField
                label="Stop 1 (Start)"
                value={style.dotGradient.color1}
                onChange={(c) =>
                  setStyle({
                    dotGradient: { ...style.dotGradient, color1: c },
                  })
                }
              />
              <ColorField
                label="Stop 2 (End)"
                value={style.dotGradient.color2}
                onChange={(c) =>
                  setStyle({
                    dotGradient: { ...style.dotGradient, color2: c },
                  })
                }
              />
            </div>

            {/* Swap button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSwapGradient}
                className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Swap Color Stops
              </button>
            </div>

            {/* Rotation Angle Slider (for linear gradient) */}
            {style.dotGradient.type === 'linear' && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-token-secondary flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 text-purple-400" />
                    Gradient Angle
                  </label>
                  <span className="text-xs font-mono font-semibold text-token-primary">
                    {style.dotGradient.rotation}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={style.dotGradient.rotation}
                  onChange={(e) =>
                    setStyle({
                      dotGradient: {
                        ...style.dotGradient,
                        rotation: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex items-center justify-between gap-1">
                  {[45, 90, 135, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() =>
                        setStyle({
                          dotGradient: { ...style.dotGradient, rotation: deg },
                        })
                      }
                      className={`text-[10px] px-2 py-0.5 rounded studio-panel border studio-border text-token-secondary hover:text-token-primary cursor-pointer ${
                        style.dotGradient.rotation === deg ? 'border-purple-500 text-purple-400 font-bold' : ''
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. BACKGROUND & TRANSPARENCY */}
      <div className="p-4 rounded-2xl studio-surface border studio-border space-y-4">
        <span className="text-xs font-bold text-token-primary block">
          Background & Canvas Canvas
        </span>

        <label className="flex items-center justify-between cursor-pointer select-none">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-token-primary">
              Transparent Background
            </span>
            <p className="text-[11px] text-token-tertiary">
              Omit background fill for sticker overlays or PNG cutouts
            </p>
          </div>
          <input
            type="checkbox"
            checked={style.backgroundTransparent}
            onChange={(e) => setStyle({ backgroundTransparent: e.target.checked })}
            className="w-4 h-4 rounded studio-border text-purple-600 focus:ring-0 cursor-pointer"
          />
        </label>

        {!style.backgroundTransparent && (
          <ColorField
            label="Background Color"
            value={style.backgroundColor}
            onChange={(color) => setStyle({ backgroundColor: color })}
            swatches={CURATED_BG_SWATCHES}
          />
        )}

        {style.backgroundTransparent && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Transparent backgrounds require high contrast against the printed surface so smartphone scanners can decode the quiet zone.
            </span>
          </div>
        )}
      </div>

      {/* 3. QUIET ZONE (MARGIN) & ERROR CORRECTION */}
      <div className="p-4 rounded-2xl studio-surface border studio-border space-y-4">
        <span className="text-xs font-bold text-token-primary block">
          Optics & Error Correction
        </span>

        {/* Quiet Zone Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-token-secondary">
              Quiet Zone Margin
            </label>
            <span className="text-xs font-mono font-semibold text-token-primary">
              {style.margin}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="2"
            value={style.margin}
            onChange={(e) => setStyle({ margin: Number(e.target.value) })}
            className="w-full accent-purple-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-token-tertiary font-mono">
            <span>0px (Tight)</span>
            <span>16px (Standard)</span>
            <span>40px (Wide)</span>
          </div>
        </div>

        {/* Error Correction Level */}
        <div className="space-y-2 pt-2 border-t studio-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-token-secondary">
              Error Correction Level
            </label>
            <span className="text-[11px] text-token-tertiary">
              Damage tolerance
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(
              [
                { level: 'L', recovery: '7%' },
                { level: 'M', recovery: '15%' },
                { level: 'Q', recovery: '25%' },
                { level: 'H', recovery: '30%' },
              ] as const
            ).map((item) => (
              <button
                key={item.level}
                type="button"
                onClick={() =>
                  setScannability({
                    errorCorrection: item.level as ErrorCorrectionLevel,
                  })
                }
                className={`py-2 px-1 text-center rounded-xl border transition cursor-pointer ${
                  scannability.errorCorrection === item.level
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400 font-bold'
                    : 'studio-panel border-studio-border text-token-secondary hover:text-token-primary'
                }`}
              >
                <div className="text-xs">{item.level}</div>
                <div className="text-[10px] text-token-tertiary font-mono">
                  {item.recovery}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
