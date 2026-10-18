/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsQR from 'jsqr';
import type {
  QrStyleConfig,
  QrLogoConfig,
  ContrastRating,
} from '../../types/editor.ts';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface ValidationResult {
  passed: boolean;
  contrastRatio: number;
  contrastRating: ContrastRating;
  decodedPayload: string | null;
  payloadMatch: boolean;
  invertedWarning: boolean;
  issues: string[];
}

/**
 * Parses a hex color string into RGB channels
 */
export function hexToRgb(hex: string): RgbColor | null {
  if (!hex) return null;
  let clean = hex.trim().replace(/^#/, '');

  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }

  if (clean.length < 6) return null;

  const num = parseInt(clean.substring(0, 6), 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Computes WCAG 2.2 relative luminance for sRGB channels
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Computes WCAG contrast ratio between two hex colors (1:1 to 21:1)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 21;

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Number(ratio.toFixed(2));
}

/**
 * Checks whether foreground color is lighter in luminance than background (inverted polarity)
 */
export function isColorInverted(fgHex: string, bgHex: string): boolean {
  const rgbFg = hexToRgb(fgHex);
  const rgbBg = hexToRgb(bgHex);
  if (!rgbFg || !rgbBg) return false;

  const lumFg = getRelativeLuminance(rgbFg.r, rgbFg.g, rgbFg.b);
  const lumBg = getRelativeLuminance(rgbBg.r, rgbBg.g, rgbBg.b);

  return lumFg > lumBg;
}

/**
 * Validates rendered QR code canvas using jsQR and WCAG contrast heuristics
 */
export function validateRenderedQrCanvas(
  canvas: HTMLCanvasElement,
  expectedPayload: string,
  style: QrStyleConfig,
  logo?: QrLogoConfig
): ValidationResult {
  const effectiveBg = style.backgroundTransparent ? '#FFFFFF' : style.backgroundColor || '#FFFFFF';
  let contrastRatio = 21;
  let isInverted = false;

  // 1. WCAG Contrast Analysis (evaluating both stops for gradients)
  if (style.dotGradient?.enabled) {
    const ratio1 = getContrastRatio(style.dotGradient.color1, effectiveBg);
    const ratio2 = getContrastRatio(style.dotGradient.color2, effectiveBg);
    contrastRatio = Math.min(ratio1, ratio2);

    const inv1 = isColorInverted(style.dotGradient.color1, effectiveBg);
    const inv2 = isColorInverted(style.dotGradient.color2, effectiveBg);
    isInverted = inv1 || inv2;
  } else {
    contrastRatio = getContrastRatio(style.dotColor || '#0B0D12', effectiveBg);
    isInverted = isColorInverted(style.dotColor || '#0B0D12', effectiveBg);
  }

  // 2. Extract ImageData from canvas for jsQR
  let imageData: ImageData | null = null;
  try {
    if (style.backgroundTransparent) {
      // Composite onto white background offscreen so jsQR can decode transparent outputs
      const offscreen = document.createElement('canvas');
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const ctx = offscreen.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, offscreen.width, offscreen.height);
        ctx.drawImage(canvas, 0, 0);
        imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
      }
    } else {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }
    }
  } catch (err) {
    console.warn('Canvas imageData extraction note:', err);
  }

  // 3. Run jsQR Decode Test
  let decodedData: string | null = null;
  let softwareDecodePassed = false;
  let payloadMatch = false;

  if (imageData && imageData.width > 0 && imageData.height > 0) {
    try {
      const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: isInverted ? 'attemptBoth' : 'dontInvert',
      });

      if (qrResult) {
        decodedData = qrResult.data;
        softwareDecodePassed = true;
        payloadMatch = decodedData.trim() === expectedPayload.trim();
      }
    } catch (e) {
      console.warn('jsQR execution error:', e);
    }
  }

  // 4. Collect Structured Warnings & Issues
  const issues: string[] = [];

  if (!softwareDecodePassed) {
    issues.push('Software decode test failed — camera cannot locate QR alignment patterns.');
  } else if (!payloadMatch) {
    issues.push('Decoded payload mismatch: content appears truncated or altered.');
  }

  if (isInverted) {
    issues.push('Inverted colors detected: dots are lighter than background. Many hardware scanners only support dark-on-light.');
  }

  if (contrastRatio < 3.0) {
    issues.push(`Critical low contrast ratio (${contrastRatio.toFixed(1)}:1) — minimum 4.5:1 recommended.`);
  } else if (contrastRatio < 4.5) {
    issues.push(`Marginal contrast ratio (${contrastRatio.toFixed(1)}:1) — may struggle under poor lighting or print glare.`);
  }

  if (style.margin < 12) {
    issues.push(`Quiet zone margin is ${style.margin}px — recommended at least 12px to prevent background interference.`);
  }

  if (logo?.enabled && (logo.size || 0.22) > 0.22) {
    issues.push(`Center logo size (${Math.round((logo.size || 0.22) * 100)}%) is above the 22% safe threshold.`);
  }

  // 5. Determine Overall Contrast Rating
  let contrastRating: ContrastRating = 'Good';
  if (!softwareDecodePassed || contrastRatio < 3.0 || !payloadMatch) {
    contrastRating = 'Poor';
  } else if (contrastRatio < 4.5 || isInverted || style.margin < 12 || (logo?.enabled && (logo.size || 0.22) > 0.22)) {
    contrastRating = 'Warning';
  }

  return {
    passed: softwareDecodePassed && payloadMatch,
    contrastRatio,
    contrastRating,
    decodedPayload: decodedData,
    payloadMatch,
    invertedWarning: isInverted,
    issues,
  };
}
