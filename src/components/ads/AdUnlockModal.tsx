/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  Sparkles,
  Play,
  X,
  Clock,
  Download,
  CheckCircle2,
  AlertTriangle,
  Pause,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useExportPassStore } from '../../stores/export-pass-store.ts';
import {
  playRewardedAdTimer,
  loadThirdPartyAdScript,
  ACTIVE_AD_CONFIG,
  getRandomSponsorCampaign,
  type SponsorCampaign,
} from '../../features/ads/ad-provider.ts';
import { BrandLogo } from '../ui/BrandLogo.tsx';
import { PRODUCTION_AD_CONFIG } from '../../features/ads/ad-config.ts';

const BREAK_SECONDS = ACTIVE_AD_CONFIG.adDurationSeconds;
const PASS_MINUTES = PRODUCTION_AD_CONFIG.passDurationMinutes;

interface AdUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFreeDownloadRequested?: () => void;
  onPassUnlocked?: () => void;
}

export const AdUnlockModal: React.FC<AdUnlockModalProps> = ({
  isOpen,
  onClose,
  onFreeDownloadRequested,
  onPassUnlocked,
}) => {
  const { status, setStatus, unlockPass } = useExportPassStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(BREAK_SECONDS);
  const [isTabPaused, setIsTabPaused] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState<SponsorCampaign>(getRandomSponsorCampaign());
  const [isCompleted, setIsCompleted] = useState(false);

  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      setIsPlaying(false);
      setIsCompleted(false);
      setSecondsRemaining(BREAK_SECONDS);
      setIsTabPaused(false);
    } else {
      setActiveCampaign(getRandomSponsorCampaign());
    }
  }, [isOpen]);

  const handleStartAd = () => {
    setIsPlaying(true);
    setStatus('ad_playing');
    setSecondsRemaining(BREAK_SECONDS);
    setIsTabPaused(false);

    // Load the sponsor script only now, when the user asked to export.
    loadThirdPartyAdScript();

    cleanupRef.current = playRewardedAdTimer({
      durationSeconds: BREAK_SECONDS,
      onProgress: (remaining, paused) => {
        setSecondsRemaining(remaining);
        setIsTabPaused(paused);
      },
      onComplete: () => {
        setIsPlaying(false);
        setIsCompleted(true);
        unlockPass();
        setTimeout(() => {
          if (onPassUnlocked) onPassUnlocked();
          onClose();
        }, 1200);
      },
    });
  };

  const handleCancelAd = () => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    setIsPlaying(false);
    setStatus('locked');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
    >
      <div className="studio-panel border studio-border rounded-2xl max-w-md w-full p-6 text-token-primary shadow-2xl space-y-5 relative overflow-hidden">
        {/* Top Close Button (if not actively playing) */}
        {!isPlaying && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close unlock modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-slate-800/40 text-token-secondary hover:text-token-primary flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* ============================================================== */}
        {/* VIEW A: REWARDED AD PLAYING VIEW */}
        {/* ============================================================== */}
        {isPlaying ? (
          <div className="space-y-5 py-2">
            {/* Header with Countdown Circle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-bold border border-purple-500/30 uppercase tracking-wider">
                  Sponsor Break
                </span>
                <span className="text-xs text-token-tertiary">
                  Unlocking 4K Downloads
                </span>
              </div>

              {/* Countdown badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border studio-border text-xs font-mono font-bold text-token-primary">
                {isTabPaused ? (
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                )}
                <span>0:{secondsRemaining.toString().padStart(2, '0')}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((BREAK_SECONDS - secondsRemaining) / BREAK_SECONDS) * 100}%` }}
              />
            </div>

            {/* Tab Paused Warning */}
            {isTabPaused && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Timer paused — keep this tab visible to complete unlock.</span>
              </div>
            )}

            {/* Sponsor Campaign Card */}
            <div
              className="p-4 rounded-xl border studio-border studio-surface space-y-2 relative"
              style={{ borderLeftColor: activeCampaign.accentColor, borderLeftWidth: '4px' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-token-secondary">
                  {activeCampaign.sponsorName}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-token-tertiary">
                  {activeCampaign.badge}
                </span>
              </div>

              <h4 className="text-sm font-bold text-token-primary leading-snug">
                {activeCampaign.headline}
              </h4>

              <p className="text-xs text-token-secondary leading-relaxed">
                {activeCampaign.description}
              </p>

              <div className="pt-1 text-[10px] text-token-tertiary italic">
                {activeCampaign.tagline}
              </div>
            </div>

            {/* Footer disclosure */}
            <div className="flex items-center justify-between text-[11px] text-token-tertiary pt-1">
              <span>Ad finishes automatically in {secondsRemaining}s</span>
              <button
                type="button"
                onClick={handleCancelAd}
                className="text-slate-400 hover:text-slate-300 underline cursor-pointer"
              >
                Cancel Ad
              </button>
            </div>
          </div>
        ) : isCompleted ? (
          /* ============================================================== */
          /* VIEW B: UNLOCK SUCCESS VIEW */
          /* ============================================================== */
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-token-primary">
              Pass Active: 2 Downloads Unlocked!
            </h3>
            <p className="text-xs text-token-secondary max-w-xs">
              You now have {PASS_MINUTES} minutes of high-resolution 4K, Vector SVG, and PDF exports.
            </p>
          </div>
        ) : (
          /* ============================================================== */
          /* VIEW C: PROMPT / VALUE PROPOSITION VIEW */
          /* ============================================================== */
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo size={40} />
              <div>
                <h3 id="ad-modal-title" className="text-base font-bold text-token-primary">
                  Your design is ready.
                </h3>
                <p className="text-xs text-token-tertiary">
                  100% Free &amp; Ad-Supported Worldwide
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl studio-surface border studio-border space-y-2 text-xs">
              <p className="text-token-secondary leading-relaxed">
                Take a short sponsor break to unlock <strong className="text-token-primary">2 high-resolution / vector downloads for {PASS_MINUTES} minutes</strong>. No subscription or credit card required.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-medium text-purple-300">
                <div className="p-2 rounded-lg studio-panel border studio-border text-center">
                  4K / 2K PNG
                </div>
                <div className="p-2 rounded-lg studio-panel border studio-border text-center">
                  Vector SVG
                </div>
                <div className="p-2 rounded-lg studio-panel border studio-border text-center">
                  Print A4 PDF
                </div>
              </div>
            </div>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={handleStartAd}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer active:scale-98"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Sponsor Break &amp; Unlock (2 Downloads)</span>
            </button>

            {/* Secondary Option: Always-free 512px */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onFreeDownloadRequested) onFreeDownloadRequested();
                }}
                className="text-xs text-token-secondary hover:text-token-primary font-medium underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Standard 512px PNG (Free, No Ad)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
