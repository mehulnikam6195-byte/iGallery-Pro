/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PhotoEdits {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  brilliance: number;
  highlights: number;
  shadows: number;
  vibrance: number;
  warmth: number;
  tint: number;
  sepia: number;
  invert: number;
  filter: string;
  rotate: number;
  aspectRatio: string;
}

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  date: string;
  location: string;
  isFavorite: boolean;
  width: number;
  height: number;
  category: string;
  type: 'image' | 'video';
  duration?: string;
  videoUrl?: string;
  isSelfie?: boolean;
  isPortrait?: boolean;
  isLivePhoto?: boolean;
  isTimelapse?: boolean;
  edits?: PhotoEdits;
}

export type Photo = MediaItem; // Keep alias for backward compatibility during transition

export type ViewType = 'Library' | 'ForYou' | 'Albums' | 'Search';
export type TimeScale = 'Years' | 'Months' | 'Days' | 'All';
export type ThemeType = 'Light' | 'Dark' | 'System';

export interface Album {
  id: string;
  title: string;
  count: number;
  coverUrl: string;
  type: 'system' | 'custom' | 'utility';
}
