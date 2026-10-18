/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import type { UiState, StudioRailTab, StudioMobileTab, ThemeMode } from '../types/editor.ts';

export const useUiStore = create<UiState>((set) => ({
  activeRailTab: 'content',
  activeMobileTab: 'content',
  theme: 'dark',
  isExportModalOpen: false,
  showRawPayload: false,
  isGuidesModalOpen: false,
  isLegalModalOpen: false,
  activeGuideTab: 'all',
  activeLegalTab: 'privacy',

  setActiveRailTab: (activeRailTab: StudioRailTab) => set({ activeRailTab }),
  setActiveMobileTab: (activeMobileTab: StudioMobileTab) => set({ activeMobileTab }),
  setTheme: (theme: ThemeMode) => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('basicqr_theme', theme);
    } catch {
      // ignore
    }
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      try {
        localStorage.setItem('basicqr_theme', nextTheme);
      } catch {
        // ignore
      }
      return { theme: nextTheme };
    });
  },
  setIsExportModalOpen: (isExportModalOpen: boolean) => set({ isExportModalOpen }),
  setShowRawPayload: (showRawPayload: boolean) => set({ showRawPayload }),
  setIsGuidesModalOpen: (isGuidesModalOpen: boolean) => set({ isGuidesModalOpen }),
  setIsLegalModalOpen: (isLegalModalOpen: boolean) => set({ isLegalModalOpen }),
  setActiveGuideTab: (activeGuideTab) => set({ activeGuideTab }),
  setActiveLegalTab: (activeLegalTab) => set({ activeLegalTab }),
}));
