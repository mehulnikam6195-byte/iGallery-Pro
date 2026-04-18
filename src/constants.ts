/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Photo, Album } from './types';

const CATEGORIES: Photo['category'][] = ['Library', 'Nature', 'Urban', 'People', 'Travel', 'Imports'];

export const MOCK_PHOTOS: Photo[] = Array.from({ length: 40 }).map((_, i) => {
  const width = 1200 + Math.floor(Math.random() * 800);
  const height = 1200 + Math.floor(Math.random() * 800);
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString();
  
  // Every 5th item is a video
  const isVideo = i % 5 === 0;
  
  return {
    id: `item-${i}`,
    url: isVideo 
      ? `https://picsum.photos/seed/${i + 100}/${width}/${height}` // Still need an image URL for thumbnail/preview
      : `https://picsum.photos/seed/${i + 100}/${width}/${height}`,
    thumbnailUrl: `https://picsum.photos/seed/${i + 100}/400/400`,
    date,
    location: ['San Francisco', 'Linares', 'Tokyo', 'London', 'Paris', 'New York'][Math.floor(Math.random() * 6)],
    isFavorite: Math.random() > 0.8,
    width,
    height,
    category,
    type: (isVideo ? 'video' : 'image') as 'video' | 'image',
    duration: isVideo ? `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : undefined,
    videoUrl: isVideo ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' : undefined,
    isSelfie: i % 7 === 1 && !isVideo,
    isPortrait: i % 8 === 2 && !isVideo,
    isLivePhoto: i % 6 === 3 && !isVideo,
    isTimelapse: i % 15 === 4 && isVideo
  };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const MOCK_ALBUMS: Album[] = [
  { id: 'recents', title: 'Recents', count: MOCK_PHOTOS.length, coverUrl: MOCK_PHOTOS[0].thumbnailUrl, type: 'system' },
  { id: 'favorites', title: 'Favorites', count: MOCK_PHOTOS.filter(p => p.isFavorite).length, coverUrl: MOCK_PHOTOS.find(p => p.isFavorite)?.thumbnailUrl || MOCK_PHOTOS[1].thumbnailUrl, type: 'system' },
  { id: 'nature', title: 'Nature', count: MOCK_PHOTOS.filter(p => p.category === 'Nature').length, coverUrl: MOCK_PHOTOS.find(p => p.category === 'Nature')?.thumbnailUrl || '', type: 'custom' },
  { id: 'urban', title: 'Urban', count: MOCK_PHOTOS.filter(p => p.category === 'Urban').length, coverUrl: MOCK_PHOTOS.find(p => p.category === 'Urban')?.thumbnailUrl || '', type: 'custom' },
  { id: 'travel', title: 'Travel', count: MOCK_PHOTOS.filter(p => p.category === 'Travel').length, coverUrl: MOCK_PHOTOS.find(p => p.category === 'Travel')?.thumbnailUrl || '', type: 'custom' },
  { id: 'deleted', title: 'Recently Deleted', count: 0, coverUrl: '', type: 'utility' },
  { id: 'imports', title: 'Imports', count: MOCK_PHOTOS.filter(p => p.category === 'Imports').length, coverUrl: '', type: 'utility' },
];
