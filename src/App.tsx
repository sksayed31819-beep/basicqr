/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useUiStore } from './stores/ui-store.ts';
import { TopToolbar } from './components/layout/TopToolbar.tsx';
import { StudioShell } from './components/layout/StudioShell.tsx';

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
    <div className="h-dvh w-screen flex flex-col studio-app overflow-hidden">
      <TopToolbar />
      <StudioShell />

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
