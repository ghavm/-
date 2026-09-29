export type MissionLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type MoodType = 'heavy' | 'anxious' | 'tired' | 'neutral' | 'curious' | 'hopeful';

export type ViewMode = 'auto' | 'desktop' | 'mobile';

export interface Mission {
  id: string;
  level: MissionLevel;
  title: string;
  description: string;
  category: 'sunlight' | 'body' | 'room' | 'threshold' | 'neighborhood' | 'social';
  durationSeconds?: number;
  iconName: string;
  difficulty: '초초간단' | '초간단' | '가벼움' | '용기내기' | '도전하기' | '폭풍돌파';
  completed: boolean;
  completedAt?: string;
  rewardSunlight: number;
  actionGuide?: string[];
  isCustom?: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: MoodType;
  content: string;
  completedMissionTitles: string[];
  sunlightGained: number;
}

export interface UserProgress {
  currentLevel: MissionLevel;
  totalSunlight: number;
  gardenStage: number; // 0: 새싹, 1: 작은 줄기, 2: 잎사귀, 3: 꽃봉오리, 4: 활짝 핀 해바라기/데이지
  completedMissionIds: string[];
  history: {
    date: string;
    count: number;
  }[];
}

export interface EmpathyChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    title: string;
    level: MissionLevel;
  };
}

export type QuoteCategory = 'room' | 'doorstep' | 'comfort' | 'challenge';

export interface Quote {
  id: string;
  category: QuoteCategory;
  text: string;
  author: string;
  source?: string;
  situation: string;
  tags: string[];
}

