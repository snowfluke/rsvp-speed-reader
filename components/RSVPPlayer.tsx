
import React from 'react';
import { WordData } from '../types';
import { splitWord } from '../utils/textProcessor';

interface RSVPPlayerProps {
  currentWord: WordData | undefined;
  progress: number;
}

const RSVPPlayer: React.FC<RSVPPlayerProps> = ({ currentWord, progress }) => {
  if (!currentWord) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-black border-y border-zinc-800 relative overflow-hidden">
         <span className="text-zinc-600 font-medium">No text to display</span>
      </div>
    );
  }

  const { prefix, focal, suffix } = splitWord(currentWord);

  return (
    <div className="w-full h-64 flex flex-col items-center justify-center bg-black border-y border-zinc-800 relative overflow-hidden">
      {/* Guideline Markers */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[4.5rem] w-px h-6 bg-zinc-700"></div>
      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-[4.5rem] w-px h-6 bg-zinc-700"></div>
      
      {/* Horizontal Guideline - Subtle */}
      <div className="absolute top-1/2 w-full h-px bg-zinc-900 -translate-y-1/2"></div>

      {/* Word Container */}
      <div className="relative flex items-center mono text-5xl md:text-7xl font-bold tracking-tight">
        {/* We use a fixed width container for the focal character to keep it centered */}
        <div className="flex w-full justify-center">
            <div className="text-right flex-1 text-white opacity-90 pr-0">
                {prefix}
            </div>
            <div className="text-red-600 mx-0.5">
                {focal}
            </div>
            <div className="text-left flex-1 text-white opacity-90 pl-0">
                {suffix}
            </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default RSVPPlayer;
