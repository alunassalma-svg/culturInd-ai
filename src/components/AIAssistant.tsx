import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useTTS } from '@/hooks/useTTS';
import { Button } from '@/components/ui';
import {
  MessageCircle, X, Send, Volume2, Pause, Sparkles, AlertTriangle,
} from 'lucide-react';

interface ChatMsg {
  role: 'user' | 'ai';
  text: string;
}

// Mock AI knowledge base for Indonesian culture
const cultureKnowledge: Record<string, { EN: string; ID: string }> = {
  batik: {
    EN: 'Batik is a traditional Indonesian textile art using wax-resist dyeing. Each motif carries meaning — Parang for strength, Kawung for purity, Mega Mendung for clouds and rain. UNESCO recognized Indonesian batik as Intangible Cultural Heritage in 2009.',
    ID: 'Batik adalah seni tekstil tradisional Indonesia menggunakan teknik resist-lilin. Setiap motif memiliki makna — Parang untuk kekuatan, Kawung untuk kesucian, Mega Mendung untuk awan dan hujan. UNESCO mengakui batik Indonesia sebagai Warisan Budaya Takbenda pada 2009.',
  },
  saman: {
    EN: 'Tari Saman is the "thousand hands" dance from Aceh. Dancers sit in a tight row and move their hands in perfect unison. It\'s one of Indonesia\'s most famous dances!',
    ID: 'Tari Saman adalah tarian "seribu tangan" dari Aceh. Penari duduk berbaris rapat dan menggerakkan tangan serempak. Salah satu tarian paling terkenal Indonesia!',
  },
  legend: {
    EN: 'Indonesia has hundreds of legends! Some famous ones: Malin Kundang (West Sumatra), Timun Mas (Central Java), Roro Jonggrang (East Java), and Sangkuriang (West Java). Many have different versions in different regions — ask your family which version they know!',
    ID: 'Indonesia memiliki ratusan legenda! Beberapa yang terkenal: Malin Kundang (Sumatera Barat), Timun Mas (Jawa Tengah), Roro Jonggrang (Jawa Timur), dan Sangkuriang (Jawa Barat). Banyak yang punya versi berbeda di daerah berbeda — tanyakan ke keluarga kamu versi mana yang mereka tahu!',
  },
  gamelan: {
    EN: 'Gamelan is a traditional Indonesian musical ensemble made up of metallophones, gongs, and drums. It\'s played in Java and Bali, often accompanying wayang performances or dance.',
    ID: 'Gamelan adalah ansambel musik tradisional Indonesia yang terdiri dari metalofon, gong, dan drum. Dimainkan di Jawa dan Bali, sering mengiringi pertunjukan wayang atau tari.',
  },
  wayang: {
    EN: 'Wayang is Indonesian shadow puppet theater, especially popular in Java. The puppeteer (dalang) tells stories from the Ramayana and Mahabharata. UNESCO recognized it as a Masterpiece of Oral and Intangible Heritage.',
    ID: 'Wayang adalah teater wayang kulit Indonesia, terutama populer di Jawa. Dalang menceritakan kisah dari Ramayana dan Mahabharata. UNESCO mengakuinya sebagai Mahakarya Warisan Lisan dan Takbenda.',
  },
};

// Personal info patterns to detect and block
const personalInfoPatterns = /(my name is|my phone|my address|my school|i live at|@gmail|@yahoo|[0-9]{10,})/i;

export function AIAssistant() {
  const { language, learningStyle, isCreator, setPage, mode } = useApp();
  const { speak, stop, speaking } = useTTS();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [warned, setWarned] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([{
        role: 'ai',
        text: isCreator
          ? (language === 'EN'
            ? "Hey! I'm the CulturInd assistant 🇮🇩 Ask me anything about Indonesian culture, legends, dances, or help finding your way around the site!"
            : "Hai! Saya asisten CulturInd 🇮🇩 Tanya apa saja tentang budaya Indonesia, legenda, tari, atau bantu mencari fitur di situs!")
          : (language === 'EN'
            ? "Hi there! I'm the CulturInd assistant! 🇮🇩 I can tell you about Indonesian legends, dances, and culture. What would you like to know?"
            : "Halo! Saya asisten CulturInd! 🇮🇩 Saya bisa menceritakan tentang legenda, tari, dan budaya Indonesia. Apa yang ingin kamu tahu?"),
      }]);
    }
  };

  const generateReply = (userText: string): string => {
    const lang = language;
    const text = userText.toLowerCase();

    // Check for personal info
    if (personalInfoPatterns.test(userText)) {
      return lang === 'EN'
        ? "Let's keep personal details private! You can share your story without names or places. 🔒"
        : "Ayo jaga info pribadi tetap rahasia! Kamu bisa berbagi cerita tanpa nama atau tempat. 🔒";
    }

    // Check for moderator dashboard queries — NEVER reveal it exists
    if (text.includes('moderator') || text.includes('dashboard') || text.includes('admin panel')) {
      return lang === 'EN'
        ? "I can help you with Indonesian culture, legends, dances, and navigating the site. What would you like to explore?"
        : "Saya bisa membantu dengan budaya Indonesia, legenda, tari, dan navigasi situs. Apa yang ingin kamu jelajahi?";
    }

    // Navigation help
    if (text.includes('where') || text.includes('find') || text.includes('navigate')) {
      if (text.includes('legend')) {
        setTimeout(() => setPage('legends'), 100);
        return lang === 'EN' ? "Legends are in the top bar — tap 'Legends'! I'll take you there now. 📜" : "Legenda ada di bar atas — ketuk 'Legends'! Saya akan bawa kamu ke sana. 📜";
      }
      if (text.includes('dance')) {
        setTimeout(() => setPage('dance'), 100);
        return lang === 'EN' ? "Dance Studio is in the shortcut bar! Taking you there now. 💃" : "Studio Tari ada di bar pintasan! Mengantar kamu ke sana sekarang. 💃";
      }
      if (text.includes('gallery') || text.includes('art')) {
        setTimeout(() => setPage('gallery'), 100);
        return lang === 'EN' ? "The Gallery is in the top bar — tap 'Gallery'! Let me take you there. 🖼️" : "Galeri ada di bar atas — ketuk 'Gallery'! Izinkan saya mengantar kamu. 🖼️";
      }
      if (text.includes('community') || text.includes('club')) {
        setTimeout(() => setPage('community'), 100);
        return lang === 'EN' ? "Community is in the top bar! I'll take you there. 👥" : "Komunitas ada di bar atas! Saya akan antar kamu. 👥";
      }
      if (text.includes('language') || text.includes('quiz')) {
        setTimeout(() => setPage('language'), 100);
        return lang === 'EN' ? "The Language Center is in the top bar! Taking you there. 💬" : "Pusat Bahasa ada di bar atas! Mengantar kamu ke sana. 💬";
      }
      if (text.includes('outfit')) {
        setTimeout(() => setPage('outfit'), 100);
        return lang === 'EN' ? "Outfit Studio is in the shortcut bar! Let's go. 👕" : "Studio Outfit ada di bar pintasan! Ayo. 👕";
      }
      if (text.includes('irl') || text.includes('challenge')) {
        setTimeout(() => setPage('takeitirl'), 100);
        return lang === 'EN' ? "Take It IRL is in the shortcut bar! Taking you there. 🏠" : "Take It IRL ada di bar pintasan! Mengantar kamu. 🏠";
      }
    }

    // Culture knowledge
    for (const [key, value] of Object.entries(cultureKnowledge)) {
      if (text.includes(key)) {
        return lang === 'EN' ? value.EN : value.ID;
      }
    }

    // Greetings
    if (text.includes('hello') || text.includes('hi') || text.includes('halo') || text.includes('hai')) {
      return lang === 'EN' ? "Hello! Ask me about Indonesian legends, dances, batik, gamelan, wayang, or anything culture-related! 🇮🇩" : "Halo! Tanya saya tentang legenda, tari, batik, gamelan, wayang, atau apa pun tentang budaya! 🇮🇩";
    }

    // Default response — humble about not knowing
    return lang === 'EN'
      ? "I'm not 100% sure about that one. Check with a teacher, a book, or your family! You can also ask me about batik, gamelan, wayang, Tari Saman, or Indonesian legends like Malin Kundang. 📚"
      : "Saya tidak 100% yakin tentang itu. Tanyakan ke guru, buku, atau keluarga kamu! Kamu juga bisa bertanya tentang batik, gamelan, wayang, Tari Saman, atau legenda Indonesia seperti Malin Kundang. 📚";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMsg = { role: 'user', text: input };
    const aiText = generateReply(input);
    const aiMsg: ChatMsg = { role: 'ai', text: aiText };
    setMessages([...messages, userMsg, aiMsg]);
    setInput('');
    setWarned(false);

    // Voice mode for Auditory learning style
    if (learningStyle === 'Auditory') {
      setTimeout(() => speak(aiText, language === 'EN' ? 'en-US' : 'id-ID'), 200);
    }
  };

  const handleListen = (text: string) => {
    if (speaking) {
      stop();
    } else {
      speak(text, language === 'EN' ? 'en-US' : 'id-ID');
    }
  };

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-20 lg:bottom-6 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-batik-400 to-batik-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform animate-glow-pulse"
        style={{ color: '#FF8C33' }}
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={28} className="text-white" />
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neon-pink text-white text-[10px] flex items-center justify-center font-bold">
          AI
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] flex flex-col card-base batik-bg rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-batik-400/20 to-transparent border-b border-batik-400/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-batik-400 to-batik-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-display font-bold text-white">CulturInd Assistant</p>
            <p className="text-[10px] text-neon-green">● Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {learningStyle === 'Auditory' && (
            <button
              onClick={() => speaking ? stop() : handleListen(messages[messages.length - 1]?.text || '')}
              className="p-1.5 rounded-lg hover:bg-white/10 text-neon-green"
              aria-label={speaking ? 'Stop voice' : 'Read last reply aloud'}
            >
              {speaking ? <Pause size={16} /> : <Volume2 size={16} />}
            </button>
          )}
          <button
            onClick={() => { setOpen(false); stop(); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Privacy note */}
      <div className="px-3 py-1.5 bg-neon-yellow/5 border-b border-neon-yellow/10">
        <p className="text-[10px] text-neon-yellow">
          🔒 {language === 'EN' ? "Don't share personal info. Stay safe!" : 'Jangan bagikan info pribadi. Tetap aman!'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-64">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl p-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-neon-blue/20 text-white'
                  : 'bg-ink-800 text-ink-200'
              }`}
            >
              <p>{msg.text}</p>
              {msg.role === 'ai' && learningStyle === 'Auditory' && (
                <button
                  onClick={() => handleListen(msg.text)}
                  className="mt-1 text-[10px] text-neon-green flex items-center gap-1"
                >
                  {speaking ? <Pause size={10} /> : <Volume2 size={10} />}
                  {language === 'EN' ? 'Listen' : 'Dengar'}
                </button>
              )}
              {msg.role === 'ai' && (
                <button className="mt-1 text-[10px] text-ink-500 hover:text-neon-pink flex items-center gap-1">
                  <AlertTriangle size={10} /> {language === 'EN' ? 'Report a mistake' : 'Laporkan kesalahan'}
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-ink-700 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={language === 'EN' ? 'Ask about Indonesian culture...' : 'Tanya tentang budaya Indonesia...'}
          className="flex-1 bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-neon-blue"
        />
        <Button size="sm" variant="neon-blue" onClick={handleSend} aria-label="Send message">
          <Send size={14} />
        </Button>
      </div>
    </div>
  );
}
