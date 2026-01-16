import React from "react";
import { WordData } from "../types";
import { splitWord } from "../utils/textProcessor";

interface RSVPPlayerProps {
  currentWord: WordData | undefined;
  progress: number;
  zenMode?: boolean;
}

const RSVPPlayer: React.FC<RSVPPlayerProps> = ({
  currentWord,
  progress,
  zenMode,
}) => {
  if (!currentWord) {
    return (
      <div
        className={`w-full flex items-center justify-center bg-black relative overflow-hidden transition-all duration-700 ${
          zenMode ? "h-screen border-none" : "h-64 border-y border-zinc-800"
        }`}
      >
        <span className="text-zinc-600 font-medium">No text to display</span>
      </div>
    );
  }

  const { prefix, focal, suffix } = splitWord(currentWord);

  return (
    <div
      className={`w-full flex flex-col items-center justify-center bg-black relative overflow-hidden transition-all duration-700 ${
        zenMode ? "h-screen border-none" : "h-64 border-y border-zinc-800"
      }`}
    >
      {/* Vertical Guideline Markers - Perfectly centered and higher z-index */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-px bg-zinc-700 transition-all duration-700 z-30 ${
          zenMode
            ? "top-1/4 h-16 opacity-30"
            : "top-1/2 -translate-y-[5rem] h-8"
        }`}
      ></div>
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-px bg-zinc-700 transition-all duration-700 z-30 ${
          zenMode
            ? "bottom-1/4 h-16 opacity-30"
            : "bottom-1/2 translate-y-[5rem] h-8"
        }`}
      ></div>

      {/* Horizontal Guideline - Subtle */}
      {!zenMode && (
        <div className="absolute top-1/2 w-full h-px bg-zinc-900 -translate-y-1/2 z-0"></div>
      )}

      {/* Word Container */}
      <div
        className={`relative flex items-center mono font-bold tracking-tight transition-all duration-700 w-full z-10 ${
          zenMode ? "text-6xl md:text-9xl" : "text-4xl md:text-7xl"
        }`}
      >
        <div className="flex w-full items-center justify-center relative">
          {/* Prefix: Takes exactly half of the container width minus half the focal width */}
          <div className="flex-1 text-right text-white opacity-80 whitespace-nowrap overflow-visible">
            {prefix}
          </div>

          {/* Focal Character: Fixed width '1ch' (one character width in mono) anchored to the exact center */}
          <div className="w-[1ch] shrink-0 text-center text-red-600 shadow-red-900/20 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)] z-20">
            {focal}
          </div>

          {/* Suffix: Takes exactly half of the container width minus half the focal width */}
          <div className="flex-1 text-left text-white opacity-80 whitespace-nowrap overflow-visible">
            {suffix}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className={`absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-100 ease-linear z-40 ${
          zenMode ? "opacity-20 h-0.5" : "opacity-100"
        }`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default RSVPPlayer;
