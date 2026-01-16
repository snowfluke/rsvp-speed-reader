
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, FastForward, Rewind, Info } from 'lucide-react';
import RSVPPlayer from './components/RSVPPlayer';
import BackgroundMusic from './components/BackgroundMusic';
import { processText } from './utils/textProcessor';
import { WordData } from './types';

const App: React.FC = () => {
  const [text, setText] = useState<string>("Speed reading is a skill that can be developed with practice. Rapid Serial Visual Presentation, or RSVP, is one of the most effective methods to achieve higher reading speeds. By presenting words one by one at a fixed focal point, we eliminate the time lost in eye movements across a page. This app allows you to customize your experience by adjusting the Words Per Minute. Focus on the red character and let the information flow directly into your mind.");
  const [wpm, setWpm] = useState<number>(300);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const words = useMemo(() => processText(text), [text]);
  
  // Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to avoid namespace errors in browser environments
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (isPlaying && words.length > 0 && currentIndex < words.length) {
      const interval = 60000 / wpm;
      timerRef.current = setTimeout(() => {
        setCurrentIndex(prev => {
          if (prev + 1 >= words.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, interval);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, words, wpm]);

  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-black">R</div>
          <h1 className="text-xl font-bold tracking-tight uppercase">Focus RSVP</h1>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-zinc-900 rounded-full transition-colors"
            >
                <Settings size={20} className={showSettings ? "text-red-500" : "text-zinc-400"} />
            </button>
        </div>
      </header>

      {/* Main Player Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 max-w-4xl mx-auto w-full gap-8 py-12">
        
        <RSVPPlayer currentWord={words[currentIndex]} progress={progress} />

        {/* Playback Controls */}
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex items-center gap-8">
                <button 
                    onClick={reset}
                    className="p-3 text-zinc-500 hover:text-white transition-colors"
                    title="Reset"
                >
                    <RotateCcw size={24} />
                </button>
                
                <button 
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 10))}
                    className="p-3 text-zinc-500 hover:text-white transition-colors"
                    title="Back 10 words"
                >
                    <Rewind size={24} />
                </button>

                <button 
                    onClick={togglePlay}
                    className="w-20 h-20 flex items-center justify-center bg-white hover:bg-zinc-200 text-black rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-red-900/10"
                >
                    {isPlaying ? <Pause size={36} fill="black" /> : <Play size={36} fill="black" className="ml-1" />}
                </button>

                <button 
                    onClick={() => setCurrentIndex(Math.min(words.length - 1, currentIndex + 10))}
                    className="p-3 text-zinc-500 hover:text-white transition-colors"
                    title="Forward 10 words"
                >
                    <FastForward size={24} />
                </button>

                <div className="w-24 text-center">
                    <span className="text-3xl font-bold mono">{wpm}</span>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">WPM</p>
                </div>
            </div>

            {/* WPM Slider */}
            <div className="w-full max-w-md flex flex-col gap-2">
                <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    step="50"
                    value={wpm} 
                    onChange={(e) => setWpm(parseInt(e.target.value))}
                    className="w-full accent-red-600 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-600 font-bold tracking-tighter uppercase">
                    <span>100 WPM</span>
                    <span>1000 WPM</span>
                </div>
            </div>
        </div>

        {/* Text Input Section (Conditional) */}
        <div className={`w-full transition-all duration-300 overflow-hidden ${showSettings ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Insert Text</h3>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => {
                                setText("");
                                reset();
                            }}
                            className="text-xs text-zinc-500 hover:text-red-500"
                        >
                            Clear
                        </button>
                    </div>
                </div>
                <textarea 
                    className="w-full h-48 bg-black border border-zinc-800 rounded-xl p-4 text-zinc-300 focus:outline-none focus:border-red-600 transition-colors resize-none"
                    placeholder="Paste your text here..."
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        reset();
                    }}
                />
                <div className="flex items-center gap-2 text-zinc-500">
                    <Info size={14} />
                    <span className="text-xs">Words are split by whitespace. {words.length} words detected.</span>
                </div>
            </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-8 text-center text-zinc-600">
        <p className="text-xs uppercase tracking-[0.2em] font-medium">Focus is the key to faster comprehension</p>
      </footer>

      <BackgroundMusic isPlaying={isPlaying} />
    </div>
  );
};

export default App;
