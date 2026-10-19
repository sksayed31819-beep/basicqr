/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Smartphone, MessageSquare, Ticket } from 'lucide-react';
import { useEditorStore } from '../../stores/editor-store.ts';
import { createQrCodeStylingOptions } from '../../features/qr-renderer/qr-adapter.ts';
import { validateRenderedQrCanvas } from '../../features/qr-validation/scannability-engine.ts';

interface QrCanvasPreviewProps {
  size?: number;
  className?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
  runValidation?: boolean;
}

export const QrCanvasPreview: React.FC<QrCanvasPreviewProps> = ({
  size = 280,
  className = '',
  onCanvasReady,
  runValidation = true,
}) => {
  const {
    style,
    logo,
    frame,
    scannability,
    setScannability,
    getEncodedContent,
  } = useEditorStore();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const validationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rawPayload = getEncodedContent();

  const triggerValidation = (canvas: HTMLCanvasElement | null) => {
    if (!runValidation || !canvas) return;
    if (!rawPayload || !rawPayload.trim()) {
      setScannability({
        isChecking: false,
        passed: false,
        decodedPayload: '',
        payloadMatch: false,
      });
      return;
    }

    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    setScannability({ isChecking: true });

    validationTimeoutRef.current = setTimeout(() => {
      const result = validateRenderedQrCanvas(canvas, rawPayload, style, logo);
      setScannability({
        passed: result.passed,
        contrastRatio: result.contrastRatio,
        contrastRating: result.contrastRating,
        decodedPayload: result.decodedPayload,
        payloadMatch: result.payloadMatch,
        invertedWarning: result.invertedWarning,
        issues: result.issues,
        lastCheckedAt: Date.now(),
        isChecking: false,
      });
    }, 200);
  };

  const renderSize = Math.max(260, size);

  useEffect(() => {
    if (!containerRef.current) return;

    const initialOptions = createQrCodeStylingOptions({
      data: rawPayload,
      style,
      logo,
      errorCorrection: scannability.errorCorrection,
      size: renderSize,
      drawType: 'canvas',
    });

    const qrCode = new QRCodeStyling(initialOptions);
    qrCodeInstanceRef.current = qrCode;

    containerRef.current.innerHTML = '';
    qrCode.append(containerRef.current);

    setTimeout(() => {
      const canvas = containerRef.current?.querySelector('canvas') || null;
      if (onCanvasReady) onCanvasReady(canvas);
      triggerValidation(canvas);
    }, 60);

    return () => {
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      if (validationTimeoutRef.current) clearTimeout(validationTimeoutRef.current);
    };
  }, [renderSize]);

  useEffect(() => {
    if (!qrCodeInstanceRef.current) return;

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      if (!qrCodeInstanceRef.current) return;

      const updatedOptions = createQrCodeStylingOptions({
        data: rawPayload,
        style,
        logo,
        errorCorrection: scannability.errorCorrection,
        size: renderSize,
        drawType: 'canvas',
      });

      qrCodeInstanceRef.current.update(updatedOptions);

      setTimeout(() => {
        const canvas = containerRef.current?.querySelector('canvas') || null;
        if (onCanvasReady) onCanvasReady(canvas);
        triggerValidation(canvas);
      }, 40);
    }, 120);

    return () => {
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      if (validationTimeoutRef.current) clearTimeout(validationTimeoutRef.current);
    };
  }, [
    rawPayload,
    style.dotType,
    style.dotColor,
    style.dotGradient.enabled,
    style.dotGradient.type,
    style.dotGradient.color1,
    style.dotGradient.color2,
    style.dotGradient.rotation,
    style.cornerSquareType,
    style.cornerSquareColor,
    style.cornerDotType,
    style.cornerDotColor,
    style.backgroundColor,
    style.backgroundTransparent,
    style.margin,
    logo?.enabled,
    logo?.src,
    logo?.size,
    logo?.margin,
    logo?.hideBackgroundDots,
    logo?.shape,
    scannability.errorCorrection,
    size,
    runValidation,
  ]);

  return (
    <div
      className={`relative flex flex-col items-center justify-center transition-all duration-300 ${className}`}
      style={{
        backgroundColor: frame.style !== 'none' ? frame.color : style.backgroundColor,
        borderRadius:
          size < 80
            ? '8px'
            : frame.style === 'polaroid'
            ? '12px'
            : frame.style === 'ticket'
            ? '16px'
            : frame.style === 'neon'
            ? '24px'
            : '20px',
        padding:
          frame.style === 'none'
            ? '0px'
            : size < 80
            ? '3px 3px 5px 3px'
            : size < 120
            ? '8px 8px 12px 8px'
            : frame.style === 'polaroid'
            ? '20px 20px 34px 20px'
            : frame.style === 'ticket'
            ? '22px 22px 28px 22px'
            : '20px',
        boxShadow:
          size < 80
            ? 'none'
            : frame.style === 'neon'
            ? `0 0 35px ${frame.color}80, 0 20px 50px rgba(0,0,0,0.3)`
            : '0 20px 50px rgba(0,0,0,0.22)',
        fontFamily: frame.font || 'Space Grotesk',
      }}
    >
      {/* Frame: Top Banner */}
      {frame.style === 'top-banner' && frame.text && (
        <div
          className={`${size < 80 ? 'mb-0.5 text-[6.5px] py-0' : size < 120 ? 'mb-1 text-[8px] py-0.5' : 'mb-3 text-xs py-1.5'} font-black tracking-widest uppercase text-center px-1 truncate max-w-full`}
          style={{ color: frame.textColor }}
        >
          {frame.text}
        </div>
      )}

      {/* Frame: Balloon Header */}
      {frame.style === 'balloon' && frame.text && (
        <div
          className={`${size < 80 ? 'mb-0.5 text-[6.5px] px-1 py-0' : size < 120 ? 'mb-1 text-[8px] px-2 py-0.5' : 'mb-3 text-xs px-3 py-1'} inline-flex items-center gap-1 rounded-full font-bold tracking-wide shadow-xs truncate max-w-full`}
          style={{ backgroundColor: style.backgroundColor, color: frame.color }}
        >
          <MessageSquare className={size < 80 ? 'w-2 h-2' : size < 120 ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
          <span className="truncate">{frame.text}</span>
        </div>
      )}

      {/* QR Code Container Surface */}
      <div
        className="relative overflow-hidden flex items-center justify-center transition-colors"
        style={{
          backgroundColor: style.backgroundTransparent ? 'transparent' : style.backgroundColor,
          borderRadius:
            frame.style === 'polaroid'
              ? '6px'
              : frame.style === 'ticket'
              ? '10px'
              : '14px',
          boxShadow: style.backgroundTransparent ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.06)',
        }}
      >
        <div ref={containerRef} className="flex items-center justify-center select-none [&_canvas]:!w-full [&_canvas]:!h-full [&_canvas]:object-contain" />
      </div>

      {/* Frame: Bottom Banner */}
      {frame.style === 'bottom-banner' && frame.text && (
        <div
          className={`${size < 80 ? 'mt-0.5 text-[6.5px] py-0' : size < 120 ? 'mt-1 text-[8px] py-0.5' : 'mt-3.5 text-xs py-1.5'} font-black tracking-widest uppercase text-center px-1 truncate max-w-full`}
          style={{ color: frame.textColor }}
        >
          {frame.text}
        </div>
      )}

      {/* Frame: Ticket Stub Header & Notch */}
      {frame.style === 'ticket' && frame.text && (
        <div className={`${size < 80 ? 'mt-0.5 pt-0.5 text-[6.5px]' : size < 120 ? 'mt-1 pt-1 text-[8px]' : 'mt-3 pt-2.5 text-xs'} w-full border-t border-dashed border-white/30 flex items-center justify-between px-1`}>
          <div className="flex items-center gap-1 font-bold uppercase tracking-wider truncate" style={{ color: frame.textColor }}>
            <Ticket className={size < 80 ? 'w-2 h-2' : size < 120 ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
            <span className="truncate">{frame.text}</span>
          </div>
          <span className="text-[7px] font-mono opacity-80" style={{ color: frame.textColor }}>
            PASS
          </span>
        </div>
      )}

      {/* Frame: Neon Glow Footer */}
      {frame.style === 'neon' && frame.text && (
        <div
          className={`${size < 80 ? 'mt-0.5 text-[6.5px] py-0' : size < 120 ? 'mt-1 text-[8px] py-0.5' : 'mt-3 text-xs py-1'} font-black tracking-widest uppercase text-center px-1 truncate max-w-full`}
          style={{
            color: frame.textColor,
            textShadow: size < 80 ? 'none' : `0 0 10px ${frame.textColor}`,
          }}
        >
          {frame.text}
        </div>
      )}

      {/* Frame: Polaroid Caption */}
      {frame.style === 'polaroid' && frame.text && (
        <div
          className={`${size < 80 ? 'mt-0.5 text-[7px]' : size < 120 ? 'mt-1 text-[9px]' : 'mt-4 text-sm'} font-semibold tracking-wide text-center px-1 truncate max-w-full`}
          style={{ color: frame.textColor }}
        >
          {frame.text}
        </div>
      )}

      {/* Frame: Badge */}
      {frame.style === 'badge' && frame.text && (
        <div className={`${size < 80 ? 'mt-0.5 px-1 py-0 text-[6.5px]' : size < 120 ? 'mt-1 px-2 py-0.5 text-[8px]' : 'mt-3 px-3.5 py-1 text-[11px]'} inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md font-bold tracking-wide uppercase text-white shadow-xs truncate max-w-full`}>
          <Smartphone className={size < 80 ? 'w-2 h-2' : size < 120 ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
          <span className="truncate">{frame.text}</span>
        </div>
      )}
    </div>
  );
};
