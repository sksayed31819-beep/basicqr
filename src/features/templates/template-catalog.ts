/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  QrStyleConfig,
  QrLogoConfig,
  QrFrameConfig,
  QrDataType,
  QrPayloads,
} from '../../types/editor.ts';
import { GLOBAL_LOGO_PRESETS } from '../qr-renderer/logo-processor.ts';

export type TemplateCategory =
  | 'Hospitality'
  | 'Business'
  | 'Creator'
  | 'Packaging'
  | 'Events'
  | 'Marketing'
  | 'Tech';

export interface QrTemplatePreset {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  tags: string[];

  // Suggested default data type & sample payload
  defaultDataType: QrDataType;
  samplePayload?: Partial<QrPayloads>;

  // Design configs
  style: QrStyleConfig;
  frame: QrFrameConfig;
  logo?: QrLogoConfig;
}

const getLogoUrl = (id: string): string => {
  return GLOBAL_LOGO_PRESETS.find((p) => p.id === id)?.dataUrl || '';
};

export const GLOBAL_TEMPLATES: QrTemplatePreset[] = [
  // 01. Guest Wi-Fi: Minimal
  {
    id: 'guest-wifi-minimal',
    name: 'Guest Wi-Fi: Minimal',
    category: 'Hospitality',
    description: 'Clean sage aesthetic for boutique hotels, lounges, and cozy cafes.',
    tags: ['wifi', 'minimal', 'hospitality', 'cafe'],
    defaultDataType: 'wifi',
    style: {
      dotType: 'rounded',
      dotColor: '#202820',
      dotGradient: { enabled: false, type: 'linear', color1: '#202820', color2: '#202820', rotation: 0 },
      cornerSquareType: 'extra-rounded',
      cornerSquareColor: '#202820',
      cornerDotType: 'dot',
      cornerDotColor: '#202820',
      backgroundColor: '#F8F6F0',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'bottom-banner',
      text: 'CONNECT TO WI-FI',
      font: 'Space Grotesk',
      color: '#78917C',
      textColor: '#FFFFFF',
    },
    logo: {
      enabled: true,
      src: getLogoUrl('wifi'),
      size: 0.22,
      margin: 4,
      hideBackgroundDots: true,
      shape: 'circle',
    },
  },

  // 02. Restaurant Menu: Dark Luxury
  {
    id: 'restaurant-dark-luxury',
    name: 'Restaurant Menu: Dark Luxury',
    category: 'Hospitality',
    description: 'Deep onyx and dark gold accents tailored for upscale dining and wine bars.',
    tags: ['restaurant', 'luxury', 'menu', 'gold'],
    defaultDataType: 'url',
    style: {
      dotType: 'classy',
      dotColor: '#111111',
      dotGradient: { enabled: false, type: 'linear', color1: '#111111', color2: '#111111', rotation: 0 },
      cornerSquareType: 'square',
      cornerSquareColor: '#D6B36A',
      cornerDotType: 'square',
      cornerDotColor: '#111111',
      backgroundColor: '#F7F0E2',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'polaroid',
      text: 'VIEW MENU',
      font: 'Space Grotesk',
      color: '#1C1917',
      textColor: '#D6B36A',
    },
    logo: {
      enabled: true,
      src: getLogoUrl('restaurant'),
      size: 0.2,
      margin: 4,
      hideBackgroundDots: true,
      shape: 'circle',
    },
  },

  // 03. Bistro & Bar: Warm Editorial
  {
    id: 'bistro-warm-editorial',
    name: 'Bistro & Bar: Warm Editorial',
    category: 'Hospitality',
    description: 'Warm terracotta tones on soft cream for modern bakeries, bistros, and patios.',
    tags: ['food', 'bistro', 'warm', 'editorial'],
    defaultDataType: 'url',
    style: {
      dotType: 'rounded',
      dotColor: '#8D3C27',
      dotGradient: { enabled: false, type: 'linear', color1: '#8D3C27', color2: '#8D3C27', rotation: 0 },
      cornerSquareType: 'extra-rounded',
      cornerSquareColor: '#8D3C27',
      cornerDotType: 'dot',
      cornerDotColor: '#D97745',
      backgroundColor: '#FFF3E5',
      backgroundTransparent: false,
      margin: 14,
    },
    frame: {
      style: 'bottom-banner',
      text: 'SCAN FOR MENU',
      font: 'Outfit',
      color: '#D97745',
      textColor: '#FFFFFF',
    },
  },

  // 04. Executive vCard
  {
    id: 'executive-vcard',
    name: 'Executive vCard',
    category: 'Business',
    description: 'Sleek executive gradient on crisp white surface for executive networking cards.',
    tags: ['vcard', 'business', 'executive', 'contact'],
    defaultDataType: 'vcard',
    style: {
      dotType: 'square',
      dotColor: '#0F172A',
      dotGradient: {
        enabled: true,
        type: 'linear',
        color1: '#0F172A',
        color2: '#334155',
        rotation: 135,
      },
      cornerSquareType: 'square',
      cornerSquareColor: '#0F172A',
      cornerDotType: 'square',
      cornerDotColor: '#0F172A',
      backgroundColor: '#FFFFFF',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'bottom-banner',
      text: 'SAVE CONTACT',
      font: 'Inter',
      color: '#0F172A',
      textColor: '#FFFFFF',
    },
    logo: {
      enabled: true,
      src: getLogoUrl('vcard'),
      size: 0.22,
      margin: 4,
      hideBackgroundDots: true,
      shape: 'circle',
    },
  },

  // 05. Creator Hub: Neon Cyberpunk
  {
    id: 'creator-neon-cyberpunk',
    name: 'Creator Hub: Neon Cyberpunk',
    category: 'Creator',
    description: 'Vibrant neon purple-to-pink gradient with deep space border framing.',
    tags: ['creator', 'neon', 'cyberpunk', 'links'],
    defaultDataType: 'url',
    style: {
      dotType: 'extra-rounded',
      dotColor: '#7C3AED',
      dotGradient: {
        enabled: true,
        type: 'linear',
        color1: '#7C3AED',
        color2: '#EC4899',
        rotation: 135,
      },
      cornerSquareType: 'extra-rounded',
      cornerSquareColor: '#7C3AED',
      cornerDotType: 'dot',
      cornerDotColor: '#EC4899',
      backgroundColor: '#FFFFFF',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'neon',
      text: 'FIND ME ONLINE',
      font: 'Space Grotesk',
      color: '#8B5CF6',
      textColor: '#FDF4FF',
    },
    logo: {
      enabled: true,
      src: getLogoUrl('globe'),
      size: 0.22,
      margin: 4,
      hideBackgroundDots: true,
      shape: 'circle',
    },
  },

  // 06. Creator Hub: Pastel Dream
  {
    id: 'creator-pastel-dream',
    name: 'Creator Hub: Pastel Dream',
    category: 'Creator',
    description: 'Soft lavender dots on pale strawberry cream with playful balloon callout.',
    tags: ['creator', 'pastel', 'aesthetic', 'soft'],
    defaultDataType: 'url',
    style: {
      dotType: 'dots',
      dotColor: '#6D5BD0',
      dotGradient: { enabled: false, type: 'linear', color1: '#6D5BD0', color2: '#6D5BD0', rotation: 0 },
      cornerSquareType: 'dot',
      cornerSquareColor: '#6D5BD0',
      cornerDotType: 'dot',
      cornerDotColor: '#6D5BD0',
      backgroundColor: '#FFF7FB',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'balloon',
      text: 'EXPLORE MY LINKS',
      font: 'Outfit',
      color: '#6D5BD0',
      textColor: '#FFFFFF',
    },
  },

  // 07. Creator Hub: Glassmorphism
  {
    id: 'creator-glassmorphism',
    name: 'Creator Hub: Glassmorphism',
    category: 'Creator',
    description: 'Clean slate dots on icy blue with modern floating pill badge.',
    tags: ['creator', 'glass', 'modern', 'badge'],
    defaultDataType: 'url',
    style: {
      dotType: 'rounded',
      dotColor: '#1E293B',
      dotGradient: { enabled: false, type: 'linear', color1: '#1E293B', color2: '#1E293B', rotation: 0 },
      cornerSquareType: 'extra-rounded',
      cornerSquareColor: '#4F46E5',
      cornerDotType: 'dot',
      cornerDotColor: '#1E293B',
      backgroundColor: '#F8FAFC',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'badge',
      text: 'SCAN TO CONNECT',
      font: 'Inter',
      color: '#4F46E5',
      textColor: '#FFFFFF',
    },
  },

  // 08. Product Packaging: Kraft
  {
    id: 'product-packaging-kraft',
    name: 'Product Packaging: Kraft',
    category: 'Packaging',
    description: 'Espresso brown modules on warm kraft paper tone for artisanal goods.',
    tags: ['packaging', 'kraft', 'organic', 'retail'],
    defaultDataType: 'url',
    style: {
      dotType: 'square',
      dotColor: '#34291F',
      dotGradient: { enabled: false, type: 'linear', color1: '#34291F', color2: '#34291F', rotation: 0 },
      cornerSquareType: 'square',
      cornerSquareColor: '#34291F',
      cornerDotType: 'square',
      cornerDotColor: '#B58B5A',
      backgroundColor: '#F5E9D5',
      backgroundTransparent: false,
      margin: 14,
    },
    frame: {
      style: 'bottom-banner',
      text: 'SCAN FOR MANUAL',
      font: 'Space Grotesk',
      color: '#B58B5A',
      textColor: '#FFFFFF',
    },
  },

  // 09. Product Warranty: Clean Tech
  {
    id: 'product-warranty-clean-tech',
    name: 'Product Warranty: Clean Tech',
    category: 'Packaging',
    description: 'Precision navy square modules with electric blue finder accents.',
    tags: ['warranty', 'tech', 'hardware', 'support'],
    defaultDataType: 'url',
    style: {
      dotType: 'square',
      dotColor: '#111827',
      dotGradient: { enabled: false, type: 'linear', color1: '#111827', color2: '#111827', rotation: 0 },
      cornerSquareType: 'square',
      cornerSquareColor: '#2563EB',
      cornerDotType: 'square',
      cornerDotColor: '#111827',
      backgroundColor: '#FFFFFF',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'top-banner',
      text: 'REGISTER PRODUCT',
      font: 'Inter',
      color: '#1E293B',
      textColor: '#FFFFFF',
    },
  },

  // 10. Event Ticket: Monochrome
  {
    id: 'event-ticket-monochrome',
    name: 'Event Ticket: Monochrome',
    category: 'Events',
    description: 'Pure high-contrast black on white with authentic notched event stub.',
    tags: ['ticket', 'events', 'festival', 'entry'],
    defaultDataType: 'text',
    style: {
      dotType: 'square',
      dotColor: '#18181B',
      dotGradient: { enabled: false, type: 'linear', color1: '#18181B', color2: '#18181B', rotation: 0 },
      cornerSquareType: 'square',
      cornerSquareColor: '#18181B',
      cornerDotType: 'square',
      cornerDotColor: '#18181B',
      backgroundColor: '#FFFFFF',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'ticket',
      text: 'EVENT DETAILS',
      font: 'Space Grotesk',
      color: '#18181B',
      textColor: '#FFFFFF',
    },
  },

  // 11. Conference Pass: Electric Blue
  {
    id: 'conference-pass-electric',
    name: 'Conference Pass: Electric Blue',
    category: 'Events',
    description: 'Cobalt-to-indigo gradient for summit lanyards and conference badges.',
    tags: ['conference', 'pass', 'networking', 'summit'],
    defaultDataType: 'vcard',
    style: {
      dotType: 'rounded',
      dotColor: '#2563EB',
      dotGradient: {
        enabled: true,
        type: 'linear',
        color1: '#2563EB',
        color2: '#7C3AED',
        rotation: 135,
      },
      cornerSquareType: 'extra-rounded',
      cornerSquareColor: '#2563EB',
      cornerDotType: 'dot',
      cornerDotColor: '#7C3AED',
      backgroundColor: '#FFFFFF',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'badge',
      text: 'CONNECT WITH ME',
      font: 'Outfit',
      color: '#2563EB',
      textColor: '#FFFFFF',
    },
  },

  // 12. Review Standee: Friendly
  {
    id: 'review-standee-friendly',
    name: 'Review Standee: Friendly',
    category: 'Marketing',
    description: 'Trustworthy forest green and star review mark for retail counter standees.',
    tags: ['review', 'google-review', 'feedback', 'retail'],
    defaultDataType: 'url',
    style: {
      dotType: 'rounded',
      dotColor: '#166534',
      dotGradient: { enabled: false, type: 'linear', color1: '#166534', color2: '#166534', rotation: 0 },
      cornerSquareType: 'extra-rounded',
      cornerSquareColor: '#166534',
      cornerDotType: 'dot',
      cornerDotColor: '#166534',
      backgroundColor: '#F8FAF7',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'bottom-banner',
      text: 'LEAVE US A REVIEW',
      font: 'Space Grotesk',
      color: '#15803D',
      textColor: '#FFFFFF',
    },
    logo: {
      enabled: true,
      src: getLogoUrl('star'),
      size: 0.22,
      margin: 4,
      hideBackgroundDots: true,
      shape: 'circle',
    },
  },

  // 13. App Download: SaaS
  {
    id: 'app-download-saas',
    name: 'App Download: SaaS',
    category: 'Marketing',
    description: 'Indigo-to-violet gradient with bold download banner for mobile apps.',
    tags: ['app', 'saas', 'download', 'mobile'],
    defaultDataType: 'url',
    style: {
      dotType: 'extra-rounded',
      dotColor: '#4F46E5',
      dotGradient: {
        enabled: true,
        type: 'linear',
        color1: '#4F46E5',
        color2: '#7C3AED',
        rotation: 135,
      },
      cornerSquareType: 'extra-rounded',
      cornerSquareColor: '#4F46E5',
      cornerDotType: 'dot',
      cornerDotColor: '#7C3AED',
      backgroundColor: '#FFFFFF',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'bottom-banner',
      text: 'GET THE APP',
      font: 'Poppins',
      color: '#312E81',
      textColor: '#FFFFFF',
    },
  },

  // 14. Portfolio: Editorial
  {
    id: 'portfolio-editorial',
    name: 'Portfolio: Editorial',
    category: 'Creator',
    description: 'Timeless warm charcoal with artistic polaroid frame for designers and photographers.',
    tags: ['portfolio', 'photographer', 'designer', 'editorial'],
    defaultDataType: 'url',
    style: {
      dotType: 'classy-rounded',
      dotColor: '#222222',
      dotGradient: { enabled: false, type: 'linear', color1: '#222222', color2: '#222222', rotation: 0 },
      cornerSquareType: 'extra-rounded',
      cornerSquareColor: '#222222',
      cornerDotType: 'dot',
      cornerDotColor: '#222222',
      backgroundColor: '#F5F0E8',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'polaroid',
      text: 'VIEW MY WORK',
      font: 'Space Grotesk',
      color: '#A65D3F',
      textColor: '#FFFFFF',
    },
  },

  // 15. Web3 / Digital Identity
  {
    id: 'web3-digital-identity',
    name: 'Web3 / Digital Identity',
    category: 'Tech',
    description: 'Deep cosmic purple gradient with glowing edge for digital identity badges.',
    tags: ['web3', 'tech', 'crypto', 'identity'],
    defaultDataType: 'url',
    style: {
      dotType: 'extra-rounded',
      dotColor: '#312E81',
      dotGradient: {
        enabled: true,
        type: 'linear',
        color1: '#312E81',
        color2: '#6D28D9',
        rotation: 135,
      },
      cornerSquareType: 'extra-rounded',
      cornerSquareColor: '#312E81',
      cornerDotType: 'dot',
      cornerDotColor: '#6D28D9',
      backgroundColor: '#FFFFFF',
      backgroundTransparent: false,
      margin: 16,
    },
    frame: {
      style: 'neon',
      text: 'DIGITAL PROFILE',
      font: 'Space Grotesk',
      color: '#6D28D9',
      textColor: '#FFFFFF',
    },
  },
];
