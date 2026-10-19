import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { Page, Mode, LearningStyle, Language } from '@/types';
import {
  ScrollText, Frame, MessageCircle, Users, PersonStanding,
  Shirt, Home, Lightbulb, BarChart3, Gift, Compass, Paintbrush,
  Eye, Ear, Hand, Globe, Accessibility, Menu, X,
  Sparkles, Flag,
} from 'lucide-react';
import { ProfileModal } from '@/components/ProfileModal';
import { AccessibilityModal } from '@/components/AccessibilityModal';

interface NavItem {
  page: Page;
  label: string;
  icon: typeof ScrollText;
  emoji: string;
}

const mainNavItems: NavItem[] = [
  { page: 'legends', label: 'Legends', icon: ScrollText, emoji: '📜' },
  { page: 'gallery', label: 'Gallery', icon: Frame, emoji: '🖼️' },
  { page: 'language', label: 'Language', icon: MessageCircle, emoji: '💬' },
  { page: 'community', label: 'Community', icon: Users, emoji: '👥' },
];

const shortcutItems: NavItem[] = [
  { page: 'dance', label: 'Dance Studio', icon: PersonStanding, emoji: '💃' },
  { page: 'outfit', label: 'Outfit Studio', icon: Shirt, emoji: '👕' },
  { page: 'takeitirl', label: 'Take It IRL', icon: Home, emoji: '🏠' },
  { page: 'clubs', label: 'Culture Clubs', icon: Flag, emoji: '🏴' },
  { page: 'why', label: 'Why CulturInd.ai', icon: Lightbulb, emoji: '💡' },
  { page: 'impact', label: 'Impact', icon: BarChart3, emoji: '📊' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const {
    currentPage, setPage, mode, setMode, learningStyle, setLearningStyle,
    language, setLanguage, ageGroup, profile, isCreator,
  } = useApp();

  const [profileOpen, setProfileOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [surpriseTrigger, setSurpriseTrigger] = useState(0);

  const handleSurprise = () => {
    const allPages: Page[] = ['legends', 'gallery', 'language', 'dance', 'outfit', 'takeitirl'];
    const randomPage = allPages[Math.floor(Math.random() * allPages.length)];
    setSurpriseTrigger((p) => p + 1);
    setPage(randomPage);
    // Pass trigger via a custom event so pages can react
    window.dispatchEvent(new CustomEvent('surprise-me', { detail: { trigger: surpriseTrigger + 1 } }));
  };

  const handleModeToggle = (newMode: Mode) => {
    if (newMode === 'Creator' && (ageGroup === 'kid' || ageGroup === 'under7')) {
      // Locked for under 13
      return;
    }
    setMode(newMode);
  };

  const cycleLearningStyle = () => {
    const styles: LearningStyle[] = ['Visual', 'Auditory', 'Kinesthetic'];
    const idx = styles.indexOf(learningStyle);
    setLearningStyle(styles[(idx + 1) % styles.length]);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'ID' : 'EN');
  };

  const LearningIcon = learningStyle === 'Visual' ? Eye : learningStyle === 'Auditory' ? Ear : Hand;

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-ink-900/95 backdrop-blur-md border-b border-batik-400/20">
        {/* Top row: logo + controls */}
        <div className="flex items-center justify-between px-4 py-2.5 gap-2">
          {/* Logo */}
          <button
            onClick={() => setPage('home')}
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="CulturInd.ai home"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-batik-400 to-batik-600 flex items-center justify-center text-lg font-display font-black text-white">
              C
            </div>
            <span className="text-lg font-display font-bold text-white hidden sm:block">
              Cultur<span className="shimmer-text">Ind</span>.ai
            </span>
          </button>

          {/* Header controls */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Surprise Me */}
            <button
              onClick={handleSurprise}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neon-pink/20 text-neon-pink border border-neon-pink/40 hover:bg-neon-pink/30 transition-colors text-sm font-medium"
              aria-label="Surprise Me — show me something random"
            >
              <Gift size={16} />
              <span className="hidden md:inline">Surprise Me</span>
            </button>

            {/* Mode toggle */}
            <div className="flex items-center rounded-lg border border-ink-600 overflow-hidden">
              <button
                onClick={() => handleModeToggle('Explorer')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium transition-colors ${
                  mode === 'Explorer' ? 'bg-neon-blue/30 text-neon-blue' : 'text-ink-400 hover:text-white'
                }`}
                aria-label="Explorer mode"
              >
                <Compass size={16} />
                <span className="hidden lg:inline">Explorer</span>
              </button>
              <button
                onClick={() => handleModeToggle('Creator')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium transition-colors relative ${
                  mode === 'Creator' ? 'bg-neon-pink/30 text-neon-pink' : 'text-ink-400 hover:text-white'
                } ${ageGroup === 'kid' || ageGroup === 'under7' ? 'opacity-60' : ''}`}
                aria-label={ageGroup === 'kid' || ageGroup === 'under7' ? 'Creator mode — unlocks at 13' : 'Creator mode'}
                title={ageGroup === 'kid' || ageGroup === 'under7' ? 'Creator unlocks at 13, keep exploring!' : 'Creator mode'}
              >
                <Paintbrush size={16} />
                <span className="hidden lg:inline">Creator</span>
                {(ageGroup === 'kid' || ageGroup === 'under7') && (
                  <span className="absolute -top-1 -right-1 text-[8px]">🔒</span>
                )}
              </button>
            </div>

            {/* Learning style toggle */}
            <button
              onClick={cycleLearningStyle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-ink-700 border border-ink-600 hover:border-neon-green/50 transition-colors text-sm font-medium"
              aria-label={`Learning style: ${learningStyle}`}
              title={`Learning style: ${learningStyle} (click to change)`}
            >
              <LearningIcon size={16} className="text-neon-green" />
              <span className="hidden lg:inline">{learningStyle}</span>
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-ink-700 border border-ink-600 hover:border-neon-blue/50 transition-colors text-sm font-medium"
              aria-label={`Language: ${language}`}
              title={`Language: ${language === 'EN' ? 'English' : 'Bahasa Indonesia'}`}
            >
              <Globe size={16} className="text-neon-blue" />
              <span>{language}</span>
            </button>

            {/* Accessibility menu */}
            <button
              onClick={() => setAccessOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-ink-700 border border-ink-600 hover:border-neon-yellow/50 transition-colors text-sm font-medium"
              aria-label="Accessibility settings"
              title="Accessibility settings"
            >
              <Accessibility size={16} className="text-neon-yellow" />
            </button>

            {/* Profile */}
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-ink-700 border border-ink-600 hover:border-batik-400/50 transition-colors text-sm font-medium"
              aria-label="Profile and badges"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: profile.avatarColor }}
              >
                {profile.nickname.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline">{profile.nickname}</span>
              <span className="hidden md:inline text-neon-yellow text-xs">⭐ {profile.points}</span>
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-ink-700 border border-ink-600 text-white"
              aria-label="More menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Main category bar (desktop) */}
        <nav className="hidden lg:flex items-center gap-1 px-4 pb-2 border-t border-ink-700/50 pt-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-batik-400/20 text-batik-300 border border-batik-400/40'
                    : 'text-ink-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Shortcut bar (desktop) */}
        <nav className="hidden lg:flex items-center gap-1 px-4 pb-2">
          {shortcutItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                    : 'text-ink-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-ink-700 px-4 py-3 space-y-2 bg-ink-900/95 backdrop-blur-md">
            <p className="text-xs text-ink-500 font-bold uppercase tracking-wider">Main</p>
            <div className="grid grid-cols-2 gap-2">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.page}
                    onClick={() => { setPage(item.page); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-800 text-ink-200 text-sm"
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-ink-500 font-bold uppercase tracking-wider pt-2">Shortcuts</p>
            <div className="grid grid-cols-2 gap-2">
              {shortcutItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.page}
                    onClick={() => { setPage(item.page); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-800 text-ink-200 text-sm"
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="pb-24 lg:pb-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-ink-700 bg-ink-900 batik-bg-light px-4 py-8 hidden lg:block">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="col-span-2">
            <h3 className="text-lg font-display font-bold text-white mb-2">
              Cultur<span className="shimmer-text">Ind</span>.ai
            </h3>
            <p className="text-ink-400 text-sm">
              Helping Indonesian youth reconnect with their culture — the cool way.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-batik-400 mb-2">Community</h4>
            <ul className="space-y-1 text-sm text-ink-400">
              <li><button onClick={() => setPage('community')} className="hover:text-white">Community Guidelines</button></li>
              <li><button className="hover:text-white">Privacy Note</button></li>
              <li><button className="hover:text-white">Report a Problem</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-batik-400 mb-2">About</h4>
            <ul className="space-y-1 text-sm text-ink-400">
              <li><button onClick={() => setPage('why')} className="hover:text-white">About CulturInd.ai</button></li>
              <li><button className="hover:text-white">For Grown-ups & Teachers</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-batik-400 mb-2">Explore</h4>
            <ul className="space-y-1 text-sm text-ink-400">
              <li><button onClick={() => setPage('legends')} className="hover:text-white">Legends</button></li>
              <li><button onClick={() => setPage('gallery')} className="hover:text-white">Gallery</button></li>
              <li><button onClick={() => setPage('impact')} className="hover:text-white">Impact</button></li>
            </ul>
          </div>
        </div>
        <p className="text-center text-ink-500 text-xs mt-6">
          CulturInd.ai — Celebrate Indonesian culture, alongside the world. © 2026
        </p>
      </footer>

      {/* Bottom tab bar (mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-ink-900/95 backdrop-blur-md border-t border-batik-400/20">
        <div className="flex items-center justify-around px-2 py-1.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                  active ? 'text-batik-400' : 'text-ink-400'
                }`}
                aria-label={item.label}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
          {/* More button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-ink-400"
            aria-label="More features"
          >
            <Menu size={20} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <AccessibilityModal open={accessOpen} onClose={() => setAccessOpen(false)} />
    </div>
  );
}
