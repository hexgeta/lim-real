'use client'

import React, { useState } from 'react';
import MatrixBackground from '@/components/MatrixBackground';
import MusicPlayer from '@/components/MusicPlayer';
import TimeDisplay from '@/components/TimeDisplay';
import LivePdaiPrice from '@/components/LivePdaiPrice';

const playlist = [
  '1.mp3'
];

export default function PdaiLivestream() {
  const [hasEntered, setHasEntered] = useState(false);
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false);

  const handleEnter = () => {
    setHasEntered(true);
    setShouldPlayMusic(true);
  };

  return (
    <div className="radio-page min-h-screen min-w-[1024px] overflow-auto">
      <div className="relative z-10 min-h-screen w-full flex items-start md:items-center justify-center p-4 pt-2 md:py-4">
        <div className="w-full max-w-6xl min-w-[960px]">
          <TimeDisplay />
          <div className="">
            <LivePdaiPrice />
          </div>
        </div>
      </div>
      <MusicPlayer playlist={playlist} autoPlay={shouldPlayMusic} />

      {/* Overlay */}
      {!hasEntered && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">pDAI Live Price Radio™</h1>
            <p className="text-center text-gray-400 mb-8 max-w-xs">
              Celebrating our addiction to watching crypto prices to tunes.
            </p>
            <button 
              onClick={handleEnter}
              className="bg-white text-black px-8 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 