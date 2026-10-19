import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button } from '@/components/ui';
import { content, t } from '@/data/content';
import { useTTS } from '@/hooks/useTTS';
import {
  Home, CheckCircle, Send, Sparkles, Star, Volume2,
  Pause, Heart, Lock,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

// Simple AI reflection responses — in a real app, this would call an AI API
const aiResponses = {
  EN: [
    "That's wonderful! Tell me more — what did they say?",
    "Wow, I love hearing that! How did it make you feel?",
    "That's amazing! Did you learn anything new?",
    "So cool that you did that! Would you do it again?",
    "Thanks for sharing! Keep talking to your family about culture — they have so much to share!",
  ],
  ID: [
    "Itu luar biasa! Ceritakan lebih banyak — apa yang mereka katakan?",
    "Wah, saya senang mendengar itu! Bagaimana perasaanmu?",
    "Hebat sekali! Apakah kamu belajar sesuatu yang baru?",
    "Keren sekali kamu melakukan itu! Apakah kamu akan melakukannya lagi?",
    "Terima kasih sudah berbagi! Teruslah berbicara dengan keluarga tentang budaya — mereka punya banyak untuk dibagikan!",
  ],
};

export function TakeItIRLPage() {
  const { language, isCreator, addPoints, addBadge, incrementImpact, profile, mode } = useApp();
  const { speak, stop, speaking } = useTTS();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeChallenge, setActiveChallenge] = useState<typeof content.irlChallenges[0] | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [shared, setShared] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleDidIt = (challenge: typeof content.irlChallenges[0]) => {
    if (completed.has(challenge.id)) return;
    setActiveChallenge(challenge);
    setCompleted(new Set([...completed, challenge.id]));
    incrementImpact('familyConversations');
    addPoints(20);
    if (completed.size === 0) addBadge('first-irl');
    // Start reflection chat
    setChat([{
      role: 'ai',
      text: language === 'EN' ? "What happened? Tell me about it!" : "Apa yang terjadi? Ceritakan ke saya!",
    }]);
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    const aiReply: ChatMessage = {
      role: 'ai',
      text: aiResponses[language][Math.min(chat.length, aiResponses[language].length - 1)],
    };
    setChat([...chat, userMsg, aiReply]);
    setChatInput('');

    // Speak the AI reply if Auditory
    if (speaking) {
      setTimeout(() => speak(aiReply.text, language === 'EN' ? 'en-US' : 'id-ID'), 100);
    }
  };

  const handleShare = () => {
    // In Creator mode, share goes through AI screening (mocked)
    // In Explorer mode, it goes through moderator approval
    setShared(true);
    setTimeout(() => {
      setShowShare(false);
      setShared(false);
      setActiveChallenge(null);
      setChat([]);
    }, 2000);
  };

  const handleListen = (text: string) => {
    if (speaking) {
      stop();
    } else {
      speak(text, language === 'EN' ? 'en-US' : 'id-ID');
    }
  };

  // Reflection chat view
  if (activeChallenge) {
    return (
      <div className="py-8 px-4 max-w-2xl mx-auto">
        <button
          onClick={() => { setActiveChallenge(null); setChat([]); }}
          className="flex items-center gap-2 text-ink-400 hover:text-white mb-6"
        >
          ← {language === 'EN' ? 'Back to challenges' : 'Kembali ke tantangan'}
        </button>

        <Card className="mb-6 border-l-4 border-l-neon-green">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{activeChallenge.emoji}</div>
            <div>
              <p className="text-xs text-neon-green font-bold uppercase">
                {language === 'EN' ? 'You did it!' : 'Kamu berhasil!'}
              </p>
              <p className="text-white">{t(activeChallenge.text, language)}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-neon-yellow">
            <Star size={16} className="fill-current" />
            +20 {language === 'EN' ? 'points earned!' : 'poin didapat!'}
          </div>
        </Card>

        {/* Reflection chat */}
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-neon-pink" />
              {language === 'EN' ? 'Reflection Chat' : 'Obrolan Refleksi'}
            </h3>
            <span className="text-xs text-ink-500">
              {language === 'EN' ? 'Writing is optional — no pressure!' : 'Menulis opsional — tanpa tekanan!'}
            </span>
          </div>

          {/* Privacy note */}
          <div className="mb-3 p-2 bg-neon-yellow/5 border border-neon-yellow/20 rounded-lg">
            <p className="text-xs text-neon-yellow">
              {language === 'EN' ? '🔒 Don\'t share personal info. Stay safe!' : '🔒 Jangan bagikan info pribadi. Tetap aman!'}
            </p>
          </div>

          {/* Chat messages */}
          <div className="space-y-3 max-h-80 overflow-y-auto mb-4 p-2">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3 ${
                    msg.role === 'user'
                      ? 'bg-neon-blue/20 text-white'
                      : 'bg-ink-800 text-ink-200'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.role === 'ai' && (
                    <button
                      onClick={() => handleListen(msg.text)}
                      className="mt-1 text-xs text-neon-green flex items-center gap-1"
                    >
                      {speaking ? <Pause size={12} /> : <Volume2 size={12} />}
                      {language === 'EN' ? 'Listen' : 'Dengar'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'EN' ? 'Type your story...' : 'Ketik ceritamu...'}
              className="flex-1 bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-neon-pink"
            />
            <Button size="sm" variant="neon-pink" onClick={handleSend}>
              <Send size={14} />
            </Button>
          </div>
        </Card>

        {/* Share option */}
        {!showShare && !shared && (
          <Button variant="neon-green" className="w-full" onClick={() => setShowShare(true)}>
            <Heart size={16} /> {language === 'EN' ? 'Share your reflection with the community' : 'Bagikan refleksi ke komunitas'}
          </Button>
        )}

        {showShare && (
          <Card>
            <p className="text-sm text-ink-300 mb-3">
              {isCreator
                ? language === 'EN' ? 'Your reflection will be shared after AI screening. No personal info will be included.' : 'Refleksi kamu akan dibagikan setelah pemeriksaan AI. Tanpa info pribadi.'
                : language === 'EN' ? 'Your reflection will be sent to a moderator for approval before sharing.' : 'Refleksi kamu akan dikirim ke moderator untuk persetujuan sebelum dibagikan.'}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="neon-green" onClick={handleShare}>
                {language === 'EN' ? 'Share it!' : 'Bagikan!'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowShare(false)}>
                {language === 'EN' ? 'Not now' : 'Tidak sekarang'}
              </Button>
            </div>
          </Card>
        )}

        {shared && (
          <div className="p-3 bg-neon-green/10 border border-neon-green/30 rounded-xl text-neon-green text-sm text-center animate-fade-in">
            {isCreator
              ? language === 'EN' ? 'Shared! Your reflection is now in the community.' : 'Dibagikan! Refleksi kamu sekarang di komunitas.'
              : language === 'EN' ? 'Sent! A moderator will review it soon.' : 'Terkirim! Moderator akan meninjaunya segera.'}
          </div>
        )}
      </div>
    );
  }

  // Challenge list
  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
          <Home className="text-neon-green" /> Take It IRL
        </h1>
        <p className="text-ink-400 mt-1">
          {language === 'EN'
            ? 'Real-life challenges that get you offline and talking with family. No proof needed — just tap "I did it!"'
            : 'Tantangan kehidupan nyata yang membawa kamu offline dan mengobrol dengan keluarga. Tanpa bukti — cukup ketuk "Saya sudah melakukannya!"'}
        </p>
      </div>

      <div className="space-y-3">
        {content.irlChallenges.map((challenge) => {
          const isDone = completed.has(challenge.id);
          return (
            <Card key={challenge.id} className={isDone ? 'border-l-4 border-l-neon-green' : ''}>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{challenge.emoji}</div>
                <div className="flex-1">
                  <p className="text-white">{t(challenge.text, language)}</p>
                  {isDone && (
                    <p className="text-xs text-neon-green flex items-center gap-1 mt-1">
                      <CheckCircle size={12} /> {language === 'EN' ? 'Completed!' : 'Selesai!'}
                    </p>
                  )}
                </div>
                {isDone ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveChallenge(challenge)}
                  >
                    {language === 'EN' ? 'Reflect' : 'Refleksi'}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="neon-green"
                    onClick={() => handleDidIt(challenge)}
                  >
                    {language === 'EN' ? 'I did it!' : 'Saya sudah!'}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 text-center">
        <p className="text-sm text-ink-400">
          {language === 'EN'
            ? '🌟 No photos or videos needed. Just honest reflection and real conversations.'
            : '🌟 Tanpa foto atau video. Cukup refleksi jujur dan percakapan nyata.'}
        </p>
      </Card>
    </div>
  );
}
