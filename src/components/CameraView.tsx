/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, RotateCw, Zap, Image as ImageIcon, Circle } from 'lucide-react';

interface CameraViewProps {
  onCapture: (capturedMedia: { url: string; type: 'image' | 'video' }) => void;
  onClose: () => void;
}

export default function CameraView({ onCapture, onClose }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isFlashOn, setIsFlashOn] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      // Small delay to ensure previous stream is fully released by the system
      await new Promise(resolve => setTimeout(resolve, 100));
      if (isMounted) {
        startCamera();
      }
    };

    initialize();
    
    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async (useFallback = false) => {
    try {
      if (stream) {
        stopCamera();
        // Give it a moment to stop
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const constraints: MediaStreamConstraints = {
        video: useFallback ? true : { 
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };
      
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        setStream(newStream);
        setIsReady(true);
        setError(null);
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      
      // If the specific constraints failed, try with basic ones
      if (!useFallback) {
        console.log('Retrying with fallback constraints...');
        startCamera(true);
        return;
      }

      const msg = err.message || 'Unknown error';
      if (msg.includes('Could not start video source')) {
          setError('Camera is currently in use by another application or tab. Please close other programs using the camera and try again.');
      } else if (msg.includes('Permission denied')) {
          setError('Camera permission was denied. Please check your browser settings.');
      } else {
          setError(`Could not access camera: ${msg}`);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      onCapture({ url: dataUrl, type: 'image' });
      onClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col"
    >
      {/* Camera Preview */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="text-white p-8 text-center">
            <p className="mb-4 text-ios-red">{error}</p>
            <button 
              onClick={onClose}
              className="bg-white/10 px-6 py-2 rounded-full font-bold"
            >
              Go Back
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-transform duration-500 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />
        )}

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-10 bg-gradient-to-b from-black/50 to-transparent">
          <button 
            onClick={() => setIsFlashOn(!isFlashOn)}
            className={`p-2 rounded-full ${isFlashOn ? 'text-yellow-400 bg-white/10' : 'text-white'}`}
          >
            <Zap size={24} fill={isFlashOn ? 'currentColor' : 'none'} />
          </button>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-white bg-black/20 backdrop-blur-md"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Flash Effect */}
        <AnimatePresence>
          {isFlashOn && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 0.1 }}
               className="absolute inset-0 bg-white pointer-events-none z-50"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="h-44 bg-black flex flex-col items-center justify-center relative pb-10">
        <div className="flex items-center justify-around w-full px-10">
          <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
             <ImageIcon size={24} className="text-white/50" />
          </div>

          <button 
            onClick={handleCapture}
            className="group relative flex items-center justify-center"
            disabled={!isReady}
          >
            <div className="w-20 h-20 rounded-full border-[3px] border-white flex items-center justify-center transition-transform active:scale-90 duration-75">
               <div className="w-[66px] h-[66px] bg-white rounded-full transition-all group-active:scale-95" />
            </div>
          </button>

          <button 
            onClick={toggleFacingMode}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20 transition"
          >
            <RotateCw size={24} />
          </button>
        </div>
        
        <div className="mt-6 flex gap-8">
            <span className="text-ios-blue text-[10px] font-black uppercase tracking-widest">Photo</span>
            <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">Video</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}
