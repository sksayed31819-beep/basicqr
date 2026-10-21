/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useUiStore } from './stores/ui-store.ts';
import { TopToolbar } from './components/layout/TopToolbar.tsx';
import { StudioShell } from './components/layout/StudioShell.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';

import { GlobalGuidesModalOrView } from './components/seo/GlobalGuidesModalOrView.tsx';
import { LegalComplianceModal } from './components/seo/LegalComplianceModal.tsx';

export default function App() {
  const {
    theme,
    isGuidesModalOpen,
    setIsGuidesModalOpen,
    isLegalModalOpen,
    setIsLegalModalOpen,
  } = useUiStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-dvh w-full flex flex-col studio-app">
      {/* The studio fills the first screen; the landing sections follow below it */}
      <div id="studio" className="h-dvh min-h-[560px] w-full flex flex-col overflow-hidden">
        <TopToolbar />
        <StudioShell />
      </div>

      <LandingPage />

      {/* Global SEO Content Hub & Guides Modal */}
      <GlobalGuidesModalOrView
        isOpen={isGuidesModalOpen}
        onClose={() => setIsGuidesModalOpen(false)}
      />

      {/* Legal & Privacy Compliance Modal */}
      <LegalComplianceModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />
    </div>
  );
}
