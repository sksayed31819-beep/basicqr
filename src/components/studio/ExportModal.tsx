/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  FileCheck2,
  Printer,
  Sparkles,
  Layers,
  Loader2,
  Check,
  AlertCircle,
  FileImage,
  Code2,
  Lock,
  Unlock,
  Play,
} from 'lucide-react';
import { useEditorStore } from '../../stores/editor-store.ts';
import { useUiStore } from '../../stores/ui-store.ts';
import { useExportPassStore } from '../../stores/export-pass-store.ts';
import { AdUnlockModal } from '../ads/AdUnlockModal.tsx';
import { BrandLogo } from '../ui/BrandLogo.tsx';
import {
  exportCompositeRaster,
  exportCompositeSvg,
  exportCompositePdf,
} from '../../features/export/export-compositor.ts';
import type { ExportFormat, ExportResolution, PdfLayout } from '../../types/editor.ts';

export const ExportModal: React.FC = () => {
  const {
    docTitle,
    dataType,
    style,
    logo,
    frame,
    getEncodedContent,
    exportConfig,
    setExportConfig,
  } = useEditorStore();

  const { isExportModalOpen, setIsExportModalOpen } = useUiStore();
  const {
    hasActivePass,
    downloadsRemaining,
    getFormattedTimeRemaining,
    consumeDownloadCredit,
    checkExpiry,
  } = useExportPassStore();

  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(getFormattedTimeRemaining());

  useEffect(() => {
    if (!isExportModalOpen) return;
    const interval = setInterval(() => {
      checkExpiry();
      setTimeRemaining(getFormattedTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [isExportModalOpen]);

  if (!isExportModalOpen) return null;

  const payload = getEncodedContent();
  const isPassActive = hasActivePass();

  const executeExport = async (resOverride?: ExportResolution) => {
    setIsExporting(true);
    setErrorMessage(null);
    setDownloadSuccess(false);

    try {
      const targetRes = resOverride || exportConfig.resolution;
      const options = {
        payload,
        style,
        logo,
        frame,
        resolution: targetRes,
        format: exportConfig.format,
        pdfLayout: exportConfig.pdfLayout,
        filename: exportConfig.filename || docTitle || 'basic-qr-code',
        docTitle: docTitle || 'Basic QR Code',
      };

      if (exportConfig.format === 'svg') {
        await exportCompositeSvg(options);
      } else if (exportConfig.format === 'pdf') {
        await exportCompositePdf(options);
      } else {
        await exportCompositeRaster(options);
      }

      // If pro export succeeded, consume one download credit
      if (targetRes !== '512p') {
        consumeDownloadCredit();
      }

      setDownloadSuccess(true);
      setTimeout(() => {
        setIsExportModalOpen(false);
        setDownloadSuccess(false);
      }, 1400);
    } catch (err: any) {
      console.error('Export error:', err);
      setErrorMessage(err?.message || 'Failed to generate composite export file.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleTriggerExport = async () => {
    // If user has chosen standard 512p: always 100% free with 0 ads
    if (exportConfig.resolution === '512p') {
      await executeExport('512p');
      return;
    }

    // For 4K, 2K, 1080p, SVG, PDF: check if pass is active
    if (!isPassActive) {
      setIsAdModalOpen(true);
      return;
    }

    await executeExport();
  };

  const handleFreeDownload = async () => {
    await executeExport('512p');
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-dialog-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      >
        <div className="studio-panel border studio-border rounded-2xl max-w-md w-full p-6 text-token-primary shadow-2xl space-y-4 select-none relative max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b studio-border">
            <div className="flex items-center gap-2.5">
              <BrandLogo size={36} />
              <div>
                <h3 id="export-dialog-title" className="text-sm font-bold text-token-primary">
                  Export Studio Asset
                </h3>
                <p className="text-[11px] text-token-tertiary">
                  100% Free • Unlimited Resolution • No Watermarks
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsExportModalOpen(false)}
              aria-label="Close export dialog"
              className="w-8 h-8 rounded-lg hover:bg-slate-800/40 text-token-secondary hover:text-token-primary flex items-center justify-center cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pass Status Banner */}
          {isPassActive ? (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 shrink-0" />
                <span className="font-semibold">
                  Pass Active: {downloadsRemaining}/2 downloads left
                </span>
              </div>
              <span className="font-mono text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded-md">
                {timeRemaining || '10:00'}
              </span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl studio-surface border studio-border text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-token-secondary">
                <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Pro 4K / Vector Export Pass</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAdModalOpen(true)}
                className="text-[11px] font-bold text-purple-400 hover:text-purple-300 underline cursor-pointer"
              >
                Unlock with Ad
              </button>
            </div>
          )}

          {/* 1. File Format Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-token-secondary flex items-center justify-between">
              <span>File Format</span>
              <span className="text-[10px] font-mono text-purple-400 uppercase">
                {exportConfig.format}
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: 'png', label: 'PNG', icon: FileImage, desc: 'Lossless' },
                  { id: 'svg', label: 'SVG', icon: Code2, desc: 'Vector' },
                  { id: 'pdf', label: 'PDF', icon: Printer, desc: 'Print A4' },
                  { id: 'jpeg', label: 'JPEG', icon: FileCheck2, desc: 'Compact' },
                ] as const
              ).map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = exportConfig.format === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setExportConfig({ format: fmt.id as ExportFormat })}
                    className={`py-2 px-1 text-center rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-sm shadow-purple-500/20 font-bold'
                        : 'studio-surface border-studio-border text-token-secondary hover:border-purple-400/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{fmt.label}</span>
                    <span className={`text-[9px] ${isSelected ? 'text-white/80' : 'text-token-tertiary'}`}>
                      {fmt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Target Resolution (For Raster PNG / JPEG) */}
          {(exportConfig.format === 'png' || exportConfig.format === 'jpeg') && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-token-secondary flex items-center justify-between flex-wrap gap-1">
                <span>Output Resolution</span>
                <span className="text-[10px] font-mono text-token-tertiary">
                  {exportConfig.resolution === '4K'
                    ? '4096 × 4096px (Ultra Crisp)'
                    : exportConfig.resolution === '2K'
                    ? '2048 × 2048px (High Res)'
                    : exportConfig.resolution === '1080p'
                    ? '1080 × 1080px (Web Standard)'
                    : '512 × 512px (Free Preview)'}
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    { id: '512p', label: '512p', note: 'Free' },
                    { id: '1080p', label: '1080p', note: 'Pass' },
                    { id: '2K', label: '2K', note: 'Pass' },
                    { id: '4K', label: '4K', note: 'Pro Pass' },
                  ] as const
                ).map((res) => {
                  const isSelected = exportConfig.resolution === res.id;
                  return (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => setExportConfig({ resolution: res.id as ExportResolution })}
                      className={`py-2 px-1 text-center rounded-xl border transition cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-500 font-bold shadow-xs'
                          : 'studio-surface border-studio-border text-token-secondary hover:border-purple-400/50'
                      }`}
                    >
                      <span className="text-xs font-bold">{res.label}</span>
                      <span className={`text-[9px] ${isSelected ? 'text-white/80' : 'text-token-tertiary'}`}>
                        {res.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. PDF Print Layout Options (When PDF is selected) */}
          {exportConfig.format === 'pdf' && (
            <div className="space-y-1.5 pt-1 border-t studio-border">
              <label className="text-xs font-semibold text-token-secondary">
                A4 Print Document Layout
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    {
                      id: 'single',
                      label: 'Standee Card',
                      desc: '1 Large Centered Card with Corner Crop Guides',
                    },
                    {
                      id: 'sheet',
                      label: 'Sticker Sheet',
                      desc: '2×3 Grid (6 Ready-to-Cut QR Stickers)',
                    },
                  ] as const
                ).map((layout) => {
                  const isSelected = (exportConfig.pdfLayout || 'single') === layout.id;
                  return (
                    <button
                      key={layout.id}
                      type="button"
                      onClick={() => setExportConfig({ pdfLayout: layout.id as PdfLayout })}
                      className={`p-2.5 text-left rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600/15 border-purple-500 text-purple-400 font-medium ring-1 ring-purple-500/40'
                          : 'studio-surface border-studio-border text-token-secondary hover:border-purple-400/50'
                      }`}
                    >
                      <div className="text-xs font-bold text-token-primary">{layout.label}</div>
                      <div className="text-[10px] text-token-tertiary mt-0.5 leading-snug">
                        {layout.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Filename Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-token-secondary">Filename</label>
            <div className="flex items-center">
              <input
                type="text"
                value={exportConfig.filename || docTitle || 'basic-qr-code'}
                onChange={(e) => setExportConfig({ filename: e.target.value })}
                className="w-full px-3 py-1.5 text-xs font-mono studio-surface border studio-border rounded-lg text-token-primary focus:outline-none focus:border-purple-500"
                placeholder="basic-qr-code"
              />
              <span className="text-xs font-mono text-token-tertiary ml-2 shrink-0">
                .{exportConfig.format}
              </span>
            </div>
          </div>

          {/* Error Feedback */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleTriggerExport}
              className={`w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : isExporting
                  ? 'bg-purple-700/60 cursor-wait'
                  : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30 active:scale-98'
              }`}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rendering Composite {exportConfig.format.toUpperCase()}...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Download Started!</span>
                </>
              ) : !isPassActive && exportConfig.resolution !== '512p' ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Unlock &amp; Download ({exportConfig.format.toUpperCase()})</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    Download{' '}
                    {exportConfig.format === 'pdf'
                      ? `Print PDF (${exportConfig.pdfLayout === 'sheet' ? 'Sheet' : 'Card'})`
                      : exportConfig.format === 'svg'
                      ? 'Vector SVG'
                      : `${exportConfig.resolution} ${exportConfig.format.toUpperCase()}`}
                  </span>
                </>
              )}
            </button>

            {/* Always-free 512px quick link if pro resolution selected */}
            {!isPassActive && exportConfig.resolution !== '512p' && (
              <button
                type="button"
                onClick={handleFreeDownload}
                className="text-xs text-token-secondary hover:text-token-primary text-center underline cursor-pointer py-0.5"
              >
                Or download standard 512px PNG immediately (Free, No Ad)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rewarded Ad Unlock Modal */}
      <AdUnlockModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onFreeDownloadRequested={handleFreeDownload}
        onPassUnlocked={() => {
          setIsAdModalOpen(false);
          // Auto-trigger the pending pro export once unlocked
          executeExport();
        }}
      />
    </>
  );
};
