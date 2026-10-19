export type Language = 'EN' | 'ID';
export type Mode = 'Explorer' | 'Creator' | 'Guest' | 'ViewOnly';
export type LearningStyle = 'Visual' | 'Auditory' | 'Kinesthetic';
export type AgeGroup = 'under7' | 'kid' | 'teen' | 'adult';
export type Page =
  | 'home'
  | 'legends'
  | 'gallery'
  | 'language'
  | 'community'
  | 'dance'
  | 'outfit'
  | 'takeitirl'
  | 'clubs'
  | 'why'
  | 'impact'
  | 'moderator';

export type TextSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface AccessibilitySettings {
  textSize: TextSize;
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexiaFont: boolean;
}

export interface UserProfile {
  nickname: string;
  avatarSeed: string;
  avatarPattern: string;
  avatarColor: string;
  points: number;
  streak: number;
  badges: string[];
  favoriteClub: string | null;
}

export interface AppState {
  ageGroup: AgeGroup | null;
  mode: Mode;
  learningStyle: LearningStyle;
  language: Language;
  accessibility: AccessibilitySettings;
  profile: UserProfile;
  impactCounts: {
    familyConversations: number;
    legendsExplored: number;
    danceStepsPracticed: number;
  };
}

/** Keys stored in the user_progress table (flexible JSONB columns). */
export interface UserProgressData {
  completedLegends: string[];
  quizScores: Record<string, number>;
  completedIrl: string[];
  languageProgress: Record<string, boolean>;
  danceProgress: Record<string, { completed: boolean; lastStep: number }>;
}
