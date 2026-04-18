/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Share, Info, Trash2, Heart, RotateCw, SlidersHorizontal, Crop, 
  RotateCcw, Check, X, Wand2, Maximize, Smartphone,
  Sun, Zap, SunMedium, CloudMoon, Droplets, Thermometer, Palette, Flame, RefreshCw, Contrast,
  Focus
} from 'lucide-react';
import { Photo, PhotoEdits } from '../types';

interface DetailViewProps {
  photo: Photo;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateEdits: (id: string, edits: PhotoEdits | undefined) => void;
  onRecover?: (id: string) => void;
  isDeleted?: boolean;
}

type EditTab = 'adjust' | 'filter' | 'crop';
type AdjustmentType = 'exposure' | 'brilliance' | 'highlights' | 'shadows' | 'contrast' | 'brightness' | 'saturation' | 'vibrance' | 'warmth' | 'tint' | 'sepia' | 'invert';

export default function DetailView({ photo, onClose, onToggleFavorite, onDelete, onUpdateEdits, onRecover, isDeleted }: DetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState<EditTab>('adjust');
  const [activeAdjustment, setActiveAdjustment] = useState<AdjustmentType>('exposure');
  
  // ... rest of the component ...
  const [adjustments, setAdjustments] = useState<Record<AdjustmentType, number>>(photo.edits ? {
    exposure: photo.edits.exposure,
    brilliance: photo.edits.brilliance,
    highlights: photo.edits.highlights,
    shadows: photo.edits.shadows,
    contrast: photo.edits.contrast,
    brightness: photo.edits.brightness,
    saturation: photo.edits.saturation,
    vibrance: photo.edits.vibrance,
    warmth: photo.edits.warmth,
    tint: photo.edits.tint,
    sepia: photo.edits.sepia || 0,
    invert: photo.edits.invert || 0
  } : {
    exposure: 0,
    brilliance: 0,
    highlights: 0,
    shadows: 0,
    contrast: 0,
    brightness: 0,
    saturation: 0,
    vibrance: 0,
    warmth: 0,
    tint: 0,
    sepia: 0,
    invert: 0
  });

  const [rotate, setRotate] = useState(photo.edits?.rotate || 0);
  const [activeFilter, setActiveFilter] = useState(photo.edits?.filter || 'Original');
  const [aspectRatio, setAspectRatio] = useState(photo.edits?.aspectRatio || 'Free');
  const [isAutoEnhanced, setIsAutoEnhanced] = useState(false);

  const resetToOriginal = () => {
    onUpdateEdits(photo.id, undefined);
    resetEdits();
  };

  const resetEdits = () => {
    const defaultAdj = {
        exposure: 0, brilliance: 0, highlights: 0, shadows: 0, contrast: 0,
        brightness: 0, saturation: 0, vibrance: 0, warmth: 0, tint: 0,
        sepia: 0, invert: 0
    };
    setAdjustments(defaultAdj);
    setRotate(0);
    setActiveFilter('Original');
    setAspectRatio('Free');
    setIsAutoEnhanced(false);
    setIsEditing(false);
  };

  const saveEdits = () => {
    const edits: PhotoEdits = {
        ...adjustments,
        filter: activeFilter,
        rotate,
        aspectRatio
    };
    onUpdateEdits(photo.id, edits);
    setIsEditing(false);
  };

  const handleAutoEnhance = () => {
    if (!isAutoEnhanced) {
      setAdjustments({
        exposure: 15,
        brilliance: 25,
        highlights: -10,
        shadows: 20,
        contrast: 10,
        brightness: 5,
        saturation: 15,
        vibrance: 20,
        warmth: 5,
        tint: 0,
        sepia: 0,
        invert: 0
      });
    } else {
      setAdjustments({
        exposure: 0, brilliance: 0, highlights: 0, shadows: 0, contrast: 0,
        brightness: 0, saturation: 0, vibrance: 0, warmth: 0, tint: 0,
        sepia: 0, invert: 0
      });
    }
    setIsAutoEnhanced(!isAutoEnhanced);
  };

  const [isPlaying, setIsPlaying] = useState(false);

  const filterStyle = useMemo(() => {
    let filterStr = `brightness(${100 + adjustments.brightness + adjustments.exposure}%) contrast(${100 + adjustments.contrast}%) saturate(${100 + adjustments.saturation + adjustments.vibrance}%)`;
    
    // ... shadows/highlights logic
    const shadowBrightness = adjustments.shadows > 0 ? 100 + (adjustments.shadows * 0.2) : 100;
    filterStr += ` brightness(${shadowBrightness}%)`;

    if (adjustments.sepia > 0) filterStr += ` sepia(${adjustments.sepia}%)`;
    if (adjustments.invert > 0) filterStr += ` invert(${adjustments.invert}%)`;

    if (activeFilter === 'Mono') filterStr += ' grayscale(100%)';
    if (activeFilter === 'Noir') filterStr += ' grayscale(100%) contrast(150%) brightness(80%)';
    if (activeFilter === 'Vivid') filterStr += ' saturate(160%) contrast(110%)';
    if (activeFilter === 'Dramatic') filterStr += ' contrast(140%) brightness(90%) sepia(20%)';
    if (activeFilter === 'Silvertone') filterStr += ' grayscale(80%) contrast(120%) brightness(110%)';
    
    if (adjustments.warmth !== 0) {
      filterStr += ` sepia(${Math.abs(adjustments.warmth) * 0.5}%)`;
      if (adjustments.warmth < 0) filterStr += ` hue-rotate(180deg) saturate(120%) hue-rotate(-180deg)`;
    }
    if (adjustments.tint !== 0) filterStr += ` hue-rotate(${adjustments.tint}deg)`;

    return {
      filter: photo.type === 'video' ? 'none' : filterStr, // Disable edits for video for now
      transform: `rotate(${rotate}deg)`,
      transition: 'filter 0.1s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      aspectRatio: aspectRatio === 'Square' ? '1/1' : 'auto',
      objectFit: aspectRatio === 'Square' ? 'cover' : 'contain'
    } as any;
  }, [adjustments, rotate, activeFilter, aspectRatio, photo.type]);

  // Handle Play/Pause for video
  const togglePlay = () => {
    const video = document.getElementById(`video-${photo.id}`) as HTMLVideoElement;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const adjustmentOptions: { id: AdjustmentType, label: string, icon: any }[] = [
    { id: 'exposure', label: 'Exposure', icon: Sun },
    { id: 'brilliance', label: 'Brilliance', icon: Zap },
    { id: 'highlights', label: 'Highlights', icon: SunMedium },
    { id: 'shadows', label: 'Shadows', icon: CloudMoon },
    { id: 'contrast', label: 'Contrast', icon: Contrast },
    { id: 'brightness', label: 'Brightness', icon: SunMedium },
    { id: 'saturation', label: 'Saturation', icon: Droplets },
    { id: 'vibrance', label: 'Vibrance', icon: Focus },
    { id: 'warmth', label: 'Warmth', icon: Thermometer },
    { id: 'tint', label: 'Tint', icon: Palette },
    { id: 'sepia', label: 'Sepia', icon: Flame },
    { id: 'invert', label: 'Invert', icon: RefreshCw },
  ];

  const AdjustmentSlider = ({ label, value, min, max, onChange, icon: Icon }: { label: string, value: number, min: number, max: number, onChange: (v: number) => void, icon?: any }) => (
    <div className="flex flex-col w-full px-8 mb-6">
      <div 
        className="flex justify-between text-[10px] text-white/50 uppercase tracking-[0.2em] mb-3 font-black cursor-pointer group"
        onClick={() => onChange(0)}
      >
        <div className="flex items-center gap-2 group-hover:text-white transition-colors">
            {Icon && <Icon size={12} className={value !== 0 ? 'text-ios-blue' : ''} />}
            <span>{label}</span>
        </div>
        <span className={`${value !== 0 ? 'text-ios-blue' : ''} group-hover:scale-110 transition-transform`}>{value > 0 ? `+${value}` : value}</span>
      </div>
      <div className="relative flex items-center h-6">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-4 bg-white/30" />
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full accent-ios-blue h-1 bg-white/10 rounded-full appearance-none cursor-pointer z-10 transition-all active:h-1.5"
        />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-[110] bg-gradient-to-b from-black/90 to-transparent">
        {isEditing ? (
          <div className="flex items-center gap-4">
            <button onClick={() => setIsEditing(false)} className="text-white text-sm font-semibold px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-md">
              Cancel
            </button>
            {photo.edits && (
                <button onClick={resetToOriginal} className="text-ios-red text-sm font-semibold px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-md">
                    Revert
                </button>
            )}
          </div>
        ) : (
          <button onClick={onClose} className="text-white p-2">
            <ChevronLeft size={28} />
          </button>
        )}
        
        {!isEditing && (
          <div className="flex flex-col items-center">
              <span className="text-white text-sm font-bold tracking-tight">{new Date(photo.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
              <span className="text-white/50 text-[10px] uppercase font-black tracking-widest">{photo.location}</span>
          </div>
        )}

        {isEditing && photo.type === 'image' && (
          <button 
            onClick={handleAutoEnhance}
            className={`p-2 rounded-full transition-all duration-300 ${isAutoEnhanced ? 'bg-ios-blue text-white' : 'bg-white/10 text-white'}`}
          >
            <Wand2 size={20} />
          </button>
        )}

        <div className="flex items-center gap-2">
          {!isEditing && photo.type === 'image' && !isDeleted && (
            <button onClick={() => setIsEditing(true)} className="text-ios-blue text-sm font-bold px-4 py-1.5 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-md">
              Edit
            </button>
          )}
          {isDeleted && onRecover && (
            <button 
              onClick={() => onRecover(photo.id)} 
              className="text-ios-blue text-sm font-bold px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-md active:scale-95 transition"
            >
              Recover
            </button>
          )}
          {isEditing && (
             <button onClick={saveEdits} className="text-ios-blue text-sm font-bold px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-md">
                Done
             </button>
          )}
          {!isEditing && (
            <button 
              onClick={() => setShowShareSheet(true)}
              className="text-white p-2"
            >
              <Share size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Main Image/Video Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden h-full px-6 pt-16 pb-32">
        <div className={`relative max-w-full max-h-full flex items-center justify-center transition-all duration-500 ${activeTab === 'crop' ? 'scale-90 p-4 border border-white/20 rounded-lg' : ''}`}>
            {photo.type === 'video' ? (
              <div className="relative group/video h-full w-full flex items-center justify-center" onClick={togglePlay}>
                <video 
                  id={`video-${photo.id}`}
                  src={photo.videoUrl}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-active/video:scale-95 transition-all">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white ring-1 ring-white/30">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 translate-x-1">
                        <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <motion.img
                layoutId={photo.id}
                src={photo.url}
                alt={photo.location}
                style={filterStyle}
                className="max-w-full max-h-full object-contain shadow-2xl"
                referrerPolicy="no-referrer"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              />
            )}
            
            {isDeleted && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold border border-white/10">
                   30 DAYS REMAINING
                </div>
            )}
            
            {activeTab === 'crop' && photo.type === 'image' && (
              <div className="absolute inset-0 pointer-events-none rounded-lg border border-white/30 grid grid-cols-3 grid-rows-3">
                 {Array.from({ length: 9 }).map((_, i) => <div key={i} className="border-[0.5px] border-white/10" />)}
              </div>
            )}
        </div>
      </div>

      {/* Share Sheet */}
      <AnimatePresence>
        {showShareSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowShareSheet(false)}
              className="absolute inset-0 bg-black/60 z-[120] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-ios-bg rounded-t-[32px] p-8 z-[130] safe-bottom"
            >
              <div className="w-12 h-1.5 bg-ios-separator rounded-full mx-auto mb-8" />
              <div className="flex items-center gap-5 mb-10">
                <img src={photo.thumbnailUrl} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                <div>
                  <h3 className="text-lg font-bold text-black">1 Photo Selected</h3>
                  <p className="text-[11px] text-ios-secondary-label uppercase font-black tracking-widest mt-1">
                    {photo.width} x {photo.height} • {photo.location}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 mb-10">
                {[{ icon: '💬' }, { icon: '📧' }, { icon: '💿' }, { icon: '📸' }].map((it, i) => (
                  <div key={i} className="w-16 h-16 bg-ios-secondary-bg rounded-3xl flex items-center justify-center text-3xl shadow-sm hover:scale-105 transition" >{it.icon}</div>
                ))}
              </div>
              <div className="bg-ios-secondary-bg rounded-2xl divide-y divide-ios-separator overflow-hidden">
                {['Copy', 'Add to Album', 'Duplicate'].map(act => (
                  <button key={act} className="w-full p-4 text-left text-ios-blue text-sm font-bold active:bg-ios-separator transition">{act}</button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Info Sheet */}
      <AnimatePresence>
        {showInfo && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className="absolute inset-0 bg-black/60 z-[120] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-ios-bg rounded-t-[32px] p-6 z-[130] safe-bottom max-h-[80vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-ios-separator rounded-full mx-auto mb-6" />
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black italic tracking-tighter">Details</h2>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="bg-ios-secondary-bg p-2 rounded-full text-ios-secondary-label"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-ios-secondary-bg rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-ios-blue/10 rounded-xl flex items-center justify-center text-ios-blue">
                    <Smartphone size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Apple iPhone 15 Pro</h4>
                    <p className="text-xs text-ios-secondary-label">Main Camera — 24mm f1.78</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-ios-secondary-bg rounded-2xl p-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-ios-secondary-label block mb-1">ISO</span>
                    <span className="font-bold">80</span>
                  </div>
                  <div className="bg-ios-secondary-bg rounded-2xl p-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-ios-secondary-label block mb-1">Speed</span>
                    <span className="font-bold">1/120s</span>
                  </div>
                </div>

                <div className="bg-ios-secondary-bg rounded-2xl divide-y divide-ios-separator overflow-hidden text-sm">
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-ios-secondary-label">Created At</span>
                    <span className="font-medium">{new Date(photo.date).toLocaleString()}</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-ios-secondary-label">Dimensions</span>
                    <span className="font-medium">{photo.width} × {photo.height}</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-ios-secondary-label">Format</span>
                    <span className="font-medium uppercase">{photo.url.split('.').pop()?.split('?')[0] || 'HEIC'}</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-ios-secondary-label">Size</span>
                    <span className="font-medium">2.4 MB</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-ios-secondary-label">Location</span>
                    <span className="font-medium">{photo.location}</span>
                  </div>
                </div>

                <div className="p-4 text-center">
                  <button className="text-ios-blue font-bold text-sm hover:underline">Adjust Date & Time</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Controls / Editing Toolbar */}
      <div className="absolute bottom-0 left-0 right-0 z-[110] bg-gradient-to-t from-black/90 to-transparent safe-bottom">
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div 
              key="normal-toolbar"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="h-24 flex items-center justify-around px-8"
            >
              {!isDeleted && (
                <button 
                  onClick={() => onToggleFavorite(photo.id)}
                  className={`p-3 rounded-full transition-all ${photo.isFavorite ? 'text-ios-red bg-white/10' : 'text-white'}`}
                >
                  <Heart size={26} fill={photo.isFavorite ? 'currentColor' : 'none'} />
                </button>
              )}
              <button 
                onClick={() => setShowInfo(true)}
                className="text-white p-3 hover:bg-white/10 rounded-full transition-colors"
              >
                <Info size={26} />
              </button>
              <button 
                onClick={() => onDelete(photo.id)}
                className={`p-3 rounded-full transition-all ${isDeleted ? 'text-ios-red bg-ios-red/10 animate-pulse-slow' : 'text-white hover:bg-white/10'}`}
              >
                <Trash2 size={26} />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="edit-toolbar"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="flex flex-col w-full pb-6"
            >
              <div className="flex flex-col items-center justify-center min-h-[220px]">
                {activeTab === 'adjust' && (
                  <div className="w-full flex flex-col items-center px-4">
                    {(() => {
                      const opt = adjustmentOptions.find(o => o.id === activeAdjustment);
                      return (
                        <AdjustmentSlider 
                          label={opt?.label || ''} 
                          icon={opt?.icon}
                          value={adjustments[activeAdjustment]} 
                          min={-100} max={100} 
                          onChange={(v) => setAdjustments(prev => ({ ...prev, [activeAdjustment]: v }))} 
                        />
                      );
                    })()}
                    <div className="flex gap-3 overflow-x-auto scroll-hide-scrollbar w-full px-4 pt-2 pb-2">
                       {adjustmentOptions.map((opt) => (
                         <button
                           key={opt.id}
                           onClick={() => setActiveAdjustment(opt.id)}
                           className={`flex-shrink-0 flex flex-col items-center gap-1.5 transition-all ${activeAdjustment === opt.id ? 'scale-110' : 'opacity-60'}`}
                         >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeAdjustment === opt.id ? 'bg-ios-blue text-white ring-2 ring-white/20' : 'bg-white/10 text-white'}`}>
                               <opt.icon size={20} strokeWidth={activeAdjustment === opt.id ? 2.5 : 2} />
                            </div>
                            <span className={`text-[8px] uppercase tracking-tighter font-black ${activeAdjustment === opt.id ? 'text-ios-blue' : 'text-white/40'}`}>{opt.label}</span>
                         </button>
                       ))}
                    </div>
                  </div>
                )}
                {activeTab === 'crop' && (
                  <div className="flex flex-col items-center gap-10 w-full px-8">
                    <div className="flex gap-16">
                      <button onClick={() => setRotate(r => r - 45)} className="text-white flex flex-col items-center gap-2 group">
                        <RotateCcw size={32} className="group-active:scale-90 transition" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">-45°</span>
                      </button>
                      <button onClick={() => setRotate(r => r + 90)} className="text-white flex flex-col items-center gap-2 group">
                        <RotateCw size={32} className="group-active:scale-90 transition" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">+90°</span>
                      </button>
                      <button onClick={() => setAspectRatio(a => a === 'Square' ? 'Free' : 'Square')} className={`flex flex-col items-center gap-2 group ${aspectRatio === 'Square' ? 'text-ios-blue' : 'text-white'}`}>
                        <Maximize size={32} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-inherit">{aspectRatio}</span>
                      </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto w-full scroll-hide-scrollbar">
                       {['Free', 'Square', 'Original', '9:16', '8:10', '5:7', '3:4', '2:3'].map(asp => (
                         <button 
                           key={asp} 
                           onClick={() => setAspectRatio(asp)}
                           className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${aspectRatio === asp ? 'bg-ios-blue text-white' : 'bg-white/10 text-white/60'}`}
                         >
                           {asp}
                         </button>
                       ))}
                    </div>
                  </div>
                )}
                {activeTab === 'filter' && (
                  <div className="flex gap-4 px-6 overflow-x-auto scroll-hide-scrollbar w-full py-6">
                    {['Original', 'Vivid', 'Dramatic', 'Mono', 'Silvertone', 'Noir', 'Vivid Warm', 'Vivid Cool', 'Dramatic Warm'].map((f) => (
                      <button 
                        key={f} 
                        onClick={() => setActiveFilter(f)}
                        className="flex flex-col items-center gap-4 flex-shrink-0"
                      >
                        <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeFilter === f ? 'border-ios-blue scale-110 shadow-lg ring-4 ring-ios-blue/20' : 'border-transparent opacity-60'}`}>
                          <img src={photo.thumbnailUrl} className={`w-full h-full object-cover ${f.includes('Mono') || f.includes('Noir') || f.includes('Silver') ? 'grayscale' : ''} ${f.includes('Vivid') ? 'saturate-150' : ''}`} referrerPolicy="no-referrer" />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${activeFilter === f ? 'text-ios-blue' : 'text-white/40'}`}>{f}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-center items-center gap-16 mt-6">
                <button onClick={() => setActiveTab('adjust')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'adjust' ? 'text-ios-blue scale-110 font-black' : 'text-white/40'}`}>
                  <SlidersHorizontal size={26} strokeWidth={activeTab === 'adjust' ? 3 : 2} />
                  <span className="text-[9px] uppercase tracking-widest">Adjust</span>
                </button>
                <button onClick={() => setActiveTab('filter')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'filter' ? 'text-ios-blue scale-110 font-black' : 'text-white/40'}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'filter' ? 2.5 : 2} className="w-7 h-7"><circle cx="12" cy="12" r="10" /><circle cx="10" cy="10" r="3" /></svg>
                  <span className="text-[9px] uppercase tracking-widest">Filters</span>
                </button>
                <button onClick={() => setActiveTab('crop')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'crop' ? 'text-ios-blue scale-110 font-black' : 'text-white/40'}`}>
                  <Crop size={26} strokeWidth={activeTab === 'crop' ? 3 : 2} />
                  <span className="text-[9px] uppercase tracking-widest">Crop</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
