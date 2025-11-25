export interface AIContentResponse {
  story: string;
  funFact: string;
  actionPrompt: string; // e.g., "Clap your hands 3 times!"
}

export interface NumberData {
  id: number;
  value: number;
  color: string;
  twColor: string; // Tailwind class partial
  shapeMetaphor: string; // e.g., "Like a duck"
  staticRhyme: string;
  icon: string; // Emoji or simple icon name
  // Pre-defined content for offline/no-key mode
  defaultContent: AIContentResponse;
}

export type ViewState = 'GALLERY' | 'DETAIL' | 'GAME';

export interface GameQuestion {
  targetNumber: number;
  options: number[];
  items: string[]; // Emoji items to count
}