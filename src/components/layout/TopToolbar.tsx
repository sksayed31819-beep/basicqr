/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Download,
  HelpCircle,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { useUiStore } from '../../stores/ui-store.ts';
import { useExportPassStore } from '../../stores/export-pass-store.ts';

import { BrandLogo } from '../ui/BrandLogo.tsx';

export const TopToolbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    setIsExportModalOpen,
    setIsGuidesModalOpen,
    setIsLegalModalOpen,
  } = useUiStore();
  const { hasActivePass, downloadsRemaining, checkExpiry } = useExportPassStore();

  React.useEffect(() => {
    const timer = setInterval(() => {
      checkExpiry();
    }, 1000);
    return () => clearInterval(timer);
  }, [checkExpiry]);

  const isPassActive = hasActivePass();

  return (
    <header className="studio-header h-14 border-b border-[var(--border)] sticky top-0 z-40 px-3 sm:px-4 flex items-center justify-between w-full select-none shrink-0">
      {/* Left side: Official Neon Orbit Brand Logo & Styled Text */}
      <div className="flex items-center gap-2 min-w-0">
        <BrandLogo size={32} showText={true} />
      </div>

      {/* Right side: Actions row (Zero overflow on 320px-390px screens) */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Pass Active Pill (Desktop/Tablet >=640px only; mobile shows it in Stage Bar) */}
        {isPassActive && (
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pass: {downloadsRemaining}/2</span>
          </div>
        )}

        {/* FAQ Button (34px icon on mobile, icon+label on sm+) */}
        <button
          type="button"
          onClick={() => setIsGuidesModalOpen(true)}
          aria-label="Frequently Asked Questions"
          title="Frequently Asked Questions"
          className="w-[34px] h-[34px] sm:w-auto sm:px-3 sm:h-9 rounded-xl flex items-center justify-center gap-1.5 border border-[var(--border)] hover:bg-[var(--surface-hover)] text-token-secondary hover:text-token-primary text-xs font-medium transition cursor-pointer whitespace-nowrap shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="hidden sm:inline font-semibold">FAQ</span>
        </button>

        {/* Privacy Button (34px icon on mobile, icon+label on sm+) */}
        <button
          type="button"
          onClick={() => setIsLegalModalOpen(true)}
          aria-label="Privacy Policy & Terms"
          title="Privacy Policy & Terms of Service"
          className="w-[34px] h-[34px] sm:w-auto sm:px-3 sm:h-9 rounded-xl flex items-center justify-center gap-1.5 border border-[var(--border)] hover:bg-[var(--surface-hover)] text-token-secondary hover:text-token-primary text-xs font-medium transition cursor-pointer whitespace-nowrap shrink-0"
        >
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="hidden sm:inline font-semibold">Privacy</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-[34px] h-[34px] sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border border-[var(--border)] hover:bg-[var(--surface-hover)] text-token-secondary hover:text-token-primary transition cursor-pointer shrink-0"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Moon className="w-4 h-4 text-purple-600 shrink-0" />
          )}
        </button>

        {/* Primary Purple Export Button */}
        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-semibold cta-brand text-white shadow-sm  transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden md:inline">Export 4K / Vector</span>
          <span className="md:hidden">Export</span>
        </button>
      </div>
    </header>
  );
};
