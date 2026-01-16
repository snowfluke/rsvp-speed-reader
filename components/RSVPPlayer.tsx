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
      {/* Vertical Guideline Markers - Perfectly centered */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-px bg-zinc-700 transition-all duration-700 z-10 ${
          zenMode
            ? "top-1/4 h-16 opacity-30"
            : "top-1/2 -translate-y-[5rem] h-8"
        }`}
      ></div>
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-px bg-zinc-700 transition-all duration-700 z-10 ${
          zenMode
            ? "bottom-1/4 h-16 opacity-30"
            : "bottom-1/2 translate-y-[5rem] h-8"
        }`}
      ></div>

      {/* Horizontal Guideline - Subtle */}
      {!zenMode && (
        <div className="absolute top-1/2 w-full h-px bg-zinc-900 -translate-y-1/2"></div>
      )}

      {/* Word Container */}
      <div
        className={`relative flex items-center mono font-bold tracking-tight transition-all duration-700 w-full ${
          zenMode ? "text-7xl md:text-9xl" : "text-5xl md:text-7xl"
        }`}
      >
        <div className="flex w-full">
          {/* Prefix: Right-aligned, takes up left half of the space */}
          <div className="flex-1 text-right text-white opacity-80">
            {prefix}
          </div>

          {/* Focal Character: Fixed width to ensure it never moves */}
          <div className="w-[1ch] flex justify-center text-red-600 shadow-red-900/20 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)] z-20">
            {focal}
          </div>

          {/* Suffix: Left-aligned, takes up right half of the space */}
          <div className="flex-1 text-left text-white opacity-80">{suffix}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className={`absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-100 ease-linear ${
          zenMode ? "opacity-20 h-0.5" : "opacity-100"
        }`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default RSVPPlayer;
