/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  Upload,
  Sparkles,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Circle,
  Square,
  Check,
  Info,
  Maximize2,
} from 'lucide-react';
import { useEditorStore } from '../../stores/editor-store.ts';
import { GLOBAL_LOGO_PRESETS, processLogoImage } from '../../features/qr-renderer/logo-processor.ts';
import type { QrLogoConfig } from '../../types/editor.ts';

export const LogoPanel: React.FC = () => {
  const { logo, setLogo, setScannability } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplyLogoSrc = async (rawSrc: string, shapeOverride?: 'circle' | 'rounded' | 'square') => {
    setIsProcessing(true);
    setErrorMessage(null);

    const activeShape = shapeOverride || logo.shape || 'circle';
    const processed = await processLogoImage(rawSrc, activeShape, '#FFFFFF');

    setLogo({
      enabled: true,
      src: processed,
      rawSrc,
      shape: activeShape,
    });

    // Auto-lock error correction to Level H for 30% redundancy
    setScannability({ errorCorrection: 'H' });
    setIsProcessing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 20MB size limit check (images are downscaled in the browser before use)
    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 20MB limit. Please upload an image under 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        await handleApplyLogoSrc(dataUrl);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogo({
      enabled: false,
      src: '',
      rawSrc: '',
    });
    setErrorMessage(null);
  };

  const handleShapeChange = async (shape: 'square' | 'rounded' | 'circle') => {
    setLogo({ shape });
    if (logo.enabled && logo.src) {
      await handleApplyLogoSrc(logo.rawSrc || logo.src, shape);
    }
  };

  return (
    <div className="flex flex-col space-y-6 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold tracking-wider uppercase text-token-secondary">
            Center Brand Logo
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border studio-border studio-surface text-token-secondary">
            Brand Optics
          </span>
        </div>
        <p className="text-xs text-token-tertiary">
          Embed vector icons or custom logos with automatic quiet zone clearing.
        </p>
      </div>

      {/* High Error Correction Warning Banner */}
      {logo.enabled && logo.src && (
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-purple-200">Error Correction Level H Active</span>
            <p className="text-[11px] text-purple-300/80">
              Reed-Solomon recovery is automatically upgraded to 30% redundancy so the QR code scans reliably with a center brand mark.
            </p>
          </div>
        </div>
      )}

      {/* 1. UPLOAD ZONE OR ACTIVE LOGO */}
      <div className="p-4 rounded-2xl studio-surface border studio-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-token-primary flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-purple-400" />
            Upload Custom Logo
          </span>
          {logo.enabled && logo.src && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Logo
            </button>
          )}
        </div>

        {/* Upload Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed studio-border hover:border-purple-500/60 rounded-xl p-5 text-center cursor-pointer transition studio-panel hover:bg-purple-500/5 flex flex-col items-center justify-center gap-2"
        >
          {logo.enabled && logo.src ? (
            <div className="flex items-center gap-3">
              <img
                src={logo.src}
                alt="Selected brand logo"
                className="w-12 h-12 object-contain rounded-lg border studio-border bg-white p-1"
              />
              <div className="text-left">
                <span className="text-xs font-semibold text-token-primary block">
                  Active Logo Loaded
                </span>
                <span className="text-[11px] text-token-tertiary">
                  Click to replace image (PNG, JPG, WebP, SVG up to 20MB)
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl studio-surface border studio-border text-token-secondary flex items-center justify-center">
                <Upload className="w-5 h-5 text-purple-400" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-token-primary block">
                  Click or drag image here
                </span>
                <span className="text-[10px] text-token-tertiary">
                  PNG, JPG, WebP, SVG up to 20MB (100% client-side)
                </span>
              </div>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-400 font-medium">{errorMessage}</p>
        )}
      </div>

      {/* 2. QUICK GLOBAL ICON PRESETS */}
      <div className="p-4 rounded-2xl studio-surface border studio-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-token-primary flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Universal Icon Presets
          </span>
          <span className="text-[11px] text-token-tertiary">1-Click Apply</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {GLOBAL_LOGO_PRESETS.map((preset) => {
            const isSelected = logo.enabled && logo.src === preset.dataUrl;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyLogoSrc(preset.dataUrl)}
                title={preset.name}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/15 ring-1 ring-purple-500'
                    : 'studio-panel border-studio-border hover:border-purple-400/40 hover:scale-105'
                }`}
              >
                <img
                  src={preset.dataUrl}
                  alt={preset.name}
                  className="w-7 h-7 object-contain rounded"
                />
                <span className="text-[9px] font-medium text-token-secondary truncate w-full text-center">
                  {preset.name.split('/')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. LOGO SHAPE & MASKING */}
      {logo.enabled && Boolean(logo.src) && (
        <div className="p-4 rounded-2xl studio-surface border studio-border space-y-4">
          <span className="text-xs font-bold text-token-primary block">
            Masking & Sizing Controls
          </span>

          {/* Shape Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-token-secondary">Logo Shape Mask</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'circle', label: 'Circle' },
                  { id: 'rounded', label: 'Squircle' },
                  { id: 'square', label: 'Square' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleShapeChange(s.id)}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-medium transition cursor-pointer ${
                    logo.shape === s.id
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400 font-bold'
                      : 'studio-panel border-studio-border text-token-secondary hover:text-token-primary'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Logo Size Slider */}
          <div className="space-y-2 pt-2 border-t studio-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-token-secondary flex items-center gap-1">
                <span>Center Size</span>
                {logo.size > 0.22 && (
                  <span className="text-[10px] text-amber-400 font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">
                    High Density
                  </span>
                )}
              </label>
              <span className="text-xs font-mono font-semibold text-token-primary">
                {Math.round(logo.size * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.25"
              step="0.01"
              value={logo.size}
              onChange={(e) => setLogo({ size: Number(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-token-tertiary font-mono">
              <span>10% (Subtle)</span>
              <span>22% (Recommended)</span>
              <span>25% (Max)</span>
            </div>
          </div>

          {/* Logo Margin Slider */}
          <div className="space-y-2 pt-2 border-t studio-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-token-secondary">
                Logo Margin / Quiet Zone
              </label>
              <span className="text-xs font-mono font-semibold text-token-primary">
                {logo.margin}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="16"
              step="1"
              value={logo.margin}
              onChange={(e) => setLogo({ margin: Number(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Hide Dots Toggle */}
          <label className="flex items-center justify-between cursor-pointer select-none pt-2 border-t studio-border">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-token-primary">
                Clear Dots Behind Logo
              </span>
              <p className="text-[11px] text-token-tertiary">
                Leaves a clean buffer space around the center mark
              </p>
            </div>
            <input
              type="checkbox"
              checked={logo.hideBackgroundDots}
              onChange={(e) => setLogo({ hideBackgroundDots: e.target.checked })}
              className="w-4 h-4 rounded studio-border text-purple-600 focus:ring-0 cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  );
};
