export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface UserProfile {
  name: string;
  currentLevel: DifficultyLevel;
  xp: number;
  streak: number;
  readingHistory: ReadingLog[];
}

export interface ReadingLog {
  date: string;
  wpm: number; // Words per minute
  accuracy: number; // Percentage
  level: DifficultyLevel;
}

export interface ReadingMaterial {
  id: string;
  title: string;
  content: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
  theme: string;
}

export interface GameState {
  isPlaying: boolean;
  score: number;
  timeLeft: number;
}

export enum AppState {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  READING = 'READING',
  BREAK_TIME = 'BREAK_TIME',
  STATS = 'STATS'
}
