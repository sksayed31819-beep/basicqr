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
      {/* Official Basic QR logo mark (rounded dark tile, readable in light and dark themes) */}
      <img
        src="/logo-mark.png"
        width={size}
        height={size}
        alt="Basic QR logo"
        decoding="async"
        draggable={false}
        className="shrink-0 select-none rounded-[22%] shadow-sm"
        style={{ width: size, height: size }}
      />

      {showText && (
        <span className="font-heading font-black text-base tracking-tight select-none">
          <span className="text-token-primary">Basic </span>
          <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            QR
          </span>
        </span>
      )}
    </div>
  );
};
