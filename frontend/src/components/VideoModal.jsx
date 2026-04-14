import React, { useEffect, useState, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react';

const VideoModal = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Auto-play when opened
  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Small delay to ensure modal animation is underway
      const timer = setTimeout(() => {
        videoRef.current.play().catch(err => {
          console.warn("Autoplay blocked or failed:", err);
          setIsPlaying(false);
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle controls visibility
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress || 0);
      setCurrentTime(formatTime(video.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(formatTime(video.duration));
    }
  };

  const handleProgressChange = (e) => {
    const video = videoRef.current;
    if (video) {
      const newTime = (e.target.value / 100) * video.duration;
      video.currentTime = newTime;
      setProgress(e.target.value);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(79,70,229,0.2)] border border-white/10 animate-scaleIn"
        onMouseMove={handleMouseMove}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-3 bg-black/40 hover:bg-white/10 backdrop-blur-xl rounded-full text-white transition-all hover:rotate-90 hover:scale-110"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Video Element */}
        <div className="relative w-full h-full group">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
            poster="/images/nexora_demo_poster.png"
            playsInline
            autoPlay
            muted
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-data-charts-on-a-digital-screen-865-large.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-laptop-34448-large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Custom Controls UI */}
          <div 
            className={`absolute inset-x-0 bottom-0 p-6 md:p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-4 md:gap-6 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Timeline Wrapper */}
            <div className="relative w-full h-1.5 md:h-2 group/timeline cursor-pointer">
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
              <input 
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleProgressChange}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
              {/* Thumb glow */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover/timeline:opacity-100 transition-opacity pointer-events-none"
                style={{ left: `calc(${progress}% - 8px)` }}
              ></div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 md:gap-8">
                {/* Play/Pause */}
                <button 
                  onClick={togglePlay} 
                  className="text-white hover:text-indigo-400 transition-all transform active:scale-90"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 md:w-8 md:h-8 fill-current translate-x-0.5" />
                  )}
                </button>

                {/* Time Display */}
                <div className="flex items-center gap-2 text-white/80 font-mono text-sm md:text-base selection:bg-transparent">
                  <span className="text-white font-bold">{currentTime}</span>
                  <span className="opacity-40">/</span>
                  <span className="opacity-60">{duration}</span>
                </div>

                {/* Volume Control */}
                <div className="hidden sm:flex items-center gap-3 group/volume">
                  <button 
                    onClick={() => {
                      setIsMuted(!isMuted);
                      if (videoRef.current) videoRef.current.muted = !isMuted;
                    }} 
                    className="text-white hover:text-indigo-400 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 md:w-6 md:h-6" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
                  </button>
                  <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300 ease-out">
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1"
                      defaultValue="1"
                      onChange={(e) => {
                        if (videoRef.current) videoRef.current.volume = e.target.value;
                      }}
                      className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <button 
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime -= 10;
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                  title="Backward 10s"
                >
                  <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="text-white hover:text-indigo-400 transition-all hover:scale-110"
                >
                  <Maximize2 className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Big Center Play Button (Visible when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 bg-indigo-600/20 backdrop-blur-sm rounded-full flex items-center justify-center p-1 border border-white/20 animate-pulse">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="w-full h-full bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(79,70,229,0.5)] transform transition-transform hover:scale-110 pointer-events-auto"
                >
                  <Play className="w-10 h-10 fill-current translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {/* SaaS Branding Overlay */}
          <div className="absolute top-8 left-8 flex items-center gap-3 opacity-60 pointer-events-none">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
               <img src="/nexoralogo.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase">Nexora<span className="text-indigo-400">AI</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
