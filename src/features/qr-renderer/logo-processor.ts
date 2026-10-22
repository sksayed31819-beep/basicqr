/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Clean, universal copyright-safe SVG icon presets encoded as clean Data URLs.
 * All icons are optimized with high-contrast glyphs suitable for QR center placement.
 */
export interface LogoPreset {
  id: string;
  name: string;
  category: string;
  dataUrl: string;
}

export const GLOBAL_LOGO_PRESETS: LogoPreset[] = [
  {
    id: 'basic-qr-orbit',
    name: 'Basic QR Orbit',
    category: 'Brand',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
          <defs>
            <linearGradient id="bqbgrad" x1="18" y1="16" x2="96" y2="92" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#00F2FE" />
              <stop offset="30%" stop-color="#0099FF" />
              <stop offset="65%" stop-color="#2563EB" />
              <stop offset="100%" stop-color="#9333EA" />
            </linearGradient>
            <linearGradient id="bqtgrad" x1="32" y1="16" x2="75" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#38BDF8" />
              <stop offset="45%" stop-color="#0284C7" />
              <stop offset="100%" stop-color="#1E40AF" />
            </linearGradient>
            <linearGradient id="bqsgrad" x1="10" y1="65" x2="110" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#00F2FE" />
              <stop offset="50%" stop-color="#38BDF8" />
              <stop offset="100%" stop-color="#A855F7" />
            </linearGradient>
          </defs>
          <rect width="120" height="120" rx="24" fill="#0B0D12" stroke="#2A3140" stroke-width="2"/>
          <path d="M 68 36 C 85 36, 106 42, 106 49 C 106 55, 94 60, 80 64" stroke="url(#bqsgrad)" stroke-width="6" stroke-linecap="round" opacity="0.85" />
          <path d="M 32 18 L 46 30 L 46 88 L 32 88 Z" fill="url(#bqbgrad)" />
          <path d="M 32 18 L 72 18 C 84 18, 92 25, 88 38 C 84 48, 72 52, 60 52 L 46 52 L 46 30 Z" fill="url(#bqtgrad)" />
          <path d="M 46 48 L 62 48 C 76 48, 94 54, 94 68 C 94 82, 78 88, 62 88 L 32 88 L 46 76 L 62 76 C 70 76, 78 72, 78 66 C 78 60, 70 56, 60 56 L 46 56 Z" fill="url(#bqbgrad)" />
          <path d="M 12 62 C 12 76, 36 82, 64 74 C 84 68, 98 56, 98 48 C 98 44, 92 42, 84 42 C 74 42, 54 48, 38 56 C 24 63, 12 62, 12 62 Z" fill="url(#bqsgrad)" />
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
      `),
  },
  {
    id: 'globe',
    name: 'Website / Link',
    category: 'General',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="48" fill="#8B5CF6"/>
          <circle cx="50" cy="50" r="34" fill="none" stroke="#FFFFFF" stroke-width="4.5"/>
          <ellipse cx="50" cy="50" rx="16" ry="34" fill="none" stroke="#FFFFFF" stroke-width="4.5"/>
          <line x1="16" y1="50" x2="84" y2="50" stroke="#FFFFFF" stroke-width="4.5"/>
        </svg>
      `),
  },
  {
    id: 'wifi',
    name: 'Wi-Fi Network',
    category: 'Connectivity',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="48" fill="#3B82F6"/>
          <path d="M22 34 A42 42 0 0 1 78 34" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
          <path d="M32 47 A28 28 0 0 1 68 47" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
          <path d="M42 60 A14 14 0 0 1 58 60" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
          <circle cx="50" cy="74" r="5" fill="#FFFFFF"/>
        </svg>
      `),
  },
  {
    id: 'vcard',
    name: 'Contact Card',
    category: 'People',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="48" fill="#10B981"/>
          <circle cx="50" cy="40" r="16" fill="#FFFFFF"/>
          <path d="M26 78 C26 62 36 58 50 58 C64 58 74 62 74 78 Z" fill="#FFFFFF"/>
        </svg>
      `),
  },
  {
    id: 'restaurant',
    name: 'Dine / Menu',
    category: 'Food',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="48" fill="#F59E0B"/>
          <!-- Fork -->
          <path d="M37 26 V42 C37 46 41 49 41 54 V76 H37 V54 C33 50 31 46 31 42 V26 H33 V38 H35 V26 H37 Z" fill="#FFFFFF"/>
          <!-- Knife -->
          <path d="M63 26 C57 32 57 44 57 52 V76 H63 V26 Z" fill="#FFFFFF"/>
        </svg>
      `),
  },
  {
    id: 'email',
    name: 'Email / Mail',
    category: 'Message',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="48" fill="#EC4899"/>
          <rect x="22" y="32" width="56" height="38" rx="6" fill="none" stroke="#FFFFFF" stroke-width="5"/>
          <path d="M24 35 L50 54 L76 35" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `),
  },
  {
    id: 'whatsapp',
    name: 'Chat / Support',
    category: 'Communication',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="48" fill="#059669"/>
          <path d="M28 72 L32 58 A26 26 0 1 1 50 76 C44 76 38 74 34 72 Z" fill="#FFFFFF"/>
          <path d="M42 43 C41 42 39 42 38 44 C37 45 36 48 37 51 C39 55 43 61 49 64 C53 66 56 65 57 63 C58 62 59 60 58 59 C57 58 54 57 53 56 C52 56 51 56 50 57 C49 58 48 58 47 57 C45 56 43 54 41 51 C40 50 41 49 42 48 C43 47 43 46 43 45 C43 44 42 43 42 43 Z" fill="#059669"/>
        </svg>
      `),
  },
  {
    id: 'star',
    name: 'Star / Review',
    category: 'Rating',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="48" fill="#FBBF24"/>
          <polygon points="50,20 59,38 79,41 64,56 68,76 50,66 32,76 36,56 21,41 41,38" fill="#FFFFFF"/>
        </svg>
      `),
  },
  {
    id: 'pin',
    name: 'Location Pin',
    category: 'Maps',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="48" fill="#EF4444"/>
          <path d="M50 24 C38 24 30 32 30 44 C30 58 50 78 50 78 C50 78 70 58 70 44 C70 32 62 24 50 24 Z" fill="#FFFFFF"/>
          <circle cx="50" cy="42" r="7" fill="#EF4444"/>
        </svg>
      `),
  },
];

/**
 * Pre-processes an image into an offscreen canvas with anti-aliased shape masking:
 * - 'circle': Smooth circle clip with background padding
 * - 'rounded': Squircle / rounded rectangle with background padding
 * - 'square': Crisp square with background padding
 */
export function processLogoImage(
  src: string,
  shape: 'circle' | 'rounded' | 'square' = 'circle',
  bgColor = '#FFFFFF'
): Promise<string> {
  return new Promise((resolve) => {
    if (!src || !src.trim()) {
      resolve('');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 1024; // high-res so logos stay sharp in 4K exports
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(src);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw background shape
      ctx.fillStyle = bgColor;
      const cornerRadius = size * 0.22;

      ctx.beginPath();
      if (shape === 'circle') {
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      } else if (shape === 'rounded') {
        ctx.roundRect(4, 4, size - 8, size - 8, cornerRadius);
      } else {
        ctx.rect(4, 4, size - 8, size - 8);
      }
      ctx.closePath();
      ctx.fill();

      // Clip path for image inside
      ctx.save();
      ctx.beginPath();
      if (shape === 'circle') {
        ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
      } else if (shape === 'rounded') {
        ctx.roundRect(8, 8, size - 16, size - 16, cornerRadius - 4);
      } else {
        ctx.rect(8, 8, size - 16, size - 16);
      }
      ctx.closePath();
      ctx.clip();

      // Maintain aspect ratio while fitting into canvas with comfortable padding
      const padding = size * 0.08;
      const drawWidth = size - padding * 2;
      const drawHeight = size - padding * 2;

      const imgAspect = img.width / img.height;
      let finalW = drawWidth;
      let finalH = drawHeight;
      let offX = padding;
      let offY = padding;

      if (imgAspect > 1) {
        finalH = drawWidth / imgAspect;
        offY = (size - finalH) / 2;
      } else {
        finalW = drawHeight * imgAspect;
        offX = (size - finalW) / 2;
      }

      ctx.drawImage(img, offX, offY, finalW, finalH);
      ctx.restore();

      try {
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Canvas export failed, falling back to raw src:', err);
        resolve(src);
      }
    };

    img.onerror = () => {
      resolve(src);
    };

    img.src = src;
  });
}
