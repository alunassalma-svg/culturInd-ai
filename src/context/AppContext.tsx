import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import type { AppState, AgeGroup, Mode, LearningStyle, Language, TextSize, Page } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface AppContextValue extends AppState {
  setPage: (page: Page) => void;
  currentPage: Page;
  setAgeGroup: (group: AgeGroup) => void;
  setMode: (mode: Mode) => void;
  setLearningStyle: (style: LearningStyle) => void;
  setLanguage: (lang: Language) => void;
  setTextSize: (size: TextSize) => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  toggleDyslexiaFont: () => void;
  addPoints: (n: number) => void;
  addBadge: (badge: string) => void;
  setProfile: (profile: Partial<AppState['profile']>) => void;
  incrementImpact: (key: 'familyConversations' | 'legendsExplored' | 'danceStepsPracticed', n?: number) => void;
  canPost: boolean;
  canComment: boolean;
  canUseCamera: boolean;
  isCreator: boolean;
  /** True while we are loading saved progress from Supabase after login. */
  restoring: boolean;
}

const defaultState: AppState = {
  ageGroup: null,
  mode: 'Explorer',
  learningStyle: 'Visual',
  language: 'EN',
  accessibility: {
    textSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    dyslexiaFont: false,
  },
  profile: {
    nickname: 'Explorer',
    avatarSeed: 'default',
    avatarPattern: 'batik-parang',
    avatarColor: '#00D4FF',
    points: 0,
    streak: 1,
    badges: [],
    favoriteClub: null,
  },
  impactCounts: {
    familyConversations: 1247,
    legendsExplored: 3892,
    danceStepsPracticed: 8156,
  },
};

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = 'culturind-state';
const MIGRATED_KEY = 'culturind-migrated';

function loadLocalState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, loadState, saveState, hasStoredProgress } = useAuth();
  const [state, setState] = useState<AppState>(defaultState);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [restoring, setRestoring] = useState(false);
  const loadedRef = useRef(false);
  const userRef = useRef<string | null>(null);

  // 1. Load from localStorage on first mount (offline / pre-auth fallback).
  useEffect(() => {
    const saved = loadLocalState();
    if (saved) {
      setState((prev) => ({
        ...prev,
        ...saved,
        profile: { ...prev.profile, ...saved.profile },
        accessibility: { ...prev.accessibility, ...saved.accessibility },
        impactCounts: { ...prev.impactCounts, ...saved.impactCounts },
      }));
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState((prev) => ({
        ...prev,
        accessibility: { ...prev.accessibility, reduceMotion: true },
      }));
    }
    loadedRef.current = true;
  }, []);

  // 2. When a user logs in, load their saved state from Supabase.
  //    If they have no stored progress yet, migrate their localStorage data
  //    so they don't lose what they built before signing up.
  useEffect(() => {
    if (!user || user.id === userRef.current) return;
    userRef.current = user.id;
    setRestoring(true);

    (async () => {
      const stored = await hasStoredProgress(user);
      if (stored) {
        const remote = await loadState(user);
        if (remote) {
          setState((prev) => ({
            ...prev,
            ...remote,
            profile: { ...prev.profile, ...remote.profile },
            accessibility: { ...prev.accessibility, ...remote.accessibility },
            impactCounts: { ...prev.impactCounts, ...remote.impactCounts },
          }));
        }
      } else {
        // First login: migrate any localStorage progress to the account.
        const local = loadLocalState();
        if (local && !localStorage.getItem(MIGRATED_KEY + ':' + user.id)) {
          setState((prev) => ({
            ...prev,
            ...local,
            profile: { ...prev.profile, ...local.profile },
            accessibility: { ...prev.accessibility, ...local.accessibility },
            impactCounts: { ...prev.impactCounts, ...local.impactCounts },
          }));
          localStorage.setItem(MIGRATED_KEY + ':' + user.id, '1');
        }
      }
      setRestoring(false);
    })();
  }, [user, hasStoredProgress, loadState]);

  // 3. When a user logs out, reset to defaults.
  useEffect(() => {
    if (!user && userRef.current) {
      userRef.current = null;
      setState(defaultState);
      setCurrentPage('home');
    }
  }, [user]);

  // 4. Persist to localStorage always (offline cache) and to Supabase when
  //    authenticated. The Supabase save is debounced inside AuthContext.
  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
    if (user) {
      saveState(state);
    }
  }, [state, user, saveState]);

  // Apply accessibility classes to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-sm-base', 'text-md-base', 'text-lg-base', 'text-xl-base', 'hc-mode', 'reduce-motion', 'dyslexia-font');
    const sizeMap: Record<TextSize, string> = {
      small: 'text-sm-base',
      medium: 'text-md-base',
      large: 'text-lg-base',
      xlarge: 'text-xl-base',
    };
    root.classList.add(sizeMap[state.accessibility.textSize]);
    if (state.accessibility.highContrast) root.classList.add('hc-mode');
    if (state.accessibility.reduceMotion) root.classList.add('reduce-motion');
    if (state.accessibility.dyslexiaFont) root.classList.add('dyslexia-font');
  }, [state.accessibility]);

  const value: AppContextValue = {
    ...state,
    currentPage,
    restoring,
    setPage: (page) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: state.accessibility.reduceMotion ? 'auto' : 'smooth' });
    },
    setAgeGroup: (group) => setState((p) => ({ ...p, ageGroup: group })),
    setMode: (mode) => setState((p) => ({ ...p, mode })),
    setLearningStyle: (style) => setState((p) => ({ ...p, learningStyle: style })),
    setLanguage: (lang) => setState((p) => ({ ...p, language: lang })),
    setTextSize: (size) => setState((p) => ({ ...p, accessibility: { ...p.accessibility, textSize: size } })),
    toggleHighContrast: () => setState((p) => ({ ...p, accessibility: { ...p.accessibility, highContrast: !p.accessibility.highContrast } })),
    toggleReduceMotion: () => setState((p) => ({ ...p, accessibility: { ...p.accessibility, reduceMotion: !p.accessibility.reduceMotion } })),
    toggleDyslexiaFont: () => setState((p) => ({ ...p, accessibility: { ...p.accessibility, dyslexiaFont: !p.accessibility.dyslexiaFont } })),
    addPoints: (n) => setState((p) => ({ ...p, profile: { ...p.profile, points: p.profile.points + n } })),
    addBadge: (badge) => setState((p) => ({
      ...p,
      profile: {
        ...p.profile,
        badges: p.profile.badges.includes(badge) ? p.profile.badges : [...p.profile.badges, badge],
      },
    })),
    setProfile: (profile) => setState((p) => ({ ...p, profile: { ...p.profile, ...profile } })),
    incrementImpact: (key, n = 1) => setState((p) => ({
      ...p,
      impactCounts: { ...p.impactCounts, [key]: p.impactCounts[key] + n },
    })),
    canPost: state.mode === 'Creator',
    canComment: state.mode === 'Creator',
    canUseCamera: state.mode === 'Creator' || (state.mode === 'Explorer' && state.ageGroup === 'kid'),
    isCreator: state.mode === 'Creator',
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
