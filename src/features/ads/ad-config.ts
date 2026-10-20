/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * ============================================================================
 * BASIC QR — AD-NETWORK PRODUCTION INTEGRATION CONFIGURATION
 * ============================================================================
 *
 * This file provides a clean, single-point configuration for monetizing the
 * Basic QR Studio with rewarded ads or sponsor breaks.
 *
 * SUPPORTED INTEGRATION MODES:
 * 1. 'direct_sponsor' (Default):
 *    - Built-in sponsor break with visibility awareness (tab pause detection).
 *    - Requires zero external scripts, zero API keys, and has 100% uptime.
 *
 * 2. 'monetag':
 *    - Monetag Vignette banner (zone + script URL from your Monetag dashboard).
 *    - The script is loaded ONLY when the user starts the export sponsor break,
 *      never on normal page views.
 *    - The export unlock never depends on the ad being served (ad-blockers are fine).
 *
 * 3. 'adsterra':
 *    - Adsterra Social Bar / Popunder / Rewarded banner.
 *    - Set `network: 'adsterra'` and supply your Adsterra `zoneId` / `scriptUrl`.
 *
 * 4. 'gpt' (Google Publisher Tag / Ad Manager / Rewarded Web):
 *    - Google Ad Manager Rewarded Web Ads (BETA).
 *    - Set `network: 'gpt'` and configure `adUnitPath`.
 *
 * ============================================================================
 */

export type SupportedAdNetwork = 'direct_sponsor' | 'monetag' | 'adsterra' | 'gpt';

export interface ProductionAdConfig {
  /**
   * The active ad network to use.
   * Default: 'direct_sponsor'
   */
  network: SupportedAdNetwork;

  /**
   * Required duration (seconds) user must watch before the pass is unlocked.
   * Currently: 15 seconds.
   */
  rewardedDurationSeconds: number;

  /**
   * Duration of the unlocked pass in minutes.
   * Currently: 20 minutes.
   */
  passDurationMinutes: number;

  /**
   * Maximum high-res / vector exports permitted per pass session.
   * Default: 2 downloads.
   */
  downloadsPerPass: number;

  /**
   * Monetag configuration parameters
   */
  monetag: {
    zoneId: string;
    scriptUrl?: string;
  };

  /**
   * Adsterra configuration parameters
   */
  adsterra: {
    zoneId: string;
    scriptUrl?: string;
  };

  /**
   * Google Publisher Tag (GPT) Rewarded Web configuration
   */
  gpt: {
    adUnitPath: string;
  };

  /**
   * Fallback configuration
   */
  fallbackToSponsorOnAdBlock: boolean;
}

/**
 * PRODUCTION CONFIGURATION
 * Edit the values below when deploying your custom ad network tags!
 */
export const PRODUCTION_AD_CONFIG: ProductionAdConfig = {
  // Switch to 'monetag', 'adsterra', or 'gpt' when you have approved publisher tags:
  network: 'monetag',

  rewardedDurationSeconds: 15,
  passDurationMinutes: 20,
  downloadsPerPass: 2,

  monetag: {
    // Monetag Vignette banner zone (from the Monetag dashboard tag)
    zoneId: '12075715',
    scriptUrl: 'https://n6wxm.com/vignette.min.js',
  },

  adsterra: {
    // Paste your Adsterra Zone ID here
    zoneId: '',
    scriptUrl: '',
  },

  gpt: {
    // Google Ad Manager Rewarded Ad Unit Path (e.g., '/1234567/rewarded_qr_export')
    adUnitPath: '',
  },

  // If a 3rd party ad fails or is blocked by an ad-blocker, gracefully fall back
  // to the sponsor card so the user can ALWAYS unlock their download!
  fallbackToSponsorOnAdBlock: true,
};

/**
 * Checks whether the app is currently using third-party script-based ads
 */
export function isThirdPartyAdNetworkActive(): boolean {
  return PRODUCTION_AD_CONFIG.network !== 'direct_sponsor';
}

/**
 * Formats user-facing unlock description text
 */
export function getUnlockBenefitDescription(): string {
  return `${PRODUCTION_AD_CONFIG.downloadsPerPass} High-Res (4K, SVG, PDF) exports for ${PRODUCTION_AD_CONFIG.passDurationMinutes} minutes`;
}
