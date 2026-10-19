import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui';
import type { AgeGroup, Mode } from '@/types';
import { Cake, AlertCircle, ShieldCheck } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_IN_MONTH = (month: number, year: number) => {
  // month is 0-indexed
  return new Date(year, month + 1, 0).getDate();
};

function calculateAge(day: number, month: number, year: number): number {
  const today = new Date();
  const birth = new Date(year, month, day);
  let age = today.getFullYear() - birth.getFullYear();
  const mDiff = today.getMonth() - birth.getMonth();
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getAgeGroup(age: number): AgeGroup {
  if (age < 7) return 'under7';
  if (age <= 12) return 'kid';
  if (age <= 17) return 'teen';
  return 'adult';
}

function getDefaultMode(group: AgeGroup): Mode {
  if (group === 'under7') return 'ViewOnly';
  if (group === 'kid') return 'Explorer';
  if (group === 'teen') return 'Explorer'; // They can choose, but default to Explorer
  return 'Guest';
}

export function AgeCheck() {
  const { setAgeGroup, setMode, setProfile } = useApp();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ group: AgeGroup; mode: Mode; age: number } | null>(null);
  const [showChoice, setShowChoice] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleSubmit = () => {
    setError('');

    if (!day || !month || !year) {
      setError('Please pick your day, month, and year.');
      return;
    }

    const d = parseInt(day);
    const m = parseInt(month); // 0-indexed
    const y = parseInt(year);

    const maxDay = DAYS_IN_MONTH(m, y);
    if (d > maxDay) {
      setError(`That date doesn\'t exist — ${MONTHS[m]} has only ${maxDay} days.`);
      return;
    }

    const today = new Date();
    const birth = new Date(y, m, d);
    if (birth > today) {
      setError('You can\'t be born in the future! Try again.');
      return;
    }

    const age = calculateAge(d, m, y);
    const group = getAgeGroup(age);
    const mode = getDefaultMode(group);

    // Anti-bypass: store that we've checked, discard exact birthdate
    setResult({ group, mode, age });
    setShowChoice(true);
  };

  const handleConfirm = () => {
    if (!result) return;
    // Discard exact birthdate, store only age group and mode
    setAgeGroup(result.group);
    setMode(result.mode);
    setProfile({ nickname: result.group === 'teen' ? 'Creator' : 'Explorer' });
  };

  const handleChooseCreator = () => {
    if (!result) return;
    setAgeGroup(result.group);
    setMode('Creator');
    setProfile({ nickname: 'Creator' });
  };

  const handleChooseExplorer = () => {
    if (!result) return;
    setAgeGroup(result.group);
    setMode('Explorer');
    setProfile({ nickname: 'Explorer' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900 batik-bg p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-black text-white">
            Cultur<span className="shimmer-text">Ind</span>.ai
          </h1>
          <p className="text-ink-400 mt-2">Discover Indonesian culture, the cool way</p>
        </div>

        {!showChoice ? (
          <div className="card-base batik-bg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-batik-400/20 flex items-center justify-center">
                <Cake className="text-batik-400" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-white">When's your birthday?</h2>
              </div>
            </div>

            <p className="text-ink-300 text-sm mb-6 flex items-start gap-2">
              <ShieldCheck className="text-neon-green flex-shrink-0 mt-0.5" size={18} />
              We ask your birthday so we can show you the right content and keep you safe.
            </p>

            {/* Date selectors */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-xs text-ink-400 mb-1 block">Day</label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-white focus:border-neon-blue outline-none"
                >
                  <option value="">DD</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-ink-400 mb-1 block">Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-white focus:border-neon-blue outline-none"
                >
                  <option value="">MM</option>
                  {MONTHS.map((mo, i) => (
                    <option key={i} value={i}>{mo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-ink-400 mb-1 block">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-white focus:border-neon-blue outline-none"
                >
                  <option value="">YYYY</option>
                  {years.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg p-3">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button onClick={handleSubmit} size="lg" className="w-full">
              Let's go!
            </Button>
          </div>
        ) : (
          <div className="card-base batik-bg p-8">
            {result!.group === 'under7' && (
              <div className="text-center">
                <div className="text-5xl mb-4 animate-float">🌟</div>
                <h2 className="text-xl font-display font-bold text-white mb-3">
                  Ask a grown-up to help you!
                </h2>
                <p className="text-ink-300 mb-6">
                  You can explore and look at everything, but a grown-up should be with you.
                  You\'ll be an Explorer in view-only mode — lots to see!
                </p>
                <Button onClick={handleConfirm} size="lg" className="w-full">
                  Start exploring!
                </Button>
              </div>
            )}

            {result!.group === 'kid' && (
              <div className="text-center">
                <div className="text-5xl mb-4 animate-float">🎨</div>
                <h2 className="text-xl font-display font-bold text-white mb-3">
                  Welcome, Explorer!
                </h2>
                <p className="text-ink-300 mb-6">
                  You\'re in Explorer mode — fun quizzes, stories, and dance guides
                  made just for you!
                </p>
                <Button onClick={handleConfirm} size="lg" className="w-full">
                  Let\'s explore!
                </Button>
              </div>
            )}

            {result!.group === 'teen' && (
              <div className="text-center">
                <div className="text-5xl mb-4 animate-float">🔥</div>
                <h2 className="text-xl font-display font-bold text-white mb-3">
                  Choose your mode
                </h2>
                <p className="text-ink-300 mb-6">
                  You can switch anytime. Explorer is simple and safe. Creator is a
                  social space where you can post, design, and remix.
                </p>
                <div className="space-y-3">
                  <Button onClick={handleChooseExplorer} variant="neon-blue" size="lg" className="w-full">
                    🧭 Explorer Mode
                  </Button>
                  <Button onClick={handleChooseCreator} variant="neon-pink" size="lg" className="w-full">
                    🎨 Creator Mode
                  </Button>
                </div>
              </div>
            )}

            {result!.group === 'adult' && (
              <div className="text-center">
                <div className="text-5xl mb-4 animate-float">👋</div>
                <h2 className="text-xl font-display font-bold text-white mb-3">
                  Welcome, Guest!
                </h2>
                <p className="text-ink-300 mb-6">
                  You can browse everything and see Creator-level content, but you
                  can\'t post, comment, or join clubs. This keeps young users safe.
                </p>
                <Button onClick={handleConfirm} size="lg" className="w-full">
                  Start browsing!
                </Button>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-ink-500 text-xs mt-6">
          Your exact birthday is never stored — we only remember your age group.
          You only do this once, when you first join.
        </p>
      </div>
    </div>
  );
}
