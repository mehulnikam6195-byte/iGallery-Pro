/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search as SearchIcon, X } from 'lucide-react';
import { useState } from 'react';
import { Photo } from '../types';

interface SearchProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export default function Search({ photos, onPhotoClick }: SearchProps) {
  const [query, setQuery] = useState('');
  
  const filteredPhotos = query.trim() === '' 
    ? [] 
    : photos.filter(p => 
        p.location.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );

  const categories = ['Summer', 'Japan', 'Portraits', 'Vacation', 'Architecture', 'Nature'];

  return (
    <div className="pb-24 pt-20 px-4">
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon className="text-ios-secondary-label" size={20} />
          </div>
          <input
            type="text"
            className="w-full h-10 pl-10 pr-10 bg-ios-secondary-bg rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue/50"
            placeholder="Search Photos"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              <X className="text-white bg-ios-secondary-label rounded-full p-0.5" size={16} />
            </button>
          )}
        </div>
      </div>

      {!query && (
        <>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Searches</h2>
              <button className="text-ios-blue text-sm font-medium">Clear</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setQuery(cat)}
                  className="px-4 py-2 bg-ios-secondary-bg rounded-full text-sm font-medium hover:bg-ios-blue/10 active:scale-95 transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Home', 'Pets', 'Work', 'Food'].map((cat, i) => (
                <div key={i} className="aspect-video bg-ios-secondary-bg rounded-lg relative overflow-hidden group">
                  <img 
                    src={`https://picsum.photos/seed/${cat}/400/225`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
                  <span className="absolute bottom-2 left-3 text-white font-semibold flex items-center gap-2">
                    {cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {query && filteredPhotos.length > 0 && (
          <div className="photo-grid mt-4">
               {filteredPhotos.map((photo) => (
                    <div
                        key={photo.id}
                        onClick={() => onPhotoClick(photo)}
                        className="aspect-square bg-ios-secondary-bg overflow-hidden cursor-pointer"
                    >
                        <img
                            src={photo.thumbnailUrl}
                            alt={photo.location}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                ))}
          </div>
      )}
      
      {query && filteredPhotos.length === 0 && (
          <div className="text-center py-20 text-ios-secondary-label">
              No results found for "{query}"
          </div>
      )}
    </div>
  );
}
