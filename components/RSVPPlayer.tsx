
import React from 'react';
import { WordData } from '../types';
import { splitWord } from '../utils/textProcessor';

interface RSVPPlayerProps {
  currentWord: WordData | undefined;
  progress: number;
  zenMode?: boolean;
}

const RSVPPlayer: React.FC<RSVPPlayerProps> = ({ currentWord, progress, zenMode }) => {
  if (!currentWord) {
    return (
      <div className={`w-full flex items-center justify-center bg-black relative overflow-hidden transition-all duration-700 ${zenMode ? 'h-screen border-none' : 'h-64 border-y border-zinc-800'}`}>
         <span className="text-zinc-600 font-medium">No text to display</span>
      </div>
    );
  }

  const { prefix, focal, suffix } = splitWord(currentWord);

  return (
    <div className={`w-full flex flex-col items-center justify-center bg-black relative overflow-hidden transition-all duration-700 ${zenMode ? 'h-screen border-none' : 'h-64 border-y border-zinc-800'}`}>
      {/* Guideline Markers */}
      <div className={`absolute left-1/2 -translate-x-1/2 w-px bg-zinc-700 transition-all duration-700 ${zenMode ? 'top-1/4 h-12 opacity-30' : 'top-1/2 -translate-y-[4.5rem] h-6'}`}></div>
      <div className={`absolute left-1/2 -translate-x-1/2 w-px bg-zinc-700 transition-all duration-700 ${zenMode ? 'bottom-1/4 h-12 opacity-30' : 'bottom-1/2 translate-y-[4.5rem] h-6'}`}></div>
      
      {/* Horizontal Guideline - Subtle */}
      {!zenMode && <div className="absolute top-1/2 w-full h-px bg-zinc-900 -translate-y-1/2"></div>}

      {/* Word Container */}
      <div className={`relative flex items-center mono font-bold tracking-tight transition-all duration-700 ${zenMode ? 'text-6xl md:text-9xl' : 'text-5xl md:text-7xl'}`}>
        {/* We use a fixed width container for the focal character to keep it centered */}
        <div className="flex w-full justify-center">
            <div className="text-right flex-1 text-white opacity-90 pr-0">
                {prefix}
            </div>
            <div className="text-red-600 mx-0.5 shadow-red-900/20 drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                {focal}
            </div>
            <div className="text-left flex-1 text-white opacity-90 pl-0">
                {suffix}
            </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className={`absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-100 ease-linear ${zenMode ? 'opacity-20 h-0.5' : 'opacity-100'}`} 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default RSVPPlayer;
