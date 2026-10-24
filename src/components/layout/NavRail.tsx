/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FileCode2,
  Palette,
  Shapes,
  Image,
  SquareCode,
  LayoutTemplate,
} from 'lucide-react';
import { useUiStore } from '../../stores/ui-store.ts';
import type { StudioRailTab } from '../../types/editor.ts';

interface RailItem {
  id: StudioRailTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  phase?: number;
}

const RAIL_ITEMS: RailItem[] = [
  { id: 'content', label: 'Content', icon: FileCode2 },
  { id: 'style', label: 'Style', icon: Palette },
  { id: 'shapes', label: 'Shapes', icon: Shapes },
  { id: 'logo', label: 'Logo', icon: Image },
  { id: 'frame', label: 'Frame', icon: SquareCode },
  { id: 'templates', label: 'Presets', icon: LayoutTemplate },
];

export const NavRail: React.FC = () => {
  const { activeRailTab, setActiveRailTab } = useUiStore();

  return (
    <aside
      aria-label="Studio Sections"
      className="studio-card w-[84px] lg:border lg:rounded-3xl studio-border studio-panel flex flex-col items-center py-4 gap-2 shrink-0 select-none z-20"
    >
      {RAIL_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeRailTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveRailTab(item.id)}
            title={item.label}
            className={`w-[68px] h-[64px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
              isActive
                ? 'studio-accent text-white font-bold shadow-lg'
                : 'text-token-tertiary hover:text-token-primary hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[11px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};
