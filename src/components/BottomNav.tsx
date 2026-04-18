/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Image, Heart, Grid, Search, SquareStack } from 'lucide-react';
import { ViewType } from '../types';

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const tabs = [
    { id: 'Library' as ViewType, label: 'Library', icon: Grid },
    { id: 'ForYou' as ViewType, label: 'For You', icon: Heart },
    { id: 'Albums' as ViewType, label: 'Albums', icon: SquareStack },
    { id: 'Search' as ViewType, label: 'Search', icon: Search },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 ios-glass h-[83px] border-t border-ios-separator safe-bottom z-50">
      <div className="flex justify-around items-center h-[50px] mt-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
                isActive ? 'text-ios-blue' : 'text-ios-secondary-label'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
