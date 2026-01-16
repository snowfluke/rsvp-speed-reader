import React, { useState } from 'react';
import { Download, Loader2, Video } from 'lucide-react';
import { WordData, AppFont, AppFontWeight } from '../types';
import { splitWord } from '../utils/textProcessor';

interface VideoExportButtonProps {
  words: WordData[];
  wpm: number;
  font: AppFont;
  fontWeight: AppFontWeight;
  sideOpacity: number;
}

const VideoExportButton: React.FC<VideoExportButtonProps> = ({ words, wpm, font, fontWeight, sideOpacity }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportVideo = async () => {
    if (words.length === 0) return;
    setIsExporting(true);
    setProgress(0);

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Use a higher frame rate for recording to capture more frames per word
    const stream = canvas.captureStream(60); 
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000 
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    
    // Filename with datetime
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '-');
    const filename = `focus-rsvp-${wpm}wpm-${dateStr}-${timeStr}.webm`;

    const exportPromise = new Promise<void>((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      };
    });

    recorder.start();

    const interval = 60000 / wpm;
    const framesPerWord = Math.max(1, Math.round((interval / 1000) * 60));
    const totalFrames = words.length * framesPerWord;
    const frameInterval = 1000 / 60; // 60fps

    let currentFrame = 0;
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        
        for (let frame = 0; frame < framesPerWord; frame++) {
            // Clear canvas
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const { prefix, focal, suffix } = splitWord(word);
            const weightPrefix = fontWeight === 'bold' ? 'bold ' : '';
            const fontStr = font === 'mono' 
                ? `${weightPrefix}120px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace`
                : font === 'serif' 
                ? `${weightPrefix}120px Georgia, Cambria, "Times New Roman", Times, serif`
                : `${weightPrefix}120px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

            ctx.font = fontStr;
            ctx.textBaseline = 'middle';
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const focalWidth = ctx.measureText(focal).width;

            // Draw Focal Character
            ctx.fillStyle = '#ef4444'; // red-500
            ctx.textAlign = 'center';
            ctx.fillText(focal, centerX, centerY);

            // Draw Prefix
            ctx.fillStyle = `rgba(255, 255, 255, ${sideOpacity})`;
            ctx.textAlign = 'right';
            ctx.fillText(prefix, centerX - (focalWidth / 2) - 4, centerY);

            // Draw Suffix
            ctx.fillStyle = `rgba(255, 255, 255, ${sideOpacity})`;
            ctx.textAlign = 'left';
            ctx.fillText(suffix, centerX + (focalWidth / 2) + 4, centerY);

            // Draw Progress Bar
            const prog = (i + 1) / words.length;
            const barWidth = canvas.width - 200;
            const barX = 100;
            const barY = canvas.height - 40;

            ctx.fillStyle = '#27272a'; // zinc-800
            ctx.fillRect(barX, barY, barWidth, 4);
            
            ctx.fillStyle = '#ef4444'; // red-500
            ctx.fillRect(barX, barY, barWidth * prog, 4);

            currentFrame++;
            
            // Sync with real-time recorder
            await new Promise(resolve => setTimeout(resolve, frameInterval));
        }
        
        // Update export progress UI
        setProgress(Math.round(((i + 1) / words.length) * 100));
    }

    // Give recorder a moment to finish last frames
    await new Promise(resolve => setTimeout(resolve, 500));
    recorder.stop();
    await exportPromise;
    setIsExporting(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportVideo}
        disabled={isExporting || words.length === 0}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
          isExporting 
            ? 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed' 
            : 'bg-zinc-950 border-zinc-900 hover:border-red-600 text-zinc-300 hover:text-white'
        }`}
      >
        {isExporting ? (
          <>
            <Loader2 size={18} className="animate-spin text-red-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Generating {progress}%</span>
          </>
        ) : (
          <>
            <Video size={18} className="text-zinc-400 group-hover:text-red-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Export Video</span>
          </>
        )}
      </button>
    </div>
  );
};

export default VideoExportButton;
