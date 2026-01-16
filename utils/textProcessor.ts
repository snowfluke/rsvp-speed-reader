import { WordData } from "../types";

/**
 * Calculates the Optimal Focal Point (OFP) index for a word.
 * This is usually roughly at the 1/3 to 1/4 mark of the word.
 */
export const calculateFocalIndex = (word: string): number => {
  const length = word.length;
  if (length <= 1) return 0;
  if (length <= 3) return 1;
  if (length <= 5) return 2;
  if (length <= 9) return 3;
  return 4;
};

export const processText = (text: string): WordData[] => {
  if (!text) return [];

  // Split by whitespace and filter out empty strings
  const words = text.trim().split(/\s+/);

  return words.map((word) => {
    let pauseMultiplier = 1;
    if (word.endsWith(".") || word.endsWith("!") || word.endsWith("?")) {
      pauseMultiplier = 2;
    } else if (word.endsWith(",") || word.endsWith(";") || word.endsWith(":")) {
      pauseMultiplier = 1.5;
    }

    return {
      text: word,
      focalIndex: calculateFocalIndex(word),
      pauseMultiplier,
    };
  });
};

/**
 * Formats a word into three parts: pre-focal, focal, and post-focal.
 */
export const splitWord = (word: WordData) => {
  const text = word.text;
  const idx = word.focalIndex;

  return {
    prefix: text.substring(0, idx),
    focal: text[idx] || "",
    suffix: text.substring(idx + 1),
  };
};
