/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PRODUCTION_AD_CONFIG, type SupportedAdNetwork } from './ad-config.ts';

let thirdPartyAdLoaded = false;

/**
 * Loads the configured third-party ad script (Monetag Vignette) on demand.
 * Called only when the user starts the export sponsor break, at most once
 * per page session. Failures (ad-blockers, network) are ignored on purpose:
 * the export unlock never depends on the ad being served.
 */
export function loadThirdPartyAdScript(): void {
  if (thirdPartyAdLoaded || typeof document === 'undefined') return;
  if (PRODUCTION_AD_CONFIG.network !== 'monetag') return;

  const { zoneId, scriptUrl } = PRODUCTION_AD_CONFIG.monetag;
  if (!zoneId || !scriptUrl) return;

  try {
    const script = document.createElement('script');
    script.dataset.zone = zoneId;
    script.src = scriptUrl;
    script.async = true;
    script.onerror = () => {
      // Blocked or unreachable: nothing to do, the countdown still unlocks the pass.
    };
    (document.body || document.documentElement).appendChild(script);
    thirdPartyAdLoaded = true;
  } catch {
    // ignore
  }
}

export interface AdNetworkConfig {
  network: SupportedAdNetwork;
  zoneId?: string;
  unitId?: string;
  adDurationSeconds: number;
}

export const ACTIVE_AD_CONFIG: AdNetworkConfig = {
  network: PRODUCTION_AD_CONFIG.network,
  zoneId:
    PRODUCTION_AD_CONFIG.network === 'monetag'
      ? PRODUCTION_AD_CONFIG.monetag.zoneId
      : PRODUCTION_AD_CONFIG.network === 'adsterra'
      ? PRODUCTION_AD_CONFIG.adsterra.zoneId
      : undefined,
  unitId:
    PRODUCTION_AD_CONFIG.network === 'gpt'
      ? PRODUCTION_AD_CONFIG.gpt.adUnitPath
      : undefined,
  adDurationSeconds: PRODUCTION_AD_CONFIG.rewardedDurationSeconds,
};

export interface RewardedAdCallbacks {
  onProgress?: (secondsRemaining: number, isPaused: boolean) => void;
  onComplete?: () => void;
  onFail?: (error: string) => void;
}

/**
 * Page-Visibility-aware sponsor-break timer.
 * Automatically pauses countdown if the user switches browser tabs or minimizes the window.
 */
export function playRewardedAdTimer({
  durationSeconds = PRODUCTION_AD_CONFIG.rewardedDurationSeconds,
  onProgress,
  onComplete,
  onFail,
}: {
  durationSeconds?: number;
} & RewardedAdCallbacks): () => void {
  let secondsLeft = durationSeconds;
  let isPaused = typeof document !== 'undefined' ? document.hidden : false;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const notify = () => {
    if (onProgress) {
      onProgress(secondsLeft, isPaused);
    }
  };

  const handleVisibilityChange = () => {
    if (typeof document === 'undefined') return;
    isPaused = document.hidden;
    notify();
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  notify();

  intervalId = setInterval(() => {
    if (isPaused) {
      notify();
      return;
    }

    secondsLeft -= 1;
    notify();

    if (secondsLeft <= 0) {
      cleanup();
      if (onComplete) onComplete();
    }
  }, 1000);

  const cleanup = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  };

  return cleanup;
}

/**
 * Sponsor campaigns rotated during the sponsor break
 */
export interface SponsorCampaign {
  id: string;
  sponsorName: string;
  headline: string;
  description: string;
  badge: string;
  accentColor: string;
  tagline: string;
}

export const SPONSOR_CAMPAIGNS: SponsorCampaign[] = [
  {
    id: 'canva-pro',
    sponsorName: 'Global Design Cloud',
    headline: 'Create Beautiful Marketing Assets in Seconds',
    description: 'Pair your custom QR codes with high-converting social graphics, flyers, and restaurant table tents.',
    badge: 'Verified Sponsor',
    accentColor: '#8B5CF6',
    tagline: 'Empowering free design tools worldwide',
  },
  {
    id: 'cloud-hosting',
    sponsorName: 'UltraFast Edge CDN',
    headline: 'Deploy Client-Side Apps Globally with Zero Latency',
    description: 'Instant SSL, automated global caching, and high availability on edge nodes worldwide.',
    badge: 'Infrastructure Partner',
    accentColor: '#3B82F6',
    tagline: 'Supporting 100% free web utilities',
  },
  {
    id: 'print-lab',
    sponsorName: 'PrintStudio Express',
    headline: 'Professional QR Sticker & Standee Printing',
    description: 'High-density matte and waterproof vinyl stickers for hospitality, events, and retail.',
    badge: 'Print Partner',
    accentColor: '#10B981',
    tagline: 'From screen to real-world print in 48 hours',
  },
];

export function getRandomSponsorCampaign(): SponsorCampaign {
  const index = Math.floor(Math.random() * SPONSOR_CAMPAIGNS.length);
  return SPONSOR_CAMPAIGNS[index];
}
