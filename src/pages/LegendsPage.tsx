import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, AIBadge } from '@/components/ui';
import { content, t } from '@/data/content';
import { useTTS } from '@/hooks/useTTS';
import {
  ScrollText, Play, Volume2, BookOpen, GitBranch, MapPin,
  Lightbulb, AlertTriangle, ChevronLeft, ChevronRight, Home,
  RotateCcw, Star, CheckCircle,
} from 'lucide-react';

// Choose-your-own-path story data for Timun Mas
const pathStory = {
  EN: {
    start: 'You are Timun Mas. A giant has come to your door! What do you do?',
    choices: [
      { text: 'Run with the magical gifts', next: 1 },
      { text: 'Hide in the house', next: 2 },
    ],
    1: { text: 'You grab the cucumber seeds, needles, salt, and shrimp paste, then sprint into the forest. The giant is chasing you! What do you throw first?', choices: [
      { text: 'Throw the cucumber seeds', next: 3 },
      { text: 'Throw the salt', next: 4 },
    ]},
    2: { text: 'You hide, but the giant smashes the house! You barely escape. You should have run. Try again!', end: true },
    3: { text: 'The seeds grow into a thick forest! The giant struggles through. Next, you throw the needles — they become a bamboo thicket. The giant is stuck!', choices: [
      { text: 'Throw the salt now', next: 5 },
      { text: 'Throw the shrimp paste', next: 5 },
    ]},
    4: { text: 'The salt becomes a great ocean! But the giant swims across. You wasted your chance. Try again!', end: true },
    5: { text: 'The shrimp paste becomes boiling mud! The giant sinks and is defeated. You did it — Timun Mas is safe! 🎉', win: true, end: true },
  },
  ID: {
    start: 'Kamu adalah Timun Mas. Seorang raksasa datang ke pintu rumahmu! Apa yang kamu lakukan?',
    choices: [
      { text: 'Lari dengan hadiah ajaib', next: 1 },
      { text: 'Sembunyi di rumah', next: 2 },
    ],
    1: { text: 'Kamu mengambil biji mentimun, jarum, garam, dan terasi, lari ke hutan. Raksasa mengejar! Apa yang kamu lempar dulu?', choices: [
      { text: 'Lemparkan biji mentimun', next: 3 },
      { text: 'Lemparkan garam', next: 4 },
    ]},
    2: { text: 'Kamu bersembunyi, tetapi raksasa menghancurkan rumah! Kamu nyaris lolos. Kamu seharusnya lari. Coba lagi!', end: true },
    3: { text: 'Biji tumbuh menjadi hutan lebat! Raksasa kesulitan. Lalu kamu lempar jarum — menjadi rumpun bambu. Raksasa terjebak!', choices: [
      { text: 'Lemparkan garam sekarang', next: 5 },
      { text: 'Lemparkan terasi', next: 5 },
    ]},
    4: { text: 'Garam menjadi lautan! Tapi raksasa berenang melintas. Kamu menyia-nyiakan kesempatan. Coba lagi!', end: true },
    5: { text: 'Terasi menjadi lumpur mendidih! Raksasa tenggelam dan dikalahkan. Kamu berhasil — Timun Mas selamat! 🎉', win: true, end: true },
  },
};

export function LegendsPage() {
  const { language, learningStyle, isCreator, incrementImpact, addPoints, addBadge, profile } = useApp();
  const { speak, stop, speaking } = useTTS();
  const [selected, setSelected] = useState<typeof content.legends[0] | null>(null);
  const [showPath, setShowPath] = useState(false);
  const [pathNode, setPathNode] = useState<number | null>(null);
  const [explored, setExplored] = useState<Set<string>>(new Set());

  const handleExplore = (legend: typeof content.legends[0]) => {
    setSelected(legend);
    if (!explored.has(legend.id)) {
      setExplored((prev) => new Set([...prev, legend.id]));
      incrementImpact('legendsExplored');
      addPoints(10);
      if (explored.size === 0) addBadge('first-legend');
    }
  };

  const startPath = () => {
    setShowPath(true);
    setPathNode(null);
  };

  const pathData = pathStory[language];
  const currentNode = pathNode === null ? pathData.start : (pathData as any)[pathNode];

  const handlePathChoice = (next: number) => {
    setPathNode(next);
  };

  const resetPath = () => {
    setPathNode(null);
  };

  const handleListen = (text: string) => {
    if (speaking) {
      stop();
    } else {
      speak(text, language === 'EN' ? 'en-US' : 'id-ID');
    }
  };

  // Legend detail view
  if (selected) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <button
          onClick={() => { setSelected(null); setShowPath(false); setPathNode(null); }}
          className="flex items-center gap-2 text-ink-400 hover:text-white mb-6"
        >
          <ChevronLeft size={20} /> {language === 'EN' ? 'Back to legends' : 'Kembali ke legenda'}
        </button>

        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-float">{selected.emoji}</div>
          <h1 className="text-4xl font-display font-black text-white mb-2">{t(selected.title, language)}</h1>
          <div className="flex items-center justify-center gap-2 text-ink-400">
            <MapPin size={16} /> {t(selected.region, language)}
          </div>
        </div>

        {/* AI-generated video mock */}
        <Card className="mb-6">
          <div className="aspect-video bg-gradient-to-br from-batik-600/30 via-ink-800 to-neon-pink/20 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 batik-bg opacity-30" />
            <div className="text-6xl mb-3 animate-pulse-slow">{selected.emoji}</div>
            <Button variant="neon-blue" size="lg" onClick={() => {}}>
              <Play size={24} /> {language === 'EN' ? 'Play AI Video' : 'Putar Video AI'}
            </Button>
            <div className="absolute top-3 right-3">
              <AIBadge />
            </div>
            <p className="text-ink-400 text-xs mt-4 text-center max-w-md">
              {language === 'EN'
                ? 'AI-generated animated video placeholder. A real version would bring this legend to life with illustrated scenes.'
                : 'Placeholder video animasi AI. Versi nyata akan menghidupkan legenda ini dengan adegan ilustrasi.'}
            </p>
          </div>
        </Card>

        {/* Story text */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-batik-400" />
              {language === 'EN' ? 'The Story' : 'Kisah'}
            </h3>
            {learningStyle === 'Auditory' && (
              <Button size="sm" variant="neon-green" onClick={() => handleListen(t(selected.story, language))}>
                <Volume2 size={16} /> {speaking ? 'Stop' : 'Listen'}
              </Button>
            )}
          </div>
          <p className="text-ink-200 leading-relaxed">{t(selected.story, language)}</p>

          {/* Learning style: Visual shows captions, Auditory adds audio, Kinesthetic adds interactive */}
          {learningStyle === 'Visual' && (
            <p className="text-xs text-ink-500 mt-3 italic">
              {language === 'EN' ? 'Tap "Learn more" for deeper cultural context.' : 'Ketuk "Pelajari lebih lanjut" untuk konteks budaya lebih dalam.'}
            </p>
          )}
        </Card>

        {/* Moral */}
        <Card className="mb-6 border-l-4 border-l-neon-yellow">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-neon-yellow flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-display font-bold text-neon-yellow mb-1">
                {language === 'EN' ? 'The Lesson' : 'Pelajaran'}
              </h4>
              <p className="text-ink-200">{t(selected.moral, language)}</p>
            </div>
          </div>
        </Card>

        {/* Other versions note */}
        {selected.otherVersions && (
          <Card className="mb-6 border-l-4 border-l-neon-blue">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-neon-blue flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-ink-200 text-sm">
                  {language === 'EN'
                    ? 'Other versions exist! Different regions tell this legend differently. Ask your family which version they know.'
                    : 'Versi lain ada! Daerah yang berbeda menceritakan legenda ini secara berbeda. Tanyakan ke keluarga kamu versi mana yang mereka tahu.'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Source note */}
        <div className="text-xs text-ink-500 mb-6 flex items-center gap-2">
          <span>📚</span>
          {language === 'EN'
            ? 'Source: Based on traditional Indonesian folklore. Learn more at your local museum or ask your elders for their version.'
            : 'Sumber: Berdasarkan cerita rakyat tradisional Indonesia. Pelajari lebih lanjut di museum lokal atau tanyakan ke tetua kamu.'}
        </div>

        {/* Choose-your-own-path (Kinesthetic or all modes) */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <GitBranch size={18} className="text-neon-pink" />
              {language === 'EN' ? 'Choose Your Own Path' : 'Pilih Jalanmu Sendiri'}
            </h3>
            {!showPath && (
              <Button size="sm" variant="neon-pink" onClick={startPath}>
                {language === 'EN' ? 'Start' : 'Mulai'}
              </Button>
            )}
          </div>

          {showPath && (
            <div className="space-y-4">
              <div className="p-4 bg-ink-800 rounded-xl">
                <p className="text-ink-200 mb-4">
                  {typeof currentNode === 'string' ? currentNode : currentNode.text}
                </p>

                {typeof currentNode !== 'string' && !currentNode.end && (
                  <div className="space-y-2">
                    {currentNode.choices.map((choice: { text: string; next: number }, i: number) => (
                      <Button
                        key={i}
                        variant="secondary"
                        size="md"
                        className="w-full text-left"
                        onClick={() => handlePathChoice(choice.next)}
                      >
                        {choice.text}
                      </Button>
                    ))}
                  </div>
                )}

                {typeof currentNode !== 'string' && currentNode.end && (
                  <div className="space-y-3">
                    {currentNode.win ? (
                      <div className="flex items-center gap-2 text-neon-green">
                        <CheckCircle size={20} />
                        <span className="font-bold">{language === 'EN' ? 'You won!' : 'Kamu menang!'}</span>
                      </div>
                    ) : (
                      <p className="text-neon-pink">{language === 'EN' ? 'Game over!' : 'Permainan selesai!'}</p>
                    )}
                    <Button size="sm" variant="ghost" onClick={resetPath}>
                      <RotateCcw size={14} /> {language === 'EN' ? 'Try again' : 'Coba lagi'}
                    </Button>
                  </div>
                )}

                {typeof currentNode === 'string' && (
                  <div className="space-y-2">
                    {pathData.choices.map((choice, i) => (
                      <Button
                        key={i}
                        variant="secondary"
                        size="md"
                        className="w-full text-left"
                        onClick={() => handlePathChoice(choice.next)}
                      >
                        {choice.text}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Take It IRL prompt */}
        <Card className="border-l-4 border-l-neon-green">
          <div className="flex items-center gap-3">
            <Home className="text-neon-green" size={24} />
            <div className="flex-1">
              <p className="text-ink-200">
                {language === 'EN'
                  ? 'Ask your grandparents about this legend — they might know a different version!'
                  : 'Tanyakan ke kakek-nenekmu tentang legenda ini — mereka mungkin tahu versi yang berbeda!'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Legend grid
  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
          <ScrollText className="text-batik-400" /> {language === 'EN' ? 'Indonesian Legends' : 'Legenda Indonesia'}
        </h1>
        <p className="text-ink-400 mt-1">
          {language === 'EN'
            ? 'AI-powered stories that bring Indonesian folklore to life.'
            : 'Cerita bertenaga AI yang menghidupkan kembali legenda Indonesia.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {content.legends.map((legend) => (
          <Card key={legend.id} onClick={() => handleExplore(legend)} className="group">
            <div className="flex items-start gap-4">
              <div className="text-5xl group-hover:scale-110 transition-transform">{legend.emoji}</div>
              <div className="flex-1">
                <h3 className="text-lg font-display font-bold text-white">{t(legend.title, language)}</h3>
                <div className="flex items-center gap-1 text-xs text-ink-500 mb-2">
                  <MapPin size={12} /> {t(legend.region, language)}
                </div>
                <p className="text-sm text-ink-300">{t(legend.short, language)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <AIBadge />
                  {explored.has(legend.id) && (
                    <span className="text-xs text-neon-green flex items-center gap-1">
                      <CheckCircle size={12} /> {language === 'EN' ? 'Explored' : 'Dijelajahi'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {learningStyle === 'Kinesthetic' && (
        <Card className="mt-6 border-l-4 border-l-neon-pink">
          <p className="text-ink-200">
            {language === 'EN'
              ? '🎬 Kinesthetic mode: Each legend includes a choose-your-own-path adventure! Pick a legend to start.'
              : '🎬 Mode Kinestetik: Setiap legenda termasuk petualangan pilih-jalanmu! Pilih legenda untuk mulai.'}
          </p>
        </Card>
      )}
    </div>
  );
}
