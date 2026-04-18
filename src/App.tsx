/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MoreHorizontal, Camera as CameraIcon, Plus, Share, Heart, Trash2 } from 'lucide-react';
import { ViewType, Photo, Album, TimeScale, PhotoEdits, ThemeType } from './types';
import { MOCK_PHOTOS, MOCK_ALBUMS } from './constants';
import BottomNav from './components/BottomNav';
import PhotoGrid from './components/PhotoGrid';
import DetailView from './components/DetailView';
import CameraView from './components/CameraView';
import AlbumList from './components/AlbumList';
import ForYou from './components/ForYou';
import SearchView from './components/SearchView';
import SettingsView from './components/SettingsView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('Library');
  const [timeScale, setTimeScale] = useState<TimeScale>('Days');
  const [photos, setPhotos] = useState<Photo[]>(MOCK_PHOTOS);
  const [deletedPhotos, setDeletedPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem('lumina-theme') as ThemeType) || 'Dark';
  });

  useEffect(() => {
    localStorage.setItem('lumina-theme', theme);
    const applyTheme = (t: ThemeType) => {
      const root = document.documentElement;
      if (t === 'Dark') {
        root.classList.add('dark');
      } else if (t === 'Light') {
        root.classList.remove('dark');
      } else if (t === 'System') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', isDark);
      }
    };

    applyTheme(theme);

    if (theme === 'System') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches);
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const albums = useMemo(() => {
    // Re-calculate album counts based on current photos
    return MOCK_ALBUMS.map(album => {
      let count = 0;
      let coverUrl = album.coverUrl;

      if (album.id === 'recents') {
        count = photos.length;
        coverUrl = photos[0]?.thumbnailUrl || '';
      } else if (album.id === 'favorites') {
        const favs = photos.filter(p => p.isFavorite);
        count = favs.length;
        coverUrl = favs[0]?.thumbnailUrl || '';
      } else if (album.id === 'deleted') {
        count = deletedPhotos.length;
        coverUrl = deletedPhotos[0]?.thumbnailUrl || '';
      } else if (album.type === 'custom' || album.id === 'imports') {
        const category = album.id.charAt(0).toUpperCase() + album.id.slice(1);
        const catPhotos = photos.filter(p => p.category === category);
        count = catPhotos.length;
        coverUrl = catPhotos[0]?.thumbnailUrl || '';
      } else {
        count = album.count;
      }

      return { ...album, count, coverUrl };
    });
  }, [photos, deletedPhotos]);

  const toggleFavorite = (id: string) => {
    // Check if it's in main photos or deleted
    if (photos.some(p => p.id === id)) {
      setPhotos(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    } else {
      setDeletedPhotos(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    }

    if (selectedPhoto?.id === id) {
      setSelectedPhoto(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const deletePhoto = (id: string) => {
    const photoToDelete = photos.find(p => p.id === id);
    if (photoToDelete) {
      setPhotos(prev => prev.filter(p => p.id !== id));
      setDeletedPhotos(prev => [photoToDelete, ...prev]);
    } else {
      // If already in deleted, remove permanently
      setDeletedPhotos(prev => prev.filter(p => p.id !== id));
    }
    setSelectedPhoto(null);
  };

  const recoverPhoto = (id: string) => {
    const photoToRecover = deletedPhotos.find(p => p.id === id);
    if (photoToRecover) {
      setDeletedPhotos(prev => prev.filter(p => p.id !== id));
      setPhotos(prev => [photoToRecover, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    setSelectedPhoto(null);
  };

  const handleSelectedDelete = () => {
    const photosToDelete = photos.filter(p => selectedIds.includes(p.id));
    setPhotos(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setDeletedPhotos(prev => [...photosToDelete, ...prev]);
    setSelectedIds([]);
    setIsSelecting(false);
  };

  const handleSelectedFavorite = () => {
    setPhotos(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, isFavorite: true } : p));
    setSelectedIds([]);
    setIsSelecting(false);
  };

  const updatePhotoEdits = (id: string, edits: PhotoEdits | undefined) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, edits } : p));
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(prev => prev ? { ...prev, edits } : null);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAlbumClick = (album: Album) => {
    setActiveAlbum(album);
  };

  const handleCameraCapture = (media: { url: string; type: 'image' | 'video' }) => {
    const newPhoto: Photo = {
      id: `capture-${Date.now()}`,
      url: media.url,
      thumbnailUrl: media.url,
      date: new Date().toISOString(),
      location: 'Current Location',
      isFavorite: false,
      width: 1920,
      height: 1080,
      category: 'Library',
      type: media.type
    };
    setPhotos(prev => [newPhoto, ...prev]);
  };

  const handleMediaTypeClick = (type: string) => {
    switch(type) {
      case 'video':
        setActiveAlbum({ id: 'videos', title: 'Videos', count: photos.filter(p => p.type === 'video').length, coverUrl: '', type: 'utility' });
        break;
      case 'selfie':
        setActiveAlbum({ id: 'selfies', title: 'Selfies', count: photos.filter(p => p.isSelfie).length, coverUrl: '', type: 'utility' });
        break;
      case 'live':
        setActiveAlbum({ id: 'live', title: 'Live Photos', count: photos.filter(p => p.isLivePhoto).length, coverUrl: '', type: 'utility' });
        break;
      case 'portrait':
        setActiveAlbum({ id: 'portraits', title: 'Portraits', count: photos.filter(p => p.isPortrait).length, coverUrl: '', type: 'utility' });
        break;
      case 'timelapse':
        setActiveAlbum({ id: 'timelapse', title: 'Time-lapse', count: photos.filter(p => p.isTimelapse).length, coverUrl: '', type: 'utility' });
        break;
    }
  };

  const filteredPhotosForAlbum = useMemo(() => {
    if (!activeAlbum) return photos;
    if (activeAlbum.id === 'recents') return photos;
    if (activeAlbum.id === 'favorites') return photos.filter(p => p.isFavorite);
    if (activeAlbum.id === 'deleted') return deletedPhotos;
    if (activeAlbum.id === 'videos') return photos.filter(p => p.type === 'video');
    if (activeAlbum.id === 'selfies') return photos.filter(p => p.isSelfie);
    if (activeAlbum.id === 'live') return photos.filter(p => p.isLivePhoto);
    if (activeAlbum.id === 'portraits') return photos.filter(p => p.isPortrait);
    if (activeAlbum.id === 'timelapse') return photos.filter(p => p.isTimelapse);
    const category = activeAlbum.id.charAt(0).toUpperCase() + activeAlbum.id.slice(1);
    return photos.filter(p => p.category === category);
  }, [photos, deletedPhotos, activeAlbum]);

  const renderContent = () => {
    if (activeAlbum) {
      return (
        <div className="relative">
          <div className="fixed top-0 left-0 right-0 h-16 ios-glass z-40 flex items-center px-4 justify-between">
            <button 
                onClick={() => {
                  setActiveAlbum(null);
                  setIsSelecting(false);
                  setSelectedIds([]);
                }}
                className="text-ios-blue font-medium flex items-center gap-1"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                Albums
            </button>
            <h1 className="font-bold">{activeAlbum.title}</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsCameraOpen(true)}
                className="text-ios-blue p-2 active:scale-95 transition"
              >
                <CameraIcon size={22} />
              </button>
              <button 
                onClick={() => {
                  setIsSelecting(!isSelecting);
                  setSelectedIds([]);
                }}
                className="text-ios-blue font-medium p-2"
              >
                {isSelecting ? 'Cancel' : 'Select'}
              </button>
            </div>
          </div>
          <PhotoGrid 
            photos={filteredPhotosForAlbum} 
            onPhotoClick={isSelecting ? toggleSelection : setSelectedPhoto} 
            isSelecting={isSelecting}
            selectedIds={selectedIds}
            title={activeAlbum.title}
          />
        </div>
      );
    }

    switch (currentView) {
      case 'Library':
        return (
          <>
            <div className="fixed top-0 left-0 right-0 h-16 ios-glass z-40 flex items-center px-6 justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-ios-blue rounded-lg flex items-center justify-center text-white shadow-sm">
                    <CameraIcon size={18} />
                  </div>
                  <span className="text-xl font-bold">Photos</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsCameraOpen(true)}
                    className="text-ios-blue p-2 active:scale-95 transition"
                  >
                    <CameraIcon size={24} />
                  </button>
                  <button 
                    onClick={() => {
                      setIsSelecting(!isSelecting);
                      setSelectedIds([]);
                    }}
                    className="text-ios-blue font-medium"
                  >
                    {isSelecting ? 'Cancel' : 'Select'}
                  </button>
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="text-ios-blue p-2 active:scale-95 transition"
                  >
                    <MoreHorizontal size={24} />
                  </button>
                </div>
            </div>
            
            {/* TimeScale Selector (Glass UI Segmented Control) */}
            <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 z-40">
              <div className="flex bg-ios-glass-bg backdrop-blur-xl border border-ios-separator rounded-xl p-1 shadow-lg">
                {(['Years', 'Months', 'Days', 'All'] as TimeScale[]).map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setTimeScale(scale)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                      timeScale === scale 
                        ? 'bg-ios-bg shadow-sm text-ios-label' 
                        : 'text-ios-secondary-label hover:text-ios-label'
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>

            <PhotoGrid 
              photos={photos} 
              onPhotoClick={isSelecting ? toggleSelection : setSelectedPhoto} 
              isSelecting={isSelecting}
              selectedIds={selectedIds}
              timeScale={timeScale} 
            />
          </>
        );
      case 'ForYou':
        return (
          <>
            <div className="fixed top-0 left-0 right-0 h-16 ios-glass z-40 flex items-center px-6 justify-between">
                <span className="text-xl font-bold">For You</span>
                <button 
                  onClick={() => setIsCameraOpen(true)}
                  className="text-ios-blue p-2 active:scale-95 transition"
                >
                  <CameraIcon size={24} />
                </button>
            </div>
            <ForYou photos={photos} onPhotoClick={setSelectedPhoto} />
          </>
        );
      case 'Albums':
        return (
          <>
            <div className="fixed top-0 left-0 right-0 h-16 ios-glass z-40 flex items-center px-6 justify-between">
                <button className="text-ios-blue active:scale-95 transition">
                  <Plus size={24} />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-ios-blue rounded-lg flex items-center justify-center text-white shadow-sm">
                    <CameraIcon size={18} />
                  </div>
                  <span className="text-xl font-bold">Albums</span>
                </div>
                <button 
                  onClick={() => setIsCameraOpen(true)}
                  className="text-ios-blue p-2 active:scale-95 transition"
                >
                  <CameraIcon size={24} />
                </button>
            </div>
            <AlbumList 
              albums={albums} 
              onAlbumClick={handleAlbumClick} 
              onMediaTypeClick={handleMediaTypeClick} 
              photos={photos} 
            />
          </>
        );
      case 'Search':
        return (
          <>
            <div className="fixed top-0 left-0 right-0 h-16 ios-glass z-40 flex items-center px-6 justify-between">
                <span className="text-xl font-bold">Search</span>
                <button 
                  onClick={() => setIsCameraOpen(true)}
                  className="text-ios-blue p-2 active:scale-95 transition"
                >
                  <CameraIcon size={24} />
                </button>
            </div>
            <SearchView photos={photos} onPhotoClick={setSelectedPhoto} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ios-bg text-ios-label selection:bg-ios-blue/30 transition-colors duration-300">
      {renderContent()}
      
      {isSelecting ? (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 h-20 ios-glass border-t border-ios-separator z-50 flex items-center justify-around px-6 pb-4"
        >
          <button className="text-ios-blue flex flex-col items-center gap-1 active:scale-95 transition" disabled={selectedIds.length === 0}>
            <Share size={24} />
            <span className="text-[10px] font-medium">Share</span>
          </button>
          <button 
            onClick={handleSelectedFavorite}
            className="text-ios-blue flex flex-col items-center gap-1 active:scale-95 transition" 
            disabled={selectedIds.length === 0}
          >
            <Heart size={24} />
            <span className="text-[10px] font-medium">Favorite</span>
          </button>
          <button 
            onClick={handleSelectedDelete}
            className="text-ios-red flex flex-col items-center gap-1 active:scale-95 transition" 
            disabled={selectedIds.length === 0}
          >
            <Trash2 size={24} />
            <span className="text-[10px] font-medium">Delete</span>
          </button>
        </motion.div>
      ) : !activeAlbum && (
        <BottomNav 
          currentView={currentView} 
          onViewChange={(view) => {
            setCurrentView(view);
            setIsSelecting(false);
            setSelectedIds([]);
            window.scrollTo(0, 0);
          }} 
        />
      )}

      <AnimatePresence>
        {selectedPhoto && (
          <DetailView 
            photo={selectedPhoto} 
            onClose={() => setSelectedPhoto(null)} 
            onToggleFavorite={toggleFavorite}
            onDelete={deletePhoto}
            onUpdateEdits={updatePhotoEdits}
            onRecover={recoverPhoto}
            isDeleted={deletedPhotos.some(p => p.id === selectedPhoto.id)}
          />
        )}
        {showSettings && (
          <SettingsView 
            onClose={() => setShowSettings(false)} 
            theme={theme}
            onThemeChange={setTheme}
          />
        )}
        {isCameraOpen && (
          <CameraView 
            onCapture={handleCameraCapture} 
            onClose={() => setIsCameraOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
