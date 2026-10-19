/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import type {
  EditorState,
  QrDataType,
  QrPayloads,
  QrStyleConfig,
  QrLogoConfig,
  QrFrameConfig,
  ScannabilityState,
  ExportState,
} from '../types/editor.ts';
import { encodeQrPayload } from '../features/qr-content/encoders.ts';

export const DEFAULT_PAYLOADS: QrPayloads = {
  url: {
    url: 'https://basicqr.bond',
  },
  text: {
    text: 'Scan with any smartphone camera!',
  },
  wifi: {
    ssid: 'Guest_WiFi_5G',
    password: 'superSecretPassword123!',
    encryption: 'WPA',
    hidden: false,
  },
  vcard: {
    firstName: 'Alex',
    lastName: 'Morgan',
    organization: 'Studio Creative Lab',
    title: 'Design Director',
    phoneMobile: '+1 (555) 234-5678',
    phoneWork: '+1 (555) 987-6543',
    email: 'alex.morgan@example.com',
    url: 'https://example.com/alex',
    address: {
      street: '123 Market Street, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA',
    },
    note: 'Met at Design Summit 2026',
  },
  email: {
    to: 'hello@basicqr.bond',
    subject: 'Inquiry from QR Code',
    body: 'Hi there, I scanned your QR code and wanted to connect!',
  },
  phone: {
    protocol: 'whatsapp',
    countryCode: '+1',
    phoneNumber: '5552345678',
    whatsappMessage: 'Hi! I found you through your Basic QR code.',
  },
};

export const DEFAULT_STYLE: QrStyleConfig = {
  dotType: 'rounded',
  dotColor: '#0B0D12',
  dotGradient: {
    enabled: false,
    type: 'linear',
    color1: '#8B5CF6',
    color2: '#3B82F6',
    rotation: 135,
  },
  cornerSquareType: 'extra-rounded',
  cornerSquareColor: '#0B0D12',
  cornerDotType: 'dot',
  cornerDotColor: '#0B0D12',
  backgroundColor: '#FFFFFF',
  backgroundTransparent: false,
  margin: 16,
};

export const DEFAULT_LOGO: QrLogoConfig = {
  enabled: false,
  src: '',
  size: 0.22,
  margin: 4,
  hideBackgroundDots: true,
  shape: 'circle',
};

export const DEFAULT_FRAME: QrFrameConfig = {
  style: 'bottom-banner',
  text: 'SCAN ME',
  font: 'Space Grotesk',
  color: '#0B0D12',
  textColor: '#FFFFFF',
};

export const DEFAULT_SCANNABILITY: ScannabilityState = {
  passed: true,
  contrastRatio: 18.2,
  contrastRating: 'Good',
  decodedPayload: 'https://basicqr.bond',
  payloadMatch: true,
  errorCorrection: 'Q',
  lastCheckedAt: Date.now(),
  isChecking: false,
  invertedWarning: false,
  issues: [],
};

export const DEFAULT_EXPORT: ExportState = {
  format: 'png',
  resolution: '4K',
  pdfLayout: 'single',
  isExporting: false,
  filename: 'basic-qr-code',
};

const DESIGN_STORAGE_KEY = 'basicqr_design_v1';

function loadSavedDesign(): Record<string, any> {
  try {
    const raw = localStorage.getItem(DESIGN_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

const savedDesign = loadSavedDesign();

export const useEditorStore = create<EditorState>((set, get) => ({
  docTitle: savedDesign.docTitle ?? 'Untitled QR Code',
  setDocTitle: (docTitle: string) => set({ docTitle }),

  dataType: savedDesign.dataType ?? 'url',
  payloads: savedDesign.payloads ? { ...DEFAULT_PAYLOADS, ...savedDesign.payloads } : DEFAULT_PAYLOADS,
  style: { ...DEFAULT_STYLE, ...savedDesign.style },
  logo: { ...DEFAULT_LOGO, ...savedDesign.logo },
  frame: { ...DEFAULT_FRAME, ...savedDesign.frame },
  scannability: DEFAULT_SCANNABILITY,
  exportConfig: { ...DEFAULT_EXPORT, ...savedDesign.exportConfig, isExporting: false },

  activeTemplateId: null,

  applyTemplate: (template, preserveContent = true) =>
    set((state) => {
      const isLogoActive = Boolean(template.logo?.enabled && template.logo?.src);
      const nextErrorCorrection = isLogoActive
        ? 'H'
        : state.scannability.errorCorrection;

      const nextPayloads = preserveContent
        ? state.payloads
        : {
            ...state.payloads,
            ...(template.samplePayload || {}),
          };

      const nextDataType = preserveContent ? state.dataType : template.defaultDataType;

      return {
        activeTemplateId: template.id,
        dataType: nextDataType,
        payloads: nextPayloads,
        style: { ...template.style },
        frame: { ...template.frame },
        logo: template.logo
          ? { ...template.logo }
          : { ...state.logo, enabled: false },
        scannability: {
          ...state.scannability,
          errorCorrection: nextErrorCorrection,
        },
      };
    }),

  setDataType: (dataType: QrDataType) => set({ dataType }),

  updateUrlPayload: (patch) =>
    set((state) => ({
      payloads: {
        ...state.payloads,
        url: { ...state.payloads.url, ...patch },
      },
    })),

  updateTextPayload: (patch) =>
    set((state) => ({
      payloads: {
        ...state.payloads,
        text: { ...state.payloads.text, ...patch },
      },
    })),

  updateWifiPayload: (patch) =>
    set((state) => ({
      payloads: {
        ...state.payloads,
        wifi: { ...state.payloads.wifi, ...patch },
      },
    })),

  updateVCardPayload: (patch) =>
    set((state) => ({
      payloads: {
        ...state.payloads,
        vcard: { ...state.payloads.vcard, ...patch },
      },
    })),

  updateVCardAddress: (patch) =>
    set((state) => ({
      payloads: {
        ...state.payloads,
        vcard: {
          ...state.payloads.vcard,
          address: {
            ...state.payloads.vcard.address,
            ...patch,
          },
        },
      },
    })),

  updateEmailPayload: (patch) =>
    set((state) => ({
      payloads: {
        ...state.payloads,
        email: { ...state.payloads.email, ...patch },
      },
    })),

  updatePhonePayload: (patch) =>
    set((state) => ({
      payloads: {
        ...state.payloads,
        phone: { ...state.payloads.phone, ...patch },
      },
    })),

  setStyle: (patch) =>
    set((state) => ({
      style: { ...state.style, ...patch },
    })),

  setLogo: (patch) =>
    set((state) => ({
      logo: { ...state.logo, ...patch },
    })),

  setFrame: (patch) =>
    set((state) => ({
      frame: { ...state.frame, ...patch },
    })),

  setScannability: (patch) =>
    set((state) => ({
      scannability: { ...state.scannability, ...patch },
    })),

  applySafeContrastFallback: () =>
    set((state) => ({
      style: {
        ...state.style,
        dotColor: '#0B0D12',
        dotGradient: {
          ...state.style.dotGradient,
          enabled: false,
        },
        cornerSquareColor: '#0B0D12',
        cornerDotColor: '#0B0D12',
        backgroundColor: '#FFFFFF',
        backgroundTransparent: false,
        margin: Math.max(16, state.style.margin),
      },
      logo: {
        ...state.logo,
        size: Math.min(state.logo.size || 0.2, 0.2),
      },
    })),

  setExportConfig: (patch) =>
    set((state) => ({
      exportConfig: { ...state.exportConfig, ...patch },
    })),

  resetToDefaults: () =>
    set({
      docTitle: 'Untitled QR Code',
      dataType: 'url',
      payloads: DEFAULT_PAYLOADS,
      style: DEFAULT_STYLE,
      logo: DEFAULT_LOGO,
      frame: DEFAULT_FRAME,
      scannability: DEFAULT_SCANNABILITY,
      exportConfig: DEFAULT_EXPORT,
    }),

  getEncodedContent: () => {
    const { dataType, payloads } = get();
    return encodeQrPayload(dataType, payloads);
  },
}));

// Autosave the design (debounced) so a refresh never loses the user's work.
let saveTimer: ReturnType<typeof setTimeout> | null = null;
useEditorStore.subscribe((state) => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(
        DESIGN_STORAGE_KEY,
        JSON.stringify({
          docTitle: state.docTitle,
          dataType: state.dataType,
          payloads: state.payloads,
          style: state.style,
          logo: state.logo,
          frame: state.frame,
          exportConfig: state.exportConfig,
        })
      );
    } catch {
      // storage full or unavailable: skip silently
    }
  }, 400);
});
