/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 32,
  className = '',
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Official Basic QR Neon Orbit Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none filter drop-shadow-[0_2px_10px_rgba(0,242,254,0.3)]"
        aria-label="Basic QR Neon Orbit Logo"
      >
        <defs>
          {/* Main 3D "B" Neon Gradient (Cyan -> Electric Blue -> Neon Purple) */}
          <linearGradient id="neonBGrad" x1="18" y1="16" x2="96" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F2FE" />
            <stop offset="28%" stopColor="#0099FF" />
            <stop offset="65%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>

          {/* Top Bevel Highlight (Cyan Glow) */}
          <linearGradient id="topBevelGrad" x1="32" y1="16" x2="75" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>

          {/* Orbital Swoosh Gradient */}
          <linearGradient id="swooshGrad" x1="10" y1="65" x2="110" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F2FE" />
            <stop offset="40%" stopColor="#38BDF8" />
            <stop offset="75%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Subtle neon glow filter */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Back portion of the orbital ring (behind the B) */}
        <path
          d="M 68 36 C 85 36, 106 42, 106 49 C 106 55, 94 60, 80 64"
          stroke="url(#swooshGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* 3D Geometric "B" Outer Shape */}
        {/* Left vertical pillar */}
        <path
          d="M 32 18 L 46 30 L 46 88 L 32 88 Z"
          fill="url(#neonBGrad)"
        />

        {/* Top Fold / Bevel */}
        <path
          d="M 32 18 L 72 18 C 84 18, 92 25, 88 38 C 84 48, 72 52, 60 52 L 46 52 L 46 30 Z"
          fill="url(#topBevelGrad)"
        />

        {/* Bottom Loop / Curve (Curving down to purple/violet) */}
        <path
          d="M 46 48 L 62 48 C 76 48, 94 54, 94 68 C 94 82, 78 88, 62 88 L 32 88 L 46 76 L 62 76 C 70 76, 78 72, 78 66 C 78 60, 70 56, 60 56 L 46 56 Z"
          fill="url(#neonBGrad)"
        />

        {/* Front Orbital Swoosh (Crossing in front of the lower B) */}
        <path
          d="M 12 62 C 12 76, 36 82, 64 74 C 84 68, 98 56, 98 48 C 98 44, 92 42, 84 42 C 74 42, 54 48, 38 56 C 24 63, 12 62, 12 62 Z"
          fill="url(#swooshGrad)"
          filter="url(#neonGlow)"
        />

        {/* Center QR Matrix Core (Crisp White High-Tech QR Pattern) */}
        <g fill="#FFFFFF" transform="translate(48, 32)">
          {/* Top-Left Finder Pattern */}
          <path d="M 0 0 H 12 V 12 H 0 Z M 2 2 V 10 H 10 V 2 Z M 4 4 H 8 V 8 H 4 Z" />
          
          {/* Top-Right Finder Pattern */}
          <path d="M 16 0 H 28 V 12 H 16 Z M 18 2 V 10 H 26 V 2 Z M 20 4 H 24 V 8 H 20 Z" />

          {/* Bottom-Left Finder Pattern */}
          <path d="M 0 16 H 12 V 28 H 0 Z M 2 18 V 26 H 10 V 18 Z M 4 20 H 8 V 24 H 4 Z" />

          {/* Matrix data bits */}
          <rect x="14" y="2" width="2" height="2" rx="0.5" />
          <rect x="14" y="6" width="2" height="2" rx="0.5" />
          <rect x="14" y="10" width="2" height="2" rx="0.5" />
          <rect x="14" y="16" width="2" height="2" rx="0.5" />
          <rect x="18" y="14" width="2" height="2" rx="0.5" />
          <rect x="22" y="16" width="2" height="2" rx="0.5" />
          <rect x="26" y="14" width="2" height="2" rx="0.5" />
          <rect x="14" y="20" width="4" height="2" rx="0.5" />
          <rect x="20" y="20" width="2" height="4" rx="0.5" />
          <rect x="24" y="24" width="4" height="4" rx="0.5" />
          <rect x="14" y="26" width="4" height="2" rx="0.5" />
        </g>
      </svg>

      {/* Brand Text: Basic in adaptive token-primary, QR in cyan-to-purple gradient */}
      {showText && (
        <span className="font-heading font-black text-base tracking-tight select-none">
          <span className="text-token-primary">Basic</span>{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            QR
          </span>
        </span>
      )}
    </div>
  );
};

/**
 * Returns a standalone SVG data URI for embedding into QR codes and favicons
 */
export const BASIC_QR_NEON_ORBIT_SVG_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgrad" x1="18" y1="16" x2="96" y2="92" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00F2FE" />
      <stop offset="30%" stop-color="#0099FF" />
      <stop offset="65%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#9333EA" />
    </linearGradient>
    <linearGradient id="tgrad" x1="32" y1="16" x2="75" y2="45" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="45%" stop-color="#0284C7" />
      <stop offset="100%" stop-color="#1E40AF" />
    </linearGradient>
    <linearGradient id="sgrad" x1="10" y1="65" x2="110" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00F2FE" />
      <stop offset="50%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#A855F7" />
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="24" fill="#0B0D12" />
  <path d="M 68 36 C 85 36, 106 42, 106 49 C 106 55, 94 60, 80 64" stroke="url(#sgrad)" stroke-width="6" stroke-linecap="round" opacity="0.85" />
  <path d="M 32 18 L 46 30 L 46 88 L 32 88 Z" fill="url(#bgrad)" />
  <path d="M 32 18 L 72 18 C 84 18, 92 25, 88 38 C 84 48, 72 52, 60 52 L 46 52 L 46 30 Z" fill="url(#tgrad)" />
  <path d="M 46 48 L 62 48 C 76 48, 94 54, 94 68 C 94 82, 78 88, 62 88 L 32 88 L 46 76 L 62 76 C 70 76, 78 72, 78 66 C 78 60, 70 56, 60 56 L 46 56 Z" fill="url(#bgrad)" />
  <path d="M 12 62 C 12 76, 36 82, 64 74 C 84 68, 98 56, 98 48 C 98 44, 92 42, 84 42 C 74 42, 54 48, 38 56 C 24 63, 12 62, 12 62 Z" fill="url(#sgrad)" />
  <g fill="#FFFFFF" transform="translate(48, 32)">
    <path d="M 0 0 H 12 V 12 H 0 Z M 2 2 V 10 H 10 V 2 Z M 4 4 H 8 V 8 H 4 Z" />
    <path d="M 16 0 H 28 V 12 H 16 Z M 18 2 V 10 H 26 V 2 Z M 20 4 H 24 V 8 H 20 Z" />
    <path d="M 0 16 H 12 V 28 H 0 Z M 2 18 V 26 H 10 V 18 Z M 4 20 H 8 V 24 H 4 Z" />
    <rect x="14" y="2" width="2" height="2" rx="0.5" />
    <rect x="14" y="6" width="2" height="2" rx="0.5" />
    <rect x="14" y="10" width="2" height="2" rx="0.5" />
    <rect x="14" y="16" width="2" height="2" rx="0.5" />
    <rect x="18" y="14" width="2" height="2" rx="0.5" />
    <rect x="22" y="16" width="2" height="2" rx="0.5" />
    <rect x="26" y="14" width="2" height="2" rx="0.5" />
    <rect x="14" y="20" width="4" height="2" rx="0.5" />
    <rect x="20" y="20" width="2" height="4" rx="0.5" />
    <rect x="24" y="24" width="4" height="4" rx="0.5" />
    <rect x="14" y="26" width="4" height="2" rx="0.5" />
  </g>
</svg>
`)}`;
