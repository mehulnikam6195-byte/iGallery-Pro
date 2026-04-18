/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Photo } from '../types';

interface ForYouProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export default function ForYou({ photos, onPhotoClick }: ForYouProps) {
  const featured = photos.slice(0, 3);
  const memories = photos.slice(5, 10);

  return (
    <div className="pb-24 pt-20 px-4">
      <div className="mb-0">
        <h2 className="text-xl font-bold mb-4">Memories</h2>
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-8 group cursor-pointer" onClick={() => onPhotoClick(featured[0])}>
            <img 
                src={featured[0].url} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs uppercase tracking-widest font-semibold text-white/70 mb-1">Featured Photo</p>
                <h3 className="text-2xl font-bold">A Day in Tokyo</h3>
                <p className="text-sm font-medium text-white/80">3 Years Ago</p>
            </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Recommendations</h2>
        <div className="flex overflow-x-auto gap-4 scroll-hide-scrollbar pb-4">
            {memories.map((photo, i) => (
                <div 
                    key={photo.id} 
                    className="flex-shrink-0 w-48 aspect-[3/4] rounded-xl overflow-hidden relative"
                    onClick={() => onPhotoClick(photo)}
                >
                    <img 
                        src={photo.thumbnailUrl} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <span className="absolute bottom-3 left-3 text-white font-medium text-sm">Memory {i+1}</span>
                </div>
            ))}
        </div>
        
        <div className="mt-8 bg-ios-secondary-bg rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-2">Sharing Suggestions</h3>
            <p className="text-sm text-ios-secondary-label mb-4">Share these photos from last weekend with your friends.</p>
            <div className="grid grid-cols-3 gap-2">
                {photos.slice(10, 13).map(p => (
                    <img key={p.id} src={p.thumbnailUrl} className="aspect-square rounded-md object-cover" referrerPolicy="no-referrer" />
                ))}
            </div>
            <button 
                onClick={() => onPhotoClick(photos[10])}
                className="w-full mt-4 py-3 bg-ios-blue text-white rounded-xl font-semibold text-sm transition-transform active:scale-[0.98]"
            >
                Review Photos
            </button>
        </div>
      </div>
    </div>
  );
}
