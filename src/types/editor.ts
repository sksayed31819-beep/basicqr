/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QrDataType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'phone';

// -------------------------------------------------------------
// 1. DATA TYPE PAYLOAD INTERFACES
// -------------------------------------------------------------

export interface UrlData {
  url: string;
}

export interface TextData {
  text: string;
}

export type WifiEncryption = 'WPA' | 'WEP' | 'nopass' | 'WPA2' | 'WPA3';

export interface WifiData {
  ssid: string;
  password?: string;
  encryption: WifiEncryption;
  hidden?: boolean;
}

export interface VCardAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface VCardData {
  firstName: string;
  lastName?: string;
  organization?: string;
  title?: string;
  phoneMobile?: string;
  phoneWork?: string;
  email?: string;
  url?: string;
  address?: VCardAddress;
  note?: string;
}

export interface EmailData {
  to: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

export type PhoneProtocol = 'tel' | 'whatsapp';

export interface PhoneData {
  protocol: PhoneProtocol;
  countryCode: string;
  phoneNumber: string;
  whatsappMessage?: string;
}

export interface QrPayloads {
  url: UrlData;
  text: TextData;
  wifi: WifiData;
  vcard: VCardData;
  email: EmailData;
  phone: PhoneData;
}

// -------------------------------------------------------------
// 2. STYLING, SHAPES & CORNER TYPES (FOR QR-CODE-STYLING)
// -------------------------------------------------------------

export type DotType = 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded';
export type CornerSquareType = 'square' | 'dot' | 'extra-rounded' | 'outpoint';
export type CornerDotType = 'square' | 'dot';

export type GradientType = 'linear' | 'radial';

export interface GradientConfig {
  enabled: boolean;
  type: GradientType;
  color1: string;
  color2: string;
  rotation: number; // degrees 0-360
}

export interface QrStyleConfig {
  dotType: DotType;
  dotColor: string;
  dotGradient: GradientConfig;

  cornerSquareType: CornerSquareType;
  cornerSquareColor: string;

  cornerDotType: CornerDotType;
  cornerDotColor: string;

  backgroundColor: string;
  backgroundTransparent: boolean;

  margin: number;
}

// -------------------------------------------------------------
// 3. LOGO & EMBEDDED ASSETS
// -------------------------------------------------------------

export interface QrLogoConfig {
  enabled: boolean;
  src: string;
  rawSrc?: string; // original uploaded image, kept so shape changes re-crop from the source
  size: number; // 0.1 to 0.4 relative to QR code
  margin: number;
  hideBackgroundDots: boolean;
  shape: 'circle' | 'square' | 'rounded';
}

// -------------------------------------------------------------
// 4. FRAMES & LABELS
// -------------------------------------------------------------

export type FrameStyle = 'none' | 'bottom-banner' | 'top-banner' | 'polaroid' | 'badge' | 'balloon' | 'ticket' | 'neon';

export interface QrFrameConfig {
  style: FrameStyle;
  text: string;
  font: string;
  color: string;
  textColor: string;
  icon?: string;
}

// -------------------------------------------------------------
// 5. SCANNABILITY & VALIDATION STATE
// -------------------------------------------------------------

export type ContrastRating = 'Good' | 'Warning' | 'Poor';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface ScannabilityState {
  passed: boolean;
  contrastRatio: number;
  contrastRating: ContrastRating;
  decodedPayload: string | null;
  errorCorrection: ErrorCorrectionLevel;
  lastCheckedAt: number | null;
  isChecking: boolean;
  invertedWarning: boolean;
  payloadMatch: boolean;
  issues: string[];
}

// -------------------------------------------------------------
// 6. EXPORT PASS STATE
// -------------------------------------------------------------

export type ExportFormat = 'png' | 'svg' | 'pdf' | 'jpeg';
export type ExportResolution = '512p' | '1080p' | '2K' | '4K' | 'vector';
export type PdfLayout = 'single' | 'sheet';

export interface ExportState {
  format: ExportFormat;
  resolution: ExportResolution;
  pdfLayout: PdfLayout;
  isExporting: boolean;
  filename: string;
}

// -------------------------------------------------------------
// 7. STUDIO NAVIGATION & UI TYPES
// -------------------------------------------------------------

export type StudioRailTab = 'content' | 'style' | 'shapes' | 'logo' | 'frame' | 'templates';
export type StudioMobileTab = 'content' | 'style' | 'shapes' | 'logo' | 'frame' | 'templates';
export type ThemeMode = 'dark' | 'light';

export interface EditorState {
  // Document meta
  docTitle: string;
  setDocTitle: (title: string) => void;

  // Active payload selection
  dataType: QrDataType;
  payloads: QrPayloads;

  // Visual options
  style: QrStyleConfig;
  logo: QrLogoConfig;
  frame: QrFrameConfig;

  // Scannability & Export
  scannability: ScannabilityState;
  exportConfig: ExportState;

  // Active template
  activeTemplateId: string | null;
  applyTemplate: (template: any, preserveContent?: boolean) => void;

  // Actions
  setDataType: (type: QrDataType) => void;
  updateUrlPayload: (patch: Partial<UrlData>) => void;
  updateTextPayload: (patch: Partial<TextData>) => void;
  updateWifiPayload: (patch: Partial<WifiData>) => void;
  updateVCardPayload: (patch: Partial<VCardData>) => void;
  updateVCardAddress: (patch: Partial<VCardAddress>) => void;
  updateEmailPayload: (patch: Partial<EmailData>) => void;
  updatePhonePayload: (patch: Partial<PhoneData>) => void;

  setStyle: (patch: Partial<QrStyleConfig>) => void;
  setLogo: (patch: Partial<QrLogoConfig>) => void;
  setFrame: (patch: Partial<QrFrameConfig>) => void;
  setScannability: (patch: Partial<ScannabilityState>) => void;
  applySafeContrastFallback: () => void;
  setExportConfig: (patch: Partial<ExportState>) => void;

  resetToDefaults: () => void;
  getEncodedContent: () => string;
}

export type GuideTab = 'all' | 'scannability' | 'formats' | 'wifi-print' | 'faq';
export type LegalTab = 'privacy' | 'terms' | 'about' | 'ads';

export interface UiState {
  activeRailTab: StudioRailTab;
  activeMobileTab: StudioMobileTab;
  theme: ThemeMode;
  isExportModalOpen: boolean;
  showRawPayload: boolean;
  isGuidesModalOpen: boolean;
  isLegalModalOpen: boolean;
  activeGuideTab: GuideTab;
  activeLegalTab: LegalTab;

  setActiveRailTab: (tab: StudioRailTab) => void;
  setActiveMobileTab: (tab: StudioMobileTab) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setIsExportModalOpen: (open: boolean) => void;
  setShowRawPayload: (show: boolean) => void;
  setIsGuidesModalOpen: (open: boolean) => void;
  setIsLegalModalOpen: (open: boolean) => void;
  setActiveGuideTab: (tab: GuideTab) => void;
  setActiveLegalTab: (tab: LegalTab) => void;
}
