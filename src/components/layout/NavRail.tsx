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
      className="w-16 border-r studio-border studio-panel flex flex-col items-center py-4 gap-1.5 shrink-0 select-none z-20"
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
            className={`w-12 h-13 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
              isActive
                ? 'bg-purple-600/15 text-purple-600 dark:text-purple-400 font-bold'
                : 'text-token-tertiary hover:text-token-primary hover:bg-[var(--surface-hover)]'
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-purple-500 rounded-r" />
            )}
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};
