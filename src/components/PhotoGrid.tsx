/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Photo, TimeScale } from '../types';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (media: any) => void;
  title?: string;
  timeScale?: TimeScale;
  isSelecting?: boolean;
  selectedIds?: string[];
}

export default function PhotoGrid({ photos, onPhotoClick, title, timeScale = 'Days', isSelecting = false, selectedIds = [] }: PhotoGridProps) {
  // Group photos based on timeScale
  const groupedPhotos = photos.reduce((acc, photo) => {
    let dateLabel = '';
    const dateObj = new Date(photo.date);
    
    if (timeScale === 'Years') {
      dateLabel = dateObj.getFullYear().toString();
    } else if (timeScale === 'Months') {
      dateLabel = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (timeScale === 'Days') {
      dateLabel = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } else {
      dateLabel = 'All Photos'; // Flattened for 'All'
    }

    if (!acc[dateLabel]) acc[dateLabel] = [];
    acc[dateLabel].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  const getGridClass = () => {
    switch (timeScale) {
      case 'Years': return 'grid grid-cols-2 sm:grid-cols-3 gap-6';
      case 'Months': return 'grid grid-cols-3 sm:grid-cols-4 gap-3';
      case 'Days': return 'photo-grid';
      case 'All': return 'grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1';
      default: return 'photo-grid';
    }
  };

  const getContainerPadding = () => {
    return timeScale === 'All' ? 'pb-24 pt-32 px-1' : 'pb-24 pt-32 px-4';
  };

  return (
    <div className={getContainerPadding()}>
      {title && (
        <h1 className="text-3xl font-bold mb-6 pt-4">{title}</h1>
      )}
      
      {Object.entries(groupedPhotos).map(([label, photosAtLabel]) => (
        <div key={label} className={timeScale === 'All' ? 'mb-1' : 'mb-8'}>
          {timeScale !== 'All' && (
            <div className="flex justify-between items-end mb-2">
              <h2 className={`font-bold ${timeScale === 'Years' ? 'text-2xl' : 'text-lg'}`}>
                {label}
              </h2>
              {timeScale === 'Days' && (
                <button 
                  onClick={() => onPhotoClick({ id: 'TOGGLE_SELECT' })} // Dummy to trigger if needed, but better use App level
                  className="text-ios-blue text-sm font-medium"
                >
                  Select
                </button>
              )}
            </div>
          )}
          
          <div className={getGridClass()}>
            {photosAtLabel.map((photo) => (
              <motion.div
                key={photo.id}
                layoutId={photo.id}
                onClick={() => onPhotoClick(isSelecting ? photo.id : photo)}
                whileTap={{ scale: 0.95 }}
                className={`bg-ios-secondary-bg overflow-hidden cursor-pointer relative group ${
                  timeScale === 'Years' ? 'rounded-2xl aspect-[4/3]' : 
                  timeScale === 'All' ? 'aspect-square' : 'aspect-square rounded-sm'
                } ${isSelecting && selectedIds.includes(photo.id) ? 'ring-[3px] ring-white/50 ring-inset' : ''}`}
              >
                <img
                  src={timeScale === 'Years' ? photo.url : photo.thumbnailUrl}
                  alt={photo.location}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isSelecting && selectedIds.includes(photo.id) ? 'scale-90 rounded-md opacity-80' : 'scale-100 opacity-100'}`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {isSelecting && (
                   <div className="absolute top-1.5 right-1.5 z-20">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedIds.includes(photo.id) ? 'bg-ios-blue border-ios-blue' : 'bg-black/10 border-white/60'}`}>
                         {selectedIds.includes(photo.id) && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3.5 h-3.5 text-white">
                               <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                         )}
                      </div>
                   </div>
                )}
                
                {photo.type === 'video' && (
                  <>
                    <div className="absolute top-2 right-2 text-white drop-shadow-lg z-10">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="m4.5 5.653 11.528 6.347a.75.75 0 0 1 0 1.3L4.5 19.647a.75.75 0 0 1-1.128-.65V6.303a.75.75 0 0 1 1.128-.65Z" />
                      </svg>
                    </div>
                    <div className="absolute bottom-1 right-1 text-white text-[10px] font-bold px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded-md z-10">
                      {photo.duration}
                    </div>
                  </>
                )}

                {timeScale === 'Years' && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-xs font-medium opacity-80">{photosAtLabel.length} {photosAtLabel.some(p => p.type === 'video') ? 'Items' : 'Photos'}</p>
                  </div>
                )}

                {photo.isFavorite && timeScale !== 'All' && photo.type === 'image' && (
                  <div className="absolute bottom-1 right-1 text-white drop-shadow-md">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001Z" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
