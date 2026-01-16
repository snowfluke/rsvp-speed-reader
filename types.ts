
export interface WordData {
  text: string;
  focalIndex: number;
}

export interface RSVPState {
  isPlaying: boolean;
  currentWordIndex: number;
  wpm: number;
  text: string;
}
