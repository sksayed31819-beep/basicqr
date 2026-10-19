/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Options, DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel } from 'qr-code-styling';
import type {
  QrStyleConfig,
  QrLogoConfig,
  ErrorCorrectionLevel as AppErrorCorrectionLevel,
} from '../../types/editor.ts';

export interface AdapterInput {
  data: string;
  style: QrStyleConfig;
  logo?: QrLogoConfig;
  errorCorrection?: AppErrorCorrectionLevel;
  size?: number;
  drawType?: 'canvas' | 'svg';
}

/**
 * Maps application DotType to qr-code-styling DotType
 */
export function mapDotType(type: QrStyleConfig['dotType']): DotType {
  const allowed: DotType[] = ['dots', 'rounded', 'classy', 'classy-rounded', 'square', 'extra-rounded'];
  return allowed.includes(type as DotType) ? (type as DotType) : 'rounded';
}

/**
 * Maps application CornerSquareType to qr-code-styling CornerSquareType
 */
export function mapCornerSquareType(type: QrStyleConfig['cornerSquareType']): CornerSquareType {
  if (type === 'outpoint') return 'extra-rounded';
  const allowed: CornerSquareType[] = ['dot', 'square', 'extra-rounded'];
  return allowed.includes(type as CornerSquareType) ? (type as CornerSquareType) : 'extra-rounded';
}

/**
 * Maps application CornerDotType to qr-code-styling CornerDotType
 */
export function mapCornerDotType(type: QrStyleConfig['cornerDotType']): CornerDotType {
  const allowed: CornerDotType[] = ['dot', 'square'];
  return allowed.includes(type as CornerDotType) ? (type as CornerDotType) : 'dot';
}

/**
 * Converts degrees (0-360) to radians for qr-code-styling gradient rotation
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Converts editor store state into valid, strongly-typed QRCodeStyling options.
 */
export function createQrCodeStylingOptions({
  data,
  style,
  logo,
  errorCorrection = 'Q',
  size = 300,
  drawType = 'canvas',
}: AdapterInput): Options {
  // Always enforce Level H error correction whenever an embedded logo is active
  const effectiveErrorCorrection: ErrorCorrectionLevel =
    logo?.enabled && Boolean(logo.src?.trim())
      ? 'H'
      : (errorCorrection as ErrorCorrectionLevel);

  // Never pass a tiny pixel size (<260px) to QRCodeStyling to avoid dense matrix canvas failure
  const renderSize = Math.max(260, size);

  // Maintain quiet zone / safe margin
  const effectiveMargin = Math.min(style.margin ?? 16, 24);

  const options: Options = {
    type: drawType,
    width: renderSize,
    height: renderSize,
    margin: effectiveMargin,
    data: data || ' ',
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: effectiveErrorCorrection,
    },
    dotsOptions: {
      type: mapDotType(style.dotType),
      ...(style.dotGradient?.enabled
        ? {
            gradient: {
              type: style.dotGradient.type,
              rotation: degreesToRadians(style.dotGradient.rotation || 0),
              colorStops: [
                { offset: 0, color: style.dotGradient.color1 },
                { offset: 1, color: style.dotGradient.color2 },
              ],
            },
          }
        : {
            color: style.dotColor || '#0B0D12',
          }),
    },
    cornersSquareOptions: {
      type: mapCornerSquareType(style.cornerSquareType),
      color: style.cornerSquareColor || style.dotColor || '#0B0D12',
    },
    cornersDotOptions: {
      type: mapCornerDotType(style.cornerDotType),
      color: style.cornerDotColor || style.dotColor || '#0B0D12',
    },
    backgroundOptions: {
      color: style.backgroundTransparent
        ? 'rgba(0,0,0,0)'
        : (style.backgroundColor || '#FFFFFF'),
    },
  };

  // Attach logo options if enabled
  if (logo?.enabled && logo.src?.trim()) {
    options.image = logo.src.trim();
    options.imageOptions = {
      hideBackgroundDots: logo.hideBackgroundDots !== false,
      imageSize: Math.min(Math.max(logo.size || 0.22, 0.1), 0.4),
      margin: Math.max(0, logo.margin ?? 4),
      crossOrigin: 'anonymous',
    };
  }

  return options;
}
