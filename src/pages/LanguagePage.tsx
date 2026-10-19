import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button } from '@/components/ui';
import { content, t } from '@/data/content';
import { useTTS } from '@/hooks/useTTS';
import type { Language } from '@/types';
import {
  MessageCircle, Volume2, Pause, Play, RotateCcw,
  Check, X, Star, Award, Sparkles, Repeat,
} from 'lucide-react';

export function LanguagePage() {
  const { language, learningStyle, addPoints, addBadge, profile } = useApp();
  const { speak, stop, speaking } = useTTS();
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Matching game state
  const [matchSelected, setMatchSelected] = useState<{ type: 'word' | 'match'; id: number } | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [matchWrong, setMatchWrong] = useState(false);

  const wordOfDay = content.wordsOfDay[new Date().getDate() % content.wordsOfDay.length];

  const currentQuiz = content.quizzes[quizIdx];

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(idx);
    if (idx === currentQuiz.answer) {
      setQuizCorrect((c) => c + 1);
      addPoints(5);
    }
  };

  const nextQuiz = () => {
    if (quizIdx + 1 < content.quizzes.length) {
      setQuizIdx(quizIdx + 1);
      setQuizAnswer(null);
    } else {
      setQuizDone(true);
      if (quizCorrect >= 3) addBadge('quiz-master');
    }
  };

  const resetQuiz = () => {
    setQuizIdx(0);
    setQuizAnswer(null);
    setQuizCorrect(0);
    setQuizDone(false);
  };

  // Matching game logic
  const shuffledMatches = useMemo(() => {
    return [...content.matchItems].sort(() => Math.random() - 0.5);
  }, []);

  const handleMatchClick = (type: 'word' | 'match', id: number) => {
    if (matched.has(id)) return;
    if (!matchSelected) {
      setMatchSelected({ type, id });
      return;
    }
    if (matchSelected.type === type) {
      // Switch selection
      setMatchSelected({ type, id });
      return;
    }
    // Check match
    if (matchSelected.id === id) {
      const newMatched = new Set(matched);
      newMatched.add(id);
      setMatched(newMatched);
      setMatchSelected(null);
      addPoints(5);
    } else {
      setMatchWrong(true);
      setTimeout(() => {
        setMatchWrong(false);
        setMatchSelected(null);
      }, 600);
    }
  };

  const handlePronounce = (text: string, slow: boolean) => {
    if (speaking) {
      stop();
      return;
    }
    speak(text, 'id-ID');
    // Note: Web Speech API rate is set in the hook. For slow mode, we'd need a custom utterance.
  };

  const allMatched = matched.size === content.matchItems.length;

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
          <MessageCircle className="text-neon-green" />
          {language === 'EN' ? 'Language Center' : 'Pusat Bahasa'}
        </h1>
        <p className="text-ink-400 mt-1">
          {language === 'EN'
            ? 'Learn Indonesian and regional languages through games, quizzes, and pronunciation.'
            : 'Belajar bahasa Indonesia dan bahasa daerah melalui permainan, kuis, dan pelafalan.'}
        </p>
      </div>

      {/* Word of the Day */}
      <Card className="mb-6 border-l-4 border-l-neon-yellow">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{wordOfDay.emoji}</div>
          <div className="flex-1">
            <div className="text-xs text-neon-yellow font-bold uppercase tracking-wider mb-1">
              {language === 'EN' ? 'Word of the Day' : 'Kata Hari Ini'}
            </div>
            <h3 className="text-2xl font-display font-bold text-white">{wordOfDay.word}</h3>
            <p className="text-ink-300 text-sm">{t(wordOfDay.meaning, language)}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-ink-700 text-ink-400">
              {wordOfDay.lang}
            </span>
          </div>
          {learningStyle === 'Auditory' && (
            <Button
              size="sm"
              variant="neon-green"
              onClick={() => handlePronounce(wordOfDay.word, false)}
              aria-label="Pronounce word"
            >
              {speaking ? <Pause size={16} /> : <Volume2 size={16} />}
            </Button>
          )}
        </div>
      </Card>

      {/* Pronunciation audio (Auditory mode) */}
      {learningStyle === 'Auditory' && (
        <Card className="mb-6 border-l-4 border-l-neon-green">
          <h3 className="text-lg font-display font-bold text-white mb-3 flex items-center gap-2">
            <Volume2 size={18} className="text-neon-green" />
            {language === 'EN' ? 'Pronunciation' : 'Pelafalan'}
          </h3>
          <div className="space-y-3">
            {content.wordsOfDay.slice(0, 4).map((w) => (
              <div key={w.word} className="flex items-center justify-between p-3 bg-ink-800 rounded-lg">
                <div>
                  <span className="font-medium text-white">{w.word}</span>
                  <span className="text-xs text-ink-400 ml-2">{t(w.meaning, language)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePronounce(w.word, false)}
                    className="px-2 py-1 rounded-lg bg-neon-green/20 text-neon-green text-xs font-medium flex items-center gap-1"
                    aria-label={`Pronounce ${w.word} normal speed`}
                  >
                    <Play size={12} /> {language === 'EN' ? 'Normal' : 'Normal'}
                  </button>
                  <button
                    onClick={() => handlePronounce(w.word, true)}
                    className="px-2 py-1 rounded-lg bg-ink-700 text-ink-300 text-xs font-medium flex items-center gap-1"
                    aria-label={`Pronounce ${w.word} slow speed`}
                  >
                    <Play size={12} /> {language === 'EN' ? 'Slow' : 'Lambat'}
                  </button>
                  <button
                    onClick={() => handlePronounce(w.word, false)}
                    className="px-2 py-1 rounded-lg bg-ink-700 text-ink-300 text-xs font-medium"
                    aria-label="Repeat"
                  >
                    <Repeat size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-500 mt-3">
            {language === 'EN'
              ? 'Uses browser text-to-speech. Real version would have native-speaker recordings.'
              : 'Menggunakan text-to-speech browser. Versi nyata akan memiliki rekaman penutur asli.'}
          </p>
        </Card>
      )}

      {/* Quiz section */}
      <Card className="mb-6">
        <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-neon-pink" />
          {language === 'EN' ? 'Slang vs Proper Quiz' : 'Kuis Bahasa Gaul vs Baku'}
        </h3>

        {!quizDone ? (
          <div>
            <div className="text-xs text-ink-500 mb-2">
              {language === 'EN' ? `Question ${quizIdx + 1} of ${content.quizzes.length}` : `Pertanyaan ${quizIdx + 1} dari ${content.quizzes.length}`}
            </div>
            <p className="text-lg text-white mb-4">{t(currentQuiz.question, language)}</p>
            <div className="space-y-2">
              {currentQuiz.options.map((opt, i) => {
                const isAnswered = quizAnswer !== null;
                const isCorrect = i === currentQuiz.answer;
                const isSelected = i === quizAnswer;
                return (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(i)}
                    disabled={isAnswered}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                      !isAnswered
                        ? 'border-ink-600 hover:border-neon-blue text-white'
                        : isCorrect
                        ? 'border-neon-green bg-neon-green/10 text-neon-green'
                        : isSelected
                        ? 'border-neon-pink bg-neon-pink/10 text-neon-pink'
                        : 'border-ink-700 text-ink-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {isAnswered && isCorrect && <Check size={18} />}
                      {isAnswered && isSelected && !isCorrect && <X size={18} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {quizAnswer !== null && (
              <div className="mt-4">
                <p className="text-sm text-ink-300 mb-3 p-3 bg-ink-800 rounded-lg">
                  {t(currentQuiz.explain, language)}
                </p>
                <Button onClick={nextQuiz} size="sm">
                  {quizIdx + 1 < content.quizzes.length
                    ? language === 'EN' ? 'Next' : 'Berikutnya'
                    : language === 'EN' ? 'See Results' : 'Lihat Hasil'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl mb-3 animate-float">
              {quizCorrect === content.quizzes.length ? '🏆' : quizCorrect >= 2 ? '🎉' : '💪'}
            </div>
            <p className="text-xl font-display font-bold text-white mb-2">
              {quizCorrect} / {content.quizzes.length} {language === 'EN' ? 'correct' : 'benar'}
            </p>
            {quizCorrect >= 3 && (
              <p className="text-neon-yellow flex items-center justify-center gap-1 mb-4">
                <Award size={16} /> {language === 'EN' ? 'Quiz Master badge earned!' : 'Lencana Juara Kuis didapat!'}
              </p>
            )}
            <Button onClick={resetQuiz} variant="ghost" size="sm">
              <RotateCcw size={14} /> {language === 'EN' ? 'Try again' : 'Coba lagi'}
            </Button>
          </div>
        )}
      </Card>

      {/* Matching game (Kinesthetic mode or always visible) */}
      <Card className="mb-6">
        <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
          <Star size={18} className="text-neon-blue" />
          {language === 'EN' ? 'Matching Game' : 'Permainan Mencocokkan'}
        </h3>

        {allMatched ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3 animate-float">🎉</div>
            <p className="text-lg font-display font-bold text-white mb-2">
              {language === 'EN' ? 'You matched them all!' : 'Kamu cocokkan semuanya!'}
            </p>
            <Button onClick={() => setMatched(new Set())} variant="ghost" size="sm">
              <RotateCcw size={14} /> {language === 'EN' ? 'Play again' : 'Main lagi'}
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-ink-400 mb-4">
              {language === 'EN'
                ? 'Match each Indonesian word with its translation. Tap a word, then tap its match!'
                : 'Cocokkan setiap kata Indonesia dengan terjemahannya. Ketuk kata, lalu ketuk pasangannya!'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* Words */}
              <div className="space-y-2">
                <p className="text-xs text-ink-500 font-bold uppercase">Indonesian</p>
                {content.matchItems.map((item) => {
                  const isMatched = matched.has(item.id);
                  const isSelected = matchSelected?.type === 'word' && matchSelected?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMatchClick('word', item.id)}
                      disabled={isMatched}
                      className={`w-full px-3 py-2.5 rounded-xl border-2 transition-all flex items-center gap-2 ${
                        isMatched
                          ? 'border-neon-green/30 bg-neon-green/5 text-ink-500 opacity-50'
                          : isSelected
                          ? 'border-neon-blue bg-neon-blue/10 text-white'
                          : matchWrong && matchSelected?.type === 'word' && matchSelected?.id === item.id
                          ? 'border-neon-pink bg-neon-pink/10 text-neon-pink'
                          : 'border-ink-600 text-white hover:border-neon-blue/50'
                      }`}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span className="font-medium">{t(item.word, language)}</span>
                      {isMatched && <Check size={16} className="ml-auto text-neon-green" />}
                    </button>
                  );
                })}
              </div>
              {/* Matches (shuffled) */}
              <div className="space-y-2">
                <p className="text-xs text-ink-500 font-bold uppercase">{language === 'EN' ? 'English' : 'Inggris'}</p>
                {shuffledMatches.map((item) => {
                  const isMatched = matched.has(item.id);
                  const isSelected = matchSelected?.type === 'match' && matchSelected?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMatchClick('match', item.id)}
                      disabled={isMatched}
                      className={`w-full px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                        isMatched
                          ? 'border-neon-green/30 bg-neon-green/5 text-ink-500 opacity-50'
                          : isSelected
                          ? 'border-neon-blue bg-neon-blue/10 text-white'
                          : matchWrong && matchSelected?.type === 'match' && matchSelected?.id === item.id
                          ? 'border-neon-pink bg-neon-pink/10 text-neon-pink'
                          : 'border-ink-600 text-white hover:border-neon-blue/50'
                      }`}
                    >
                      {t(item.match, language)}
                      {isMatched && <Check size={14} className="inline ml-2 text-neon-green" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 text-sm text-ink-400">
              {language === 'EN' ? 'Matched' : 'Dicocokkan'}: {matched.size} / {content.matchItems.length}
            </div>
          </div>
        )}
      </Card>

      {/* Kinesthetic: sorting game placeholder */}
      {learningStyle === 'Kinesthetic' && (
        <Card className="border-l-4 border-l-neon-pink">
          <h3 className="text-lg font-display font-bold text-white mb-2">
            {language === 'EN' ? 'Sorting Game' : 'Permainan Mengurutkan'}
          </h3>
          <p className="text-ink-300 text-sm mb-3">
            {language === 'EN'
              ? 'Drag and drop words into "Proper" or "Slang" categories. Coming soon!'
              : 'Seret dan lepas kata ke kategori "Baku" atau "Gaul". Segera!'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-ink-800 rounded-xl text-center text-ink-400 border-2 border-dashed border-ink-600">
              {language === 'EN' ? 'Proper Indonesian' : 'Bahasa Baku'}
            </div>
            <div className="p-4 bg-ink-800 rounded-xl text-center text-ink-400 border-2 border-dashed border-ink-600">
              {language === 'EN' ? 'Slang' : 'Bahasa Gaul'}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
