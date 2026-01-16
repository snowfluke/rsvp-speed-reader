
import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
  isPlaying: boolean;
  isZenMode?: boolean;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ isPlaying, isZenMode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ${isZenMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
      <audio
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder for focus music
      />
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="p-3 bg-zinc-900/50 hover:bg-zinc-800 text-white rounded-full transition-colors border border-zinc-800/50 backdrop-blur-sm"
        title={isMuted ? "Unmute Focus Music" : "Mute Focus Music"}
      >
        {isMuted ? <VolumeX size={20} className="text-zinc-500" /> : <Volume2 size={20} className="text-red-500" />}
      </button>
    </div>
  );
};

export default BackgroundMusic;
