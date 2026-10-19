/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import QRCodeStyling from 'qr-code-styling';
import fileSaver from 'file-saver';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function downloadBlob(blob: Blob, filename: string) {
  if (typeof window === 'undefined') return;
  const save = (fileSaver as unknown as { saveAs?: (b: Blob, f: string) => void }).saveAs || (fileSaver as unknown as (b: Blob, f: string) => void);
  if (typeof save === 'function') {
    save(blob, filename);
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
import { createQrCodeStylingOptions } from '../qr-renderer/qr-adapter.ts';
import type {
  QrStyleConfig,
  QrLogoConfig,
  QrFrameConfig,
  ExportResolution,
  ExportFormat,
  PdfLayout,
} from '../../types/editor.ts';

export interface ExportCompositorOptions {
  payload: string;
  style: QrStyleConfig;
  logo: QrLogoConfig;
  frame: QrFrameConfig;
  resolution?: ExportResolution;
  format?: ExportFormat;
  pdfLayout?: PdfLayout;
  filename?: string;
  docTitle?: string;
}

/**
 * Calculates pixel dimensions for target raster resolution
 */
export function getRasterDimensions(resolution: ExportResolution): {
  qrSize: number;
  canvasWidth: number;
} {
  switch (resolution) {
    case '512p':
      return { qrSize: 420, canvasWidth: 512 };
    case '1080p':
      return { qrSize: 840, canvasWidth: 1080 };
    case '2K':
      return { qrSize: 1600, canvasWidth: 2048 };
    case '4K':
      return { qrSize: 3200, canvasWidth: 4096 };
    case 'vector':
    default:
      return { qrSize: 2000, canvasWidth: 2400 };
  }
}

/**
 * Calculates master canvas layout metrics based on frame style and canvas width
 */
export interface LayoutMetrics {
  width: number;
  height: number;
  framePaddingTop: number;
  framePaddingBottom: number;
  framePaddingHorizontal: number;
  qrSize: number;
  qrX: number;
  qrY: number;
  cornerRadius: number;
  textY: number;
  fontSize: number;
}

export function computeLayoutMetrics(
  frameStyle: QrFrameConfig['style'],
  canvasWidth: number
): LayoutMetrics {
  const pad = Math.round(canvasWidth * 0.065);
  const qrSize = canvasWidth - pad * 2;
  const qrX = pad;

  switch (frameStyle) {
    case 'none': {
      return {
        width: canvasWidth,
        height: canvasWidth,
        framePaddingTop: 0,
        framePaddingBottom: 0,
        framePaddingHorizontal: 0,
        qrSize: canvasWidth,
        qrX: 0,
        qrY: 0,
        cornerRadius: 0,
        textY: 0,
        fontSize: 0,
      };
    }
    case 'top-banner': {
      const bannerHeight = Math.round(canvasWidth * 0.16);
      const height = qrSize + bannerHeight + pad * 2;
      return {
        width: canvasWidth,
        height,
        framePaddingTop: pad,
        framePaddingBottom: pad,
        framePaddingHorizontal: pad,
        qrSize,
        qrX,
        qrY: pad + bannerHeight,
        cornerRadius: Math.round(canvasWidth * 0.05),
        textY: pad + Math.round(bannerHeight * 0.65),
        fontSize: Math.round(canvasWidth * 0.048),
      };
    }
    case 'polaroid': {
      const captionHeight = Math.round(canvasWidth * 0.22);
      const height = qrSize + captionHeight + pad * 2;
      return {
        width: canvasWidth,
        height,
        framePaddingTop: pad,
        framePaddingBottom: pad,
        framePaddingHorizontal: pad,
        qrSize,
        qrX,
        qrY: pad,
        cornerRadius: Math.round(canvasWidth * 0.035),
        textY: qrSize + pad + Math.round(captionHeight * 0.6),
        fontSize: Math.round(canvasWidth * 0.05),
      };
    }
    case 'ticket': {
      const ticketFooter = Math.round(canvasWidth * 0.18);
      const height = qrSize + ticketFooter + pad * 2;
      return {
        width: canvasWidth,
        height,
        framePaddingTop: pad,
        framePaddingBottom: pad,
        framePaddingHorizontal: pad,
        qrSize,
        qrX,
        qrY: pad,
        cornerRadius: Math.round(canvasWidth * 0.04),
        textY: qrSize + pad + Math.round(ticketFooter * 0.62),
        fontSize: Math.round(canvasWidth * 0.045),
      };
    }
    case 'balloon': {
      const balloonHeader = Math.round(canvasWidth * 0.16);
      const height = qrSize + balloonHeader + pad * 2;
      return {
        width: canvasWidth,
        height,
        framePaddingTop: pad,
        framePaddingBottom: pad,
        framePaddingHorizontal: pad,
        qrSize,
        qrX,
        qrY: pad + balloonHeader,
        cornerRadius: Math.round(canvasWidth * 0.05),
        textY: pad + Math.round(balloonHeader * 0.62),
        fontSize: Math.round(canvasWidth * 0.042),
      };
    }
    case 'badge':
    case 'neon':
    case 'bottom-banner':
    default: {
      const bannerHeight = Math.round(canvasWidth * 0.16);
      const height = qrSize + bannerHeight + pad * 2;
      return {
        width: canvasWidth,
        height,
        framePaddingTop: pad,
        framePaddingBottom: pad,
        framePaddingHorizontal: pad,
        qrSize,
        qrX,
        qrY: pad,
        cornerRadius: Math.round(canvasWidth * 0.05),
        textY: qrSize + pad + Math.round(bannerHeight * 0.68),
        fontSize: Math.round(canvasWidth * 0.048),
      };
    }
  }
}

/**
 * Helper to draw rounded rectangle path
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Asynchronously renders QR code via QRCodeStyling to an Image
 */
async function renderQrCodeToImage(
  payload: string,
  style: QrStyleConfig,
  logo: QrLogoConfig,
  size: number
): Promise<HTMLImageElement> {
  const options = createQrCodeStylingOptions({
    data: payload,
    style,
    logo,
    errorCorrection: logo.enabled && Boolean(logo.src) ? 'H' : 'Q',
    size,
    drawType: 'canvas',
  });

  const qrInstance = new QRCodeStyling(options);
  const blob = await qrInstance.getRawData('png');

  if (!blob) {
    throw new Error('Failed to generate raw QR code image data');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const imageBlob = blob instanceof Blob ? blob : new Blob([blob as any], { type: 'image/png' });
    const url = URL.createObjectURL(imageBlob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Builds the composite HTML5 master canvas with full frame, styling, and text
 */
export async function buildMasterCanvas({
  payload,
  style,
  logo,
  frame,
  resolution = '4K',
}: ExportCompositorOptions): Promise<HTMLCanvasElement> {
  const { canvasWidth } = getRasterDimensions(resolution);
  const metrics = computeLayoutMetrics(frame.style, canvasWidth);

  const canvas = document.createElement('canvas');
  canvas.width = metrics.width;
  canvas.height = metrics.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not acquire 2D canvas rendering context');

  // 1. Draw Frame Background
  if (frame.style !== 'none') {
    // Neon glow effect if neon frame
    if (frame.style === 'neon') {
      ctx.save();
      ctx.shadowColor = frame.color;
      ctx.shadowBlur = Math.round(canvasWidth * 0.04);
      ctx.fillStyle = frame.color;
      drawRoundedRect(ctx, 4, 4, metrics.width - 8, metrics.height - 8, metrics.cornerRadius);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = frame.color;
    drawRoundedRect(ctx, 0, 0, metrics.width, metrics.height, metrics.cornerRadius);
    ctx.fill();

    // Ticket notched cutouts if ticket frame
    if (frame.style === 'ticket') {
      ctx.save();
      const notchRadius = Math.round(canvasWidth * 0.04);
      const notchY = metrics.qrY + metrics.qrSize + Math.round(notchRadius * 0.8);

      ctx.fillStyle = style.backgroundColor;
      ctx.beginPath();
      ctx.arc(0, notchY, notchRadius, -Math.PI / 2, Math.PI / 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(metrics.width, notchY, notchRadius, Math.PI / 2, -Math.PI / 2);
      ctx.fill();

      // Dashed ticket separator line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = Math.max(2, Math.round(canvasWidth * 0.003));
      ctx.setLineDash([Math.round(canvasWidth * 0.012), Math.round(canvasWidth * 0.008)]);
      ctx.beginPath();
      ctx.moveTo(notchRadius + 8, notchY);
      ctx.lineTo(metrics.width - notchRadius - 8, notchY);
      ctx.stroke();
      ctx.restore();
    }
  } else if (!style.backgroundTransparent) {
    ctx.fillStyle = style.backgroundColor;
    ctx.fillRect(0, 0, metrics.width, metrics.height);
  }

  // 2. Draw QR Inner Canvas Surface (if frame is active)
  if (frame.style !== 'none') {
    ctx.save();
    const qrInnerRadius = Math.round(metrics.cornerRadius * 0.6);
    drawRoundedRect(ctx, metrics.qrX, metrics.qrY, metrics.qrSize, metrics.qrSize, qrInnerRadius);
    ctx.fillStyle = style.backgroundTransparent ? 'rgba(0,0,0,0)' : style.backgroundColor;
    ctx.fill();
    ctx.clip();

    // Render & Draw the high-res QR code image into clipped area
    const qrImage = await renderQrCodeToImage(payload, style, logo, metrics.qrSize);
    ctx.drawImage(qrImage, metrics.qrX, metrics.qrY, metrics.qrSize, metrics.qrSize);
    ctx.restore();
  } else {
    // No frame: draw directly across the full canvas
    const qrImage = await renderQrCodeToImage(payload, style, logo, metrics.qrSize);
    ctx.drawImage(qrImage, 0, 0, metrics.qrSize, metrics.qrSize);
  }

  // 3. Draw CTA Typography
  if (frame.style !== 'none' && frame.text) {
    ctx.save();
    ctx.font = `900 ${metrics.fontSize}px "${frame.font || 'Space Grotesk'}", -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = frame.textColor;

    if (frame.style === 'neon') {
      ctx.shadowColor = frame.textColor;
      ctx.shadowBlur = Math.round(metrics.fontSize * 0.4);
    }

    if (frame.style === 'balloon') {
      // Draw balloon pill background
      const pillWidth = Math.min(
        metrics.width * 0.85,
        ctx.measureText(frame.text.toUpperCase()).width + metrics.fontSize * 2
      );
      const pillHeight = Math.round(metrics.fontSize * 1.8);
      const pillX = (metrics.width - pillWidth) / 2;
      const pillY = metrics.textY - pillHeight / 2;

      ctx.fillStyle = style.backgroundColor;
      drawRoundedRect(ctx, pillX, pillY, pillWidth, pillHeight, pillHeight / 2);
      ctx.fill();

      ctx.fillStyle = frame.color;
      ctx.fillText(frame.text.toUpperCase(), metrics.width / 2, metrics.textY);
    } else if (frame.style === 'badge') {
      // Pill badge footer
      const badgeWidth = Math.min(
        metrics.width * 0.85,
        ctx.measureText(frame.text.toUpperCase()).width + metrics.fontSize * 2.2
      );
      const badgeHeight = Math.round(metrics.fontSize * 1.8);
      const badgeX = (metrics.width - badgeWidth) / 2;
      const badgeY = metrics.textY - badgeHeight / 2;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
      ctx.fill();

      ctx.fillStyle = frame.textColor;
      ctx.fillText(frame.text.toUpperCase(), metrics.width / 2, metrics.textY);
    } else {
      ctx.fillText(frame.text.toUpperCase(), metrics.width / 2, metrics.textY);
    }

    ctx.restore();
  }

  return canvas;
}

/**
 * 1. Export High-Res Raster (PNG / JPEG)
 */
export async function exportCompositeRaster(
  options: ExportCompositorOptions
): Promise<void> {
  const masterCanvas = await buildMasterCanvas(options);
  const format = options.format === 'jpeg' ? 'jpeg' : 'png';
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const cleanFilename = (options.filename || 'basic-qr-code').replace(/\.[^/.]+$/, '');

  return new Promise((resolve, reject) => {
    masterCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create raster blob from master canvas'));
          return;
        }
        downloadBlob(blob, `${cleanFilename}-${options.resolution || '4K'}.${format}`);
        resolve();
      },
      mimeType,
      0.95
    );
  });
}

/**
 * 2. Export True Vector SVG
 */
export async function exportCompositeSvg(
  options: ExportCompositorOptions
): Promise<void> {
  const cleanFilename = (options.filename || 'basic-qr-code').replace(/\.[^/.]+$/, '');
  const { frame, style, logo, payload } = options;
  const canvasWidth = 1000;
  const metrics = computeLayoutMetrics(frame.style, canvasWidth);

  // Get raw SVG from QRCodeStyling
  const qrOptions = createQrCodeStylingOptions({
    data: payload,
    style,
    logo,
    errorCorrection: logo.enabled && Boolean(logo.src) ? 'H' : 'Q',
    size: metrics.qrSize,
    drawType: 'svg',
  });

  const qrInstance = new QRCodeStyling(qrOptions);
  const qrSvgBlob = await qrInstance.getRawData('svg');
  if (!qrSvgBlob) throw new Error('Failed to generate raw vector QR SVG');

  const rawQrSvgText =
    qrSvgBlob instanceof Blob
      ? await qrSvgBlob.text()
      : (qrSvgBlob as any).toString('utf-8');
  // Strip outer <svg ...> tag to nest inside our master frame SVG
  const innerQrContent = rawQrSvgText
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '');

  let frameBgMarkup = '';
  if (frame.style !== 'none') {
    frameBgMarkup = `<rect width="${metrics.width}" height="${metrics.height}" rx="${metrics.cornerRadius}" fill="${frame.color}" />`;
  } else if (!style.backgroundTransparent) {
    frameBgMarkup = `<rect width="${metrics.width}" height="${metrics.height}" fill="${style.backgroundColor}" />`;
  }

  let textMarkup = '';
  if (frame.style !== 'none' && frame.text) {
    textMarkup = `
      <text x="${metrics.width / 2}" y="${metrics.textY}" font-family="${escapeXml(frame.font || 'Space Grotesk')}, sans-serif" font-size="${metrics.fontSize}px" font-weight="900" fill="${frame.textColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="2">
        ${escapeXml(frame.text.toUpperCase())}
      </text>
    `;
  }

  const compositeSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${metrics.width} ${metrics.height}" width="${metrics.width}" height="${metrics.height}">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&amp;display=swap');
    text { font-family: '${escapeXml(frame.font || 'Space Grotesk')}', sans-serif; }
  </style>
  ${frameBgMarkup}
  <g transform="translate(${metrics.qrX}, ${metrics.qrY})">
    ${innerQrContent}
  </g>
  ${textMarkup}
</svg>`;

  const blob = new Blob([compositeSvg], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, `${cleanFilename}.svg`);
}

/**
 * 3. Export Print-Ready PDF (jsPDF)
 */
export async function exportCompositePdf(
  options: ExportCompositorOptions
): Promise<void> {
  const cleanFilename = (options.filename || 'basic-qr-code').replace(/\.[^/.]+$/, '');
  const pdfLayout = options.pdfLayout || 'single';

  // Render a crisp 2K canvas for the PDF embed
  const masterCanvas = await buildMasterCanvas({
    ...options,
    resolution: '2K',
  });
  const imgData = masterCanvas.toDataURL('image/png');
  const aspectRatio = masterCanvas.height / masterCanvas.width;

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;

  if (pdfLayout === 'single') {
    // -------------------------------------------------------------
    // Single Standee Card (Centered on A4 with crop marks)
    // -------------------------------------------------------------
    const cardWidth = 110;
    const cardHeight = cardWidth * aspectRatio;
    const x = (pageWidth - cardWidth) / 2;
    const y = (pageHeight - cardHeight) / 2 - 10;

    // Header label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(options.docTitle || 'Basic QR Print Card', pageWidth / 2, y - 16, {
      align: 'center',
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Print-Ready Standee • 100% Client-Side Render', pageWidth / 2, y - 10, {
      align: 'center',
    });

    // Draw the high-res composite image
    doc.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight);

    // Subtle crop marks at the 4 corners
    doc.setDrawColor(180, 190, 205);
    doc.setLineWidth(0.3);
    const markLen = 6;
    const offset = 3;

    // Top-left
    doc.line(x - offset - markLen, y, x - offset, y);
    doc.line(x, y - offset - markLen, x, y - offset);

    // Top-right
    doc.line(x + cardWidth + offset, y, x + cardWidth + offset + markLen, y);
    doc.line(x + cardWidth, y - offset - markLen, x + cardWidth, y - offset);

    // Bottom-left
    doc.line(x - offset - markLen, y + cardHeight, x - offset, y + cardHeight);
    doc.line(x, y + cardHeight + offset, x, y + cardHeight + offset + markLen);

    // Bottom-right
    doc.line(x + cardWidth + offset, y + cardHeight, x + cardWidth + offset + markLen, y + cardHeight);
    doc.line(x + cardWidth, y + cardHeight + offset, x + cardWidth, y + cardHeight + offset + markLen);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Cut along the corner crop guides. Generated with Basic QR (basicqr.bond)', pageWidth / 2, y + cardHeight + 14, {
      align: 'center',
    });
  } else {
    // -------------------------------------------------------------
    // Sticker Sheet (2 cols x 3 rows = 6 stickers)
    // -------------------------------------------------------------
    const cols = 2;
    const rows = 3;
    const stickerWidth = 80;
    const stickerHeight = stickerWidth * aspectRatio;

    const gapX = 14;
    const gapY = 12;
    const totalGridWidth = cols * stickerWidth + (cols - 1) * gapX;
    const startX = (pageWidth - totalGridWidth) / 2;
    const startY = 24;

    // Page title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(`${options.docTitle || 'Basic QR'} — Sticker Sheet (6 Units)`, pageWidth / 2, 14, {
      align: 'center',
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const itemX = startX + c * (stickerWidth + gapX);
        const itemY = startY + r * (stickerHeight + gapY);

        doc.addImage(imgData, 'PNG', itemX, itemY, stickerWidth, stickerHeight);

        // Subtle cutting outline
        doc.setDrawColor(220, 226, 235);
        doc.setLineWidth(0.2);
        doc.rect(itemX, itemY, stickerWidth, stickerHeight);
      }
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Print on standard A4 sticker or label paper. Cut along rectangle borders.', pageWidth / 2, pageHeight - 10, {
      align: 'center',
    });
  }

  doc.save(`${cleanFilename}-print.pdf`);
}
