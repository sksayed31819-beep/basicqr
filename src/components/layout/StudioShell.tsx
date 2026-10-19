/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Palette,
  FileCode2,
  Download,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Shapes,
  Image as ImageIcon,
  LayoutTemplate,
  SquareCode,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertTriangle,
  Wand2,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { useEditorStore } from '../../stores/editor-store.ts';
import { useUiStore } from '../../stores/ui-store.ts';
import { useExportPassStore } from '../../stores/export-pass-store.ts';
import { NavRail } from './NavRail.tsx';
import { ContentPanel } from '../studio/ContentPanel.tsx';
import { StylePanel } from '../studio/StylePanel.tsx';
import { ShapesPanel } from '../studio/ShapesPanel.tsx';
import { LogoPanel } from '../studio/LogoPanel.tsx';
import { FramePanel } from '../studio/FramePanel.tsx';
import { TemplatesPanel } from '../studio/TemplatesPanel.tsx';
import { QrCanvasPreview } from '../preview/QrCanvasPreview.tsx';
import { ExportModal } from '../studio/ExportModal.tsx';
import type { StudioRailTab } from '../../types/editor.ts';

export const StudioShell: React.FC = () => {
  const {
    dataType,
    style,
    logo,
    frame,
    scannability,
    getEncodedContent,
    applySafeContrastFallback,
  } = useEditorStore();

  const {
    activeRailTab,
    setActiveRailTab,
    setIsExportModalOpen,
    setIsGuidesModalOpen,
    setIsLegalModalOpen,
  } = useUiStore();

  const { hasActivePass, downloadsRemaining } = useExportPassStore();
  const isPassActive = hasActivePass();

  const [copied, setCopied] = useState(false);
  const [showValidationDetails, setShowValidationDetails] = useState(true);
  const [isMobilePreviewExpanded, setIsMobilePreviewExpanded] = useState(false);

  const rawPayload = getEncodedContent();

  const handleCopyPayload = () => {
    if (!rawPayload) return;
    navigator.clipboard.writeText(rawPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mobileTabs = [
    { id: 'content', label: 'Content', icon: FileCode2 },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'shapes', label: 'Shapes', icon: Shapes },
    { id: 'logo', label: 'Logo', icon: Sparkles },
    { id: 'frame', label: 'Frame', icon: SquareCode },
    { id: 'templates', label: 'Presets', icon: LayoutTemplate },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
      {/* ============================================================== */}
      {/* ROW 2 ON MOBILE (lg:hidden shrink-0): UNIFIED LIVE PREVIEW STAGE BAR */}
      {/* Attached flush directly below TopToolbar with zero gap */}
      {/* ============================================================== */}
      <div className="lg:hidden shrink-0 border-b border-[var(--border)] bg-[var(--panel-bg)] px-3.5 py-2.5 flex items-center gap-3.5 z-20 select-none">
        {/* Left: 80px × 80px Interactive Mini Canvas Stage with subtle dot-grid */}
        <div
          onClick={() => setIsMobilePreviewExpanded(true)}
          className="w-[80px] h-[80px] shrink-0 rounded-xl bg-[var(--surface-bg)] border border-[var(--border)] flex items-center justify-center p-1 cursor-pointer overflow-hidden relative shadow-inner group hover:border-purple-500/50 transition bg-[radial-gradient(circle,#334155_1px,transparent_1px)] [background-size:8px_8px]"
          title="Tap to expand full preview"
        >
          <div className="w-[72px] h-[72px] flex items-center justify-center overflow-hidden pointer-events-none">
            <div className="w-[260px] h-[260px] shrink-0 flex items-center justify-center origin-center scale-[0.27] select-none">
              <QrCanvasPreview size={260} runValidation={false} />
            </div>
          </div>
          {/* Corner magnifying glass indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 rounded-md bg-black/75 border border-white/20 text-white flex items-center justify-center pointer-events-none shadow-xs">
            <Maximize2 className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Right: Clean Studio Telemetry */}
        <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
          {/* Top row: Status pill + Pass pill + Expand icon */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                  scannability.passed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    scannability.passed ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
                  }`}
                />
                <span className="truncate">
                  {scannability.passed ? 'Passed' : 'Low Contrast'} • {scannability.contrastRatio.toFixed(1)}:1
                </span>
              </div>

              {isPassActive && (
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 shrink-0">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Pass: {downloadsRemaining}/2</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {!scannability.passed && (
                <button
                  type="button"
                  onClick={applySafeContrastFallback}
                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline shrink-0 cursor-pointer"
                >
                  Fix
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMobilePreviewExpanded(true)}
                title="Expand full-size preview"
                className="w-6 h-6 rounded-lg studio-surface border studio-border hover:border-purple-400/40 text-token-secondary hover:text-token-primary flex items-center justify-center cursor-pointer transition shrink-0"
              >
                <Maximize2 className="w-3 h-3 text-purple-400" />
              </button>
            </div>
          </div>

          {/* Middle row: Active Type & Frame label */}
          <div className="text-[13px] font-bold text-token-primary tracking-tight truncate">
            {dataType.toUpperCase()}
            <span className="text-token-tertiary font-normal"> • </span>
            <span className="text-purple-400 font-semibold capitalize">
              {frame.style.replace('-', ' ')}
            </span>
          </div>

          {/* Bottom row: Monospace truncated payload preview */}
          <p className="text-[11px] font-mono text-token-tertiary truncate">
            {rawPayload || 'Empty payload'}
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ROW 3: MAIN WORKSPACE (Desktop Split / Mobile Scrollable Panel) */}
      {/* ============================================================== */}
      <div className="flex-1 min-h-0 max-w-[1600px] w-full mx-auto flex overflow-hidden">
        {/* Desktop Region 1: 64px Navigation Rail */}
        <div className="hidden lg:flex">
          <NavRail />
        </div>

        {/* Customization Panel (Mobile: full-width flex-1; Desktop: 360px sidebar) */}
        <section
          aria-label="Customization Panel"
          className="w-full lg:w-[360px] border-r border-[var(--border)] bg-[var(--panel-bg)] flex flex-col flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-6 lg:p-5"
        >
          {activeRailTab === 'content' && <ContentPanel />}
          {activeRailTab === 'style' && <StylePanel />}
          {activeRailTab === 'shapes' && <ShapesPanel />}
          {activeRailTab === 'logo' && <LogoPanel />}
          {activeRailTab === 'frame' && <FramePanel />}
          {activeRailTab === 'templates' && <TemplatesPanel />}
        </section>

        {/* Desktop Region 3: Flexible Sticky Preview Workspace (1024px+) */}
        <section
          aria-label="QR Code Preview Workspace"
          className="hidden lg:flex flex-1 studio-surface flex-col items-center justify-between p-8 overflow-y-auto"
        >
          <div className="w-full max-w-[540px] flex flex-col items-center space-y-6 my-auto">
            {/* Desktop Scannability Status Banner */}
            <div className="flex items-center justify-center gap-2.5 w-full">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border shadow-xs ${
                  scannability.passed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                }`}
              >
                {scannability.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
                <span className="font-semibold">
                  {scannability.passed
                    ? `Decode test passed • Contrast: Good (${scannability.contrastRatio}:1)`
                    : `Low contrast (${scannability.contrastRatio}:1) • May not scan reliably`}
                </span>
              </div>

              {!scannability.passed && (
                <button
                  type="button"
                  onClick={applySafeContrastFallback}
                  className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>1-Click Fix</span>
                </button>
              )}
            </div>

            {/* Live QRCodeStyling Preview Card */}
            <QrCanvasPreview size={300} />

            {/* Collapsible Validation & Scannability Inspector */}
            <div className="w-full studio-panel border studio-border rounded-2xl p-4 text-token-secondary shadow-lg space-y-3">
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setShowValidationDetails(!showValidationDetails)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      scannability.passed ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'
                    }`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-token-primary">
                    Real-time Scannability &amp; Engine Status
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    Engine: qr-code-styling
                  </span>
                  {showValidationDetails ? (
                    <ChevronUp className="w-4 h-4 text-token-tertiary" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-token-tertiary" />
                  )}
                </div>
              </div>

              {showValidationDetails && (
                <div className="space-y-3 pt-2 border-t studio-border text-xs">
                  <div className="grid grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg studio-surface border studio-border">
                      <div className="text-token-tertiary">Error Level</div>
                      <div className="font-semibold text-token-primary mt-0.5">
                        Level {scannability.errorCorrection} ({scannability.errorCorrection === 'H' ? '30%' : '25%'})
                      </div>
                    </div>
                    <div className="p-2 rounded-lg studio-surface border studio-border">
                      <div className="text-token-tertiary">Dot Pattern</div>
                      <div className="font-semibold text-token-primary mt-0.5 capitalize">
                        {style.dotType}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg studio-surface border studio-border">
                      <div className="text-token-tertiary">Logo Status</div>
                      <div className="font-semibold text-token-primary mt-0.5 capitalize">
                        {logo.enabled && logo.src ? `${logo.shape} (${Math.round(logo.size * 100)}%)` : 'None'}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg studio-surface border studio-border">
                      <div className="text-token-tertiary">Frame</div>
                      <div className="font-semibold text-token-primary mt-0.5 capitalize">
                        {frame.style}
                      </div>
                    </div>
                  </div>

                  {/* Contrast & Auto-Fix Banner */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg studio-surface border studio-border text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-token-secondary">WCAG Contrast:</span>
                      <span className="font-bold text-token-primary">
                        {scannability.contrastRatio.toFixed(1)}:1 ({scannability.contrastRating})
                      </span>
                      {scannability.invertedWarning && (
                        <span className="text-amber-400 font-semibold">(Inverted Colors)</span>
                      )}
                    </div>

                    {!scannability.passed && (
                      <button
                        type="button"
                        onClick={applySafeContrastFallback}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-600 text-white font-semibold cursor-pointer hover:bg-purple-500 transition"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>1-Click Safe Contrast</span>
                      </button>
                    )}
                  </div>

                  {/* Raw Output Preview String */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-token-secondary mb-1">
                      <span>Live Decoded Payload String:</span>
                      <button
                        type="button"
                        onClick={handleCopyPayload}
                        className="inline-flex items-center gap-1 text-purple-500 hover:text-purple-400 font-medium cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied to clipboard' : 'Copy string'}
                      </button>
                    </div>
                    <div className="p-2.5 rounded-lg studio-surface border studio-border font-mono text-[11px] text-emerald-500 break-all select-all max-h-24 overflow-y-auto">
                      {rawPayload || '// Empty payload'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Helper Links in Desktop Workspace */}
            <div className="flex items-center justify-between text-[11px] text-token-tertiary w-full px-2 pt-1 select-none">
              <button
                type="button"
                onClick={() => setIsGuidesModalOpen(true)}
                className="hover:text-purple-600 dark:hover:text-purple-400 hover:underline flex items-center gap-1.5 cursor-pointer transition"
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Frequently Asked Questions (FAQ)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLegalModalOpen(true)}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>100% Client-Side Privacy Guarantee</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================== */}
      {/* ROW 4 ON MOBILE (lg:hidden shrink-0): BOTTOM NAVIGATION BAR */}
      {/* In normal document flex flow at the bottom */}
      {/* ============================================================== */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden shrink-0 h-16 border-t border-[var(--border)] bg-[var(--panel-bg)] px-1 py-1 flex items-center justify-around z-20 shadow-md"
      >
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeRailTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveRailTab(tab.id as StudioRailTab);
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1.5 px-0.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-bold bg-purple-600/15'
                  : 'text-token-secondary hover:text-token-primary'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate tracking-tighter">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ============================================================== */}
      {/* MOBILE EXPANDED FULL-SIZE PREVIEW MODAL */}
      {/* ============================================================== */}
      {isMobilePreviewExpanded && (
        <div data-theme="dark" className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col animate-fade-in p-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-token-primary">
                Full-Size Preview
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-semibold border border-purple-500/30">
                Level {scannability.errorCorrection}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobilePreviewExpanded(false)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold studio-surface border studio-border text-token-secondary flex items-center gap-1 cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Collapse to Edit</span>
            </button>
          </div>

          {/* Centered QR card */}
          <div className="my-auto py-6 flex flex-col items-center justify-center space-y-4">
            <div className="p-2 rounded-2xl shadow-2xl flex items-center justify-center">
              <QrCanvasPreview size={260} />
            </div>

            {/* Checklist summary */}
            <div className="w-full max-w-sm studio-panel border studio-border rounded-xl p-3 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-token-secondary">Software Decode:</span>
                <span className={`font-semibold ${scannability.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {scannability.passed ? 'Pass (Valid)' : 'Needs Adjustment'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-token-secondary">WCAG Contrast:</span>
                <span className="font-semibold text-token-primary">
                  {scannability.contrastRatio.toFixed(1)}:1 ({scannability.contrastRating})
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-token-secondary">Decoded String:</span>
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="text-purple-400 hover:text-purple-300 font-mono text-[10px] inline-flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Modal actions */}
            <div className="w-full max-w-sm grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsMobilePreviewExpanded(false)}
                className="py-2.5 rounded-xl font-semibold text-xs studio-panel border studio-border text-token-secondary hover:text-token-primary text-center cursor-pointer"
              >
                Return to Editor
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobilePreviewExpanded(false);
                  setIsExportModalOpen(true);
                }}
                className="py-2.5 rounded-xl font-bold text-xs bg-purple-600 text-white flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export 4K Asset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EXPORT MODAL (4K PNG, SVG, PDF & Ad-Gate Pass) */}
      {/* ============================================================== */}
      <ExportModal />
    </div>
  );
};
