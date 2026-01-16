
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, FastForward, Rewind, Info, HelpCircle, Maximize2, Minimize2, Keyboard, Type, Layout, Music } from 'lucide-react';
import RSVPPlayer from './components/RSVPPlayer';
import BackgroundMusic from './components/BackgroundMusic';
import VideoExportButton from './components/VideoExportButton';
import { processText } from './utils/textProcessor';
import { WordData, AppFont, AppFontWeight } from './types';

const App: React.FC = () => {
  const [text, setText] = useState<string>("Speed reading is a skill that can be developed with practice. Rapid Serial Visual Presentation, or RSVP, is one of the most effective methods to achieve higher reading speeds. By presenting words one by one at a fixed focal point, we eliminate the time lost in eye movements across a page. This app allows you to customize your experience by adjusting the Words Per Minute. Focus on the red character and let the information flow directly into your mind.");
  const [wpm, setWpm] = useState<number>(300);
  const [initialWpm, setInitialWpm] = useState<number>(300);
  const [targetWpm, setTargetWpm] = useState<number>(600);
  const [enableGradualIncrease, setEnableGradualIncrease] = useState<boolean>(false);
  const [wpmJumpStep, setWpmJumpStep] = useState<number>(50);
  const [font, setFont] = useState<AppFont>('mono');
  const [fontWeight, setFontWeight] = useState<AppFontWeight>('bold');
  const [sideOpacity, setSideOpacity] = useState<number>(0.8);
  const [audioSrc, setAudioSrc] = useState<string>("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [showZenHint, setShowZenHint] = useState<boolean>(false);

  const words = useMemo(() => processText(text), [text]);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => {
        if (!prev && currentIndex >= words.length - 1) {
            setCurrentIndex(0);
        }
        return !prev;
    });
  }, [currentIndex, words.length]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  const enterZenMode = () => {
    setIsZenMode(true);
    setShowZenHint(true);
    setTimeout(() => setShowZenHint(false), 3000);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger play/pause if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'Escape') {
        setIsZenMode(false);
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  useEffect(() => {
    if (isPlaying && words.length > 0 && currentIndex < words.length) {
      let currentWpm = wpm;
      
      if (enableGradualIncrease) {
        const progressRatio = currentIndex / (words.length - 1 || 1);
        currentWpm = initialWpm + (targetWpm - initialWpm) * progressRatio;
      }

      const word = words[currentIndex];
      const pauseMultiplier = word?.pauseMultiplier || 1;
      const interval = (60000 / currentWpm) * pauseMultiplier;
      
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

  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;

  const currentDisplayWpm = useMemo(() => {
    if (isPlaying && enableGradualIncrease && words.length > 0) {
      const progressRatio = currentIndex / (words.length - 1 || 1);
      return Math.round(initialWpm + (targetWpm - initialWpm) * progressRatio);
    }
    return wpm;
  }, [isPlaying, enableGradualIncrease, currentIndex, words.length, initialWpm, targetWpm, wpm]);

  return (
    <div className={`min-h-screen bg-black text-white flex flex-col font-sans transition-all duration-700 ${isZenMode ? 'cursor-none' : ''}`}>
      {/* Zen Hint Overlay */}
      <div className={`fixed inset-0 z-[200] flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${showZenHint ? 'opacity-100' : 'opacity-0'}`}>
         <div className="bg-zinc-900/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-zinc-800 flex flex-col items-center gap-2 shadow-2xl">
            <div className="flex gap-4 text-zinc-400">
               <div className="flex items-center gap-1"><span className="px-2 py-0.5 bg-zinc-800 rounded text-white text-xs font-bold">SPACE</span> <span className="text-xs">Play/Pause</span></div>
               <div className="flex items-center gap-1"><span className="px-2 py-0.5 bg-zinc-800 rounded text-white text-xs font-bold">ESC</span> <span className="text-xs">Exit Zen</span></div>
            </div>
            <p className="text-red-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Zen Mode Active</p>
         </div>
      </div>

      {/* Header - Hidden in Zen Mode */}
      <header className={`p-6 flex justify-between items-center border-b border-zinc-900 transition-all duration-500 ${isZenMode ? 'opacity-0 -translate-y-full pointer-events-none absolute w-full' : 'opacity-100 translate-y-0 relative'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(220,38,38,0.5)]">R</div>
          <h1 className="text-xl font-bold tracking-tight uppercase">Focus RSVP</h1>
        </div>
        <div className="flex items-center gap-4">
            <VideoExportButton 
                words={words} 
                wpm={wpm} 
                font={font} 
                fontWeight={fontWeight} 
                sideOpacity={sideOpacity} 
                enableGradualIncrease={enableGradualIncrease}
                initialWpm={initialWpm}
                targetWpm={targetWpm}
            />
            <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-zinc-900 rounded-full transition-colors flex items-center gap-2"
            >
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hidden sm:inline">Settings</span>
                <Settings size={20} className={showSettings ? "text-red-500 animate-spin-slow" : "text-zinc-400"} />
            </button>
        </div>
      </header>

      {/* Main Player Area */}
      <main className={`flex-1 flex flex-col justify-center items-center px-4 max-w-5xl mx-auto w-full transition-all duration-700 ${isZenMode ? 'gap-0 py-0' : 'gap-8 py-12'}`}>
        
        <RSVPPlayer 
          currentWord={words[currentIndex]} 
          progress={progress} 
          zenMode={isZenMode} 
          font={font}
          fontWeight={fontWeight}
          sideOpacity={sideOpacity}
        />

        {/* Playback Controls - Hidden in Zen Mode */}
        <div className={`flex flex-col items-center gap-6 w-full transition-all duration-500 ${isZenMode ? 'opacity-0 translate-y-12 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
            <div className="flex items-center gap-4 sm:gap-8">
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

                <button 
                    onClick={enterZenMode}
                    className="flex flex-col items-center gap-1 p-3 text-zinc-500 hover:text-red-500 transition-colors group"
                    title="Zen Mode (Press ESC to exit)"
                >
                    <Maximize2 size={24} />
                    <span className="text-[9px] font-black tracking-tighter uppercase group-hover:text-red-500">Zen</span>
                </button>
            </div>

            {/* WPM Slider */}
            <div className="w-full max-w-md flex flex-col gap-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Reading Speed</span>
                  <span className="text-xl font-bold mono text-red-500">{currentDisplayWpm} WPM</span>
                </div>
                <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    step={wpmJumpStep}
                    value={currentDisplayWpm} 
                    onChange={(e) => setWpm(parseInt(e.target.value))}
                    disabled={isPlaying && enableGradualIncrease}
                    className={`w-full accent-red-600 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer ${isPlaying && enableGradualIncrease ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
            </div>
        </div>

        {/* Settings & Help Section */}
        <div className={`w-full transition-all duration-300 overflow-hidden ${showSettings && !isZenMode ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Text Input */}
                <div className="lg:col-span-2 p-6 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Insert Text</h3>
                        </div>
                        <button 
                            onClick={() => { setText(""); reset(); }}
                            className="text-xs text-zinc-500 hover:text-red-500 transition-colors uppercase font-bold tracking-widest"
                        >
                            Clear
                        </button>
                    </div>
                    <textarea 
                        className="w-full h-48 bg-black border border-zinc-800 rounded-xl p-4 text-zinc-300 focus:outline-none focus:border-red-600 transition-colors resize-none mono text-sm leading-relaxed"
                        placeholder="Paste your text here..."
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            reset();
                        }}
                    />
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Info size={14} />
                        <span className="text-xs">{words.length} words detected. Total reading time: {Math.ceil(words.length / wpm)} min.</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-zinc-900">
                        {/* Font Selection */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Type size={16} />
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Typography</h3>
                            </div>
                            <div className="flex gap-2">
                                {(['mono', 'sans', 'serif'] as AppFont[]).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFont(f)}
                                        className={`flex-1 py-2 text-xs rounded-lg border transition-all uppercase font-bold tracking-widest ${
                                            font === f ? 'bg-red-600 border-red-500 text-white' : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Weight:</span>
                                <div className="flex gap-1 flex-1">
                                    {(['normal', 'bold'] as AppFontWeight[]).map(w => (
                                        <button
                                            key={w}
                                            onClick={() => setFontWeight(w)}
                                            className={`flex-1 py-1 text-[9px] rounded border transition-all uppercase font-bold tracking-widest ${
                                                fontWeight === w ? 'bg-zinc-200 border-white text-black' : 'bg-black border-zinc-900 text-zinc-600 hover:border-zinc-800'
                                            }`}
                                        >
                                            {w}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Opacity Control */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Layout size={16} />
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Side Opacity</h3>
                                </div>
                                <span className="text-xs font-mono text-zinc-500">{sideOpacity.toFixed(1)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0.1" 
                                max="1.0" 
                                step="0.1"
                                value={sideOpacity} 
                                onChange={(e) => setSideOpacity(parseFloat(e.target.value))}
                                className="w-full accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                <span>Ghost</span>
                                <span>Solid</span>
                            </div>
                        </div>

                        {/* Gradual Increase Control */}
                        <div className="lg:col-span-2 flex flex-col gap-4 mt-4 pt-4 border-t border-zinc-900">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <FastForward size={16} />
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Gradual Speed Control</h3>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={enableGradualIncrease}
                                        onChange={() => setEnableGradualIncrease(!enableGradualIncrease)}
                                    />
                                    <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                                    <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Enable</span>
                                </label>
                            </div>

                            {enableGradualIncrease && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Initial: {initialWpm} WPM</span>
                                        </div>
                                        <input 
                                            type="range" min="100" max="1000" step={wpmJumpStep}
                                            value={initialWpm} onChange={(e) => setInitialWpm(parseInt(e.target.value))}
                                            className="w-full accent-red-500/50 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Target: {targetWpm} WPM</span>
                                        </div>
                                        <input 
                                            type="range" min="100" max="1000" step={wpmJumpStep}
                                            value={targetWpm} onChange={(e) => setTargetWpm(parseInt(e.target.value))}
                                            className="w-full accent-red-600 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-2">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 whitespace-nowrap">WPM Jump Step:</span>
                                <div className="flex gap-1 flex-1">
                                    {[10, 25, 50, 100].map(step => (
                                        <button
                                            key={step}
                                            onClick={() => setWpmJumpStep(step)}
                                            className={`flex-1 py-1 text-[9px] rounded border transition-all uppercase font-bold tracking-widest ${
                                                wpmJumpStep === step ? 'bg-zinc-200 border-white text-black' : 'bg-black border-zinc-900 text-zinc-600 hover:border-zinc-800'
                                            }`}
                                        >
                                            {step}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Custom Audio */}
                    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-zinc-900">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Music size={16} />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Focus Audio</h3>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    placeholder="Paste mp3 URL here..."
                                    value={audioSrc}
                                    onChange={(e) => setAudioSrc(e.target.value)}
                                    className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 focus:outline-none focus:border-red-600"
                                />
                                <button 
                                    onClick={() => setAudioSrc("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3")}
                                    className="px-3 py-2 bg-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Or use local file:</span>
                                <input 
                                    type="file" 
                                    accept="audio/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = URL.createObjectURL(file);
                                            setAudioSrc(url);
                                        }
                                    }}
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 text-[9px] font-bold uppercase tracking-widest rounded transition-colors hover:bg-zinc-800 hover:text-white"
                                >
                                    Choose File
                                </button>
                                {audioSrc.startsWith('blob:') && (
                                    <span className="text-[9px] text-red-500 font-bold uppercase animate-pulse">Custom File Loaded</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions / How to Use */}
                <div className="p-6 bg-zinc-900/40 border border-zinc-900 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-zinc-200">
                        <HelpCircle size={18} className="text-red-500" />
                        <h3 className="text-sm font-bold uppercase tracking-wider">Controls</h3>
                    </div>
                    <ul className="space-y-4 text-xs text-zinc-400 leading-relaxed">
                        <li className="flex gap-3">
                            <span className="text-red-500 font-bold">Space</span>
                            <p>Play or Pause the reader.</p>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-red-500 font-bold">Esc</span>
                            <p>Exit Settings or <span className="text-white">Zen Mode</span>.</p>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-red-500 font-bold">Zen</span>
                            <p>Click the <b>Zen</b> button for zero distractions.</p>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-red-500 font-bold">Export</span>
                            <p>Generate a video with your current settings. <b>Optimized for speed!</b></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </main>

      {/* Exit Zen Mode Button - Only visible in Zen Mode on mouse move */}
      <div className={`fixed top-8 right-8 z-[100] transition-opacity duration-300 group ${isZenMode ? 'opacity-0 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={() => setIsZenMode(false)}
            className="flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-800 p-3 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-all shadow-xl"
          >
             <Minimize2 size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest pr-2">Exit Zen (ESC)</span>
          </button>
      </div>

      {/* Footer Info */}
      <footer className={`p-8 text-center text-zinc-600 mt-auto transition-opacity duration-500 ${isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <p className="text-xs uppercase tracking-[0.2em] font-medium opacity-50">Focus is the key to faster comprehension</p>
      </footer>

      <BackgroundMusic isPlaying={isPlaying} isZenMode={isZenMode} src={audioSrc} />
    </div>
  );
};

export default App;
