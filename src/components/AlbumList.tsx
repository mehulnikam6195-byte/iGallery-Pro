/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, ChevronRight } from 'lucide-react';
import { Album, Photo } from '../types';

interface AlbumListProps {
  albums: Album[];
  onAlbumClick: (album: Album) => void;
  onMediaTypeClick: (type: string) => void;
  photos: Photo[];
}

export default function AlbumList({ albums, onAlbumClick, onMediaTypeClick, photos }: AlbumListProps) {
  const systemAlbums = albums.filter(a => a.type === 'system');
  const customAlbums = albums.filter(a => a.type === 'custom');

  const mediaTypes = [
    { icon: '📹', label: 'Videos', count: photos.filter(p => p.type === 'video').length, id: 'video' },
    { icon: '🤳', label: 'Selfies', count: photos.filter(p => p.isSelfie).length, id: 'selfie' },
    { icon: '📸', label: 'Live Photos', count: photos.filter(p => p.isLivePhoto).length, id: 'live' },
    { icon: '📐', label: 'Portraits', count: photos.filter(p => p.isPortrait).length, id: 'portrait' },
    { icon: '🕓', label: 'Time-lapse', count: photos.filter(p => p.isTimelapse).length, id: 'timelapse' },
  ];

  const AlbumSection = ({ title, items }: { title: string, items: Album[] }) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {title === 'My Albums' && <button className="text-ios-blue text-sm font-medium">See All</button>}
      </div>
      <div className="flex overflow-x-auto gap-4 scroll-hide-scrollbar pb-4">
        {items.map((album) => (
          <div 
            key={album.id} 
            className="flex-shrink-0 w-[160px] cursor-pointer"
            onClick={() => onAlbumClick(album)}
          >
            <div className="aspect-square bg-ios-secondary-bg rounded-lg overflow-hidden mb-2">
              {album.coverUrl ? (
                <img 
                  src={album.coverUrl} 
                  alt={album.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ios-secondary-label">
                  No Photos
                </div>
              )}
            </div>
            <p className="text-sm font-medium truncate">{album.title}</p>
            <p className="text-xs text-ios-secondary-label">{album.count}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pb-24 pt-20 px-4">
      <AlbumSection title="My Albums" items={customAlbums} />
      
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-4">People & Places</h1>
        <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-ios-secondary-bg rounded-lg overflow-hidden relative">
                <img src="https://picsum.photos/seed/people/300/300" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute bottom-2 left-2 text-white font-semibold">People</span>
            </div>
             <div className="aspect-square bg-ios-secondary-bg rounded-lg overflow-hidden relative">
                <img src="https://picsum.photos/seed/places/300/300" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute bottom-2 left-2 text-white font-semibold">Places</span>
            </div>
        </div>
      </div>

      <div className="mb-0 overflow-hidden rounded-xl border border-ios-separator divide-y divide-ios-separator">
        <h2 className="text-xl font-bold px-0 mb-4 ml-0 mt-8">Media Types</h2>
        {mediaTypes.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => onMediaTypeClick(item.id as any)}
            className="flex items-center justify-between p-3 bg-ios-bg active:bg-ios-secondary-bg transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-ios-blue text-sm font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-1 text-ios-secondary-label">
              <span className="text-sm">{item.count}</span>
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 overflow-hidden rounded-xl border border-ios-separator divide-y divide-ios-separator mt-8">
        <h2 className="text-xl font-bold px-0 mb-4 ml-0">Utilities</h2>
        {albums.filter(a => a.type === 'utility').map((album) => (
          <div 
            key={album.id} 
            onClick={() => onAlbumClick(album)}
            className="flex items-center justify-between p-3 bg-ios-bg active:bg-ios-secondary-bg transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {album.id === 'imports' ? '📥' : '🗑️'}
              </span>
              <span className="text-ios-blue text-sm font-medium">{album.title}</span>
            </div>
            <div className="flex items-center gap-1 text-ios-secondary-label">
              <span className="text-sm">{album.count}</span>
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
