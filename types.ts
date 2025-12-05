export enum ModelType {
  SYLLABIC = 'silabico',
  FLUENCY = 'fluidez'
}

export interface SyllableWord {
  full: string;
  parts: string[]; // e.g., ["ma", "má"]
}

export interface LessonItem {
  id: string;
  text: string;
  image?: string; // URL
  type: 'vowel' | 'word' | 'sentence';
  syllables?: string[]; // For Model 1
  words?: string[]; // For Model 2 breakdown
}

export interface Level {
  id: string;
  title: string;
  description: string;
  color: string;
  items: LessonItem[];
}

export interface AIResponse {
  feedback: string;
  stars: number;
}