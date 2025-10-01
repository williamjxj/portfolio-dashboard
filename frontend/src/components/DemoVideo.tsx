'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface DemoVideoProps {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
}

export const DemoVideo: React.FC<DemoVideoProps> = ({ 
  src, 
  poster, 
  alt, 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="relative overflow-hidden rounded-lg">
        {src.endsWith('.gif') || src.endsWith('.webp') ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        ) : (
          <video
            src={src}
            poster={poster}
            className="w-full h-auto object-cover"
            muted={isMuted}
            loop
            playsInline
            autoPlay={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}
        
        {/* Overlay controls */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={togglePlay}
              className="bg-white bg-opacity-90 hover:bg-opacity-100"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            {!src.endsWith('.gif') && !src.endsWith('.webp') && (
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleMute}
                className="bg-white bg-opacity-90 hover:bg-opacity-100"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoVideo;

