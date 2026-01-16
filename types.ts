export interface WordData {
  text: string;
  focalIndex: number;
  pauseMultiplier?: number;
}

export type AppFont = 'mono' | 'sans' | 'serif';
export type AppFontWeight = 'normal' | 'bold';

export interface ReaderSettings {
  wpm: number;
  initialWpm: number;
  targetWpm: number;
  enableGradualIncrease: boolean;
  wpmJumpStep: number;
  font: AppFont;
  fontWeight: AppFontWeight;
  sideOpacity: number;
  audioSrc: string;
}

export interface RSVPState extends ReaderSettings {
  isPlaying: boolean;
  currentWordIndex: number;
  text: string;
}
