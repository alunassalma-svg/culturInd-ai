import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Button, Card, AIBadge } from '@/components/ui';
import { content, t } from '@/data/content';
import type { Language } from '@/types';
import {
  Gift, ScrollText, Frame, PersonStanding, Home, Sparkles,
  TrendingUp, ChevronRight, Lightbulb, Users, Star,
} from 'lucide-react';

// "Why CulturInd.ai?" section content in both languages
const whyContent = {
  title: { EN: 'Why CulturInd.ai?', ID: 'Mengapa CulturInd.ai?' },
  intro: {
    EN: 'International culture is now easy to find in our daily lives, especially through social media, the internet, music, movies, and fashion. This makes children and teenagers more familiar with cultures from other countries. As a result, some teenagers become more interested in international cultures than their own Indonesian culture. They may follow foreign trends more often and know less about Indonesian traditions and arts. In my opinion, international culture is not always a bad thing. However, if teenagers do not balance it with learning about Indonesian culture, their interest and appreciation for national culture may slowly decrease.',
    ID: 'Budaya internasional kini mudah ditemukan dalam kehidupan sehari-hari kita, terutama melalui media sosial, internet, musik, film, dan fashion. Hal ini membuat anak-anak dan remaja menjadi lebih akrab dengan budaya dari negara lain. Akibatnya, sebagian remaja menjadi lebih tertarik pada budaya internasional daripada budaya Indonesia mereka sendiri. Mereka mungkin lebih sering mengikuti tren asing dan kurang mengetahui tradisi serta seni Indonesia. Menurut saya, budaya internasional tidak selalu buruk. Namun, jika remaja tidak menyeimbangkannya dengan mempelajari budaya Indonesia, minat dan apresiasi mereka terhadap budaya nasional dapat perlahan menurun.',
  },
  addition: {
    EN: 'In addition, traditional methods of learning culture can sometimes feel less interactive and less relevant to their digital lifestyles. Therefore, Indonesian teenagers should be encouraged to learn and appreciate their own cultural heritage alongside international cultures.',
    ID: 'Selain itu, cara tradisional dalam mempelajari budaya terkadang terasa kurang interaktif dan kurang relevan dengan gaya hidup digital mereka. Oleh karena itu, remaja Indonesia perlu didorong untuk mempelajari dan menghargai warisan budaya mereka sendiri berdampingan dengan budaya internasional.',
  },
  reasonsIntro: {
    EN: 'There are several reasons why international cultures have a negative effect on Indonesian kids\' and teenagers\' interest in national cultures:',
    ID: 'Ada beberapa alasan mengapa budaya internasional berdampak negatif terhadap minat anak-anak dan remaja Indonesia pada budaya nasional:',
  },
  reasons: [
    {
      EN: 'First, foreign culture can make teenagers less interested in Indonesian culture. They often watch foreign movies, listen to foreign music, and follow foreign fashion. Because of this, they may spend less time learning about Indonesian traditions.',
      ID: 'Pertama, budaya asing dapat membuat remaja kurang tertarik pada budaya Indonesia. Mereka sering menonton film asing, mendengarkan musik asing, dan mengikuti fashion asing. Karena itu, mereka mungkin menghabiskan lebih sedikit waktu untuk mempelajari tradisi Indonesia.',
    },
    {
      EN: 'Second, social media makes foreign culture very easy to follow. Teenagers can see many foreign trends every day and sometimes want to copy them. This can make them forget about their own culture.',
      ID: 'Kedua, media sosial membuat budaya asing sangat mudah diikuti. Remaja dapat melihat banyak tren asing setiap hari dan terkadang ingin menirunya. Hal ini dapat membuat mereka melupakan budaya mereka sendiri.',
    },
    {
      EN: 'Third, teenagers need to know and appreciate Indonesian culture. Indonesia has many traditional dances, songs, clothes, and foods. Learning about them can help teenagers stay proud of their own culture.',
      ID: 'Ketiga, remaja perlu mengenal dan menghargai budaya Indonesia. Indonesia memiliki banyak tarian, lagu, pakaian, dan makanan tradisional. Mempelajarinya dapat membantu remaja tetap bangga dengan budaya mereka sendiri.',
    },
    {
      EN: 'Fourth, foreign culture can also affect how teenagers speak and act. Sometimes, today\'s teenagers prefer using slang or language styles from other countries. If this keeps happening, the use of Indonesian language and cultural habits could decrease more and more.',
      ID: 'Keempat, budaya asing juga dapat memengaruhi cara remaja berbicara dan bertindak. Terkadang, remaja zaman sekarang lebih suka menggunakan bahasa gaul atau gaya bahasa dari negara lain. Jika hal ini terus berlanjut, penggunaan bahasa Indonesia dan kebiasaan budaya bisa semakin berkurang.',
    },
  ],
  conclusion: {
    EN: 'In conclusion, foreign culture can affect teenagers and make them less interested in Indonesian culture. However, we should still learn, appreciate, and be proud of our own culture. We can enjoy foreign culture without forgetting Indonesian culture. Therefore, teenagers should be wise in choosing which foreign cultures to follow. We can take the good things from other cultures while keeping our own traditions alive. By doing this, Indonesian culture can continue to be appreciated and preserved by the younger generation.',
    ID: 'Kesimpulannya, budaya asing dapat memengaruhi remaja dan membuat mereka kurang tertarik pada budaya Indonesia. Namun, kita tetap harus belajar, menghargai, dan bangga akan budaya kita sendiri. Kita bisa menikmati budaya asing tanpa melupakan budaya Indonesia. Oleh karena itu, remaja harus bijak dalam memilih budaya asing yang diikuti. Kita dapat mengambil hal-hal baik dari budaya lain sambil tetap menjaga tradisi kita tetap hidup. Dengan begitu, budaya Indonesia dapat terus dihargai dan dilestarikan oleh generasi muda.',
  },
};

const reasonEmojis = ['📺', '📱', '💃', '🗣️'];

function WhySection() {
  const { language, accessibility } = useApp();
  const [localLang, setLocalLang] = useState<Language>(language);
  const [fading, setFading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Keep in sync with global language
  useEffect(() => {
    setLocalLang(language);
  }, [language]);

  const handleTranslate = () => {
    if (fading) return;
    const fadeDuration = accessibility.reduceMotion ? 0 : 300;
    setFading(true);

    setTimeout(() => {
      setLocalLang((prev) => (prev === 'EN' ? 'ID' : 'EN'));
      setFading(false);
    }, fadeDuration);
  };

  const fadeStyle = accessibility.reduceMotion
    ? {}
    : { opacity: fading ? 0 : 1, transition: 'opacity 300ms ease-in-out' };

  const lang = localLang;

  return (
    <section ref={sectionRef} id="why-section" className="py-16 px-4 bg-ink-900 batik-bg">
      <div className="max-w-5xl mx-auto">
        {/* Title + translate button — both fade together */}
        <div style={fadeStyle}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white flex items-center gap-3">
              <Lightbulb className="text-neon-yellow" size={32} />
              {whyContent.title[lang]}
            </h2>
            <button
              onClick={handleTranslate}
              disabled={fading}
              className="btn-neon flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-batik-400 to-batik-600 text-white font-display font-bold text-sm disabled:opacity-50"
              aria-label={lang === 'EN' ? 'Translate to Bahasa Indonesia' : 'Translate to English'}
            >
              🌐 {lang === 'EN' ? 'Translate to Bahasa Indonesia' : 'Translate to English'}
            </button>
          </div>
        </div>

        {/* Content with aria-live for screen readers */}
        <div aria-live="polite" style={fadeStyle} className="space-y-4">
          {/* Intro card */}
          <Card className="border-l-4 border-l-neon-blue">
            <p className="text-ink-200 leading-relaxed">{whyContent.intro[lang]}</p>
          </Card>

          {/* "In addition" card */}
          <Card className="border-l-4 border-l-neon-green">
            <p className="text-ink-200 leading-relaxed">{whyContent.addition[lang]}</p>
          </Card>

          {/* Reasons intro */}
          <p className="text-ink-300 font-display font-medium pl-2">
            {whyContent.reasonsIntro[lang]}
          </p>

          {/* Four reason cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {whyContent.reasons.map((reason, i) => (
              <Card key={i} className="border-l-4 border-l-batik-400">
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{reasonEmojis[i]}</span>
                  <p className="text-ink-200 leading-relaxed text-sm">{reason[lang]}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Conclusion card */}
          <Card className="border-l-4 border-l-neon-pink bg-gradient-to-r from-neon-pink/5 to-transparent">
            <p className="text-ink-200 leading-relaxed font-medium">{whyContent.conclusion[lang]}</p>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ImpactCounter() {
  const { impactCounts, language, incrementImpact, setPage } = useApp();

  const items = [
    { key: 'familyConversations' as const, label: { EN: 'Family Conversations Started', ID: 'Percakapan Keluarga Dimulai' }, emoji: '💬', value: impactCounts.familyConversations },
    { key: 'legendsExplored' as const, label: { EN: 'Legends Explored', ID: 'Legenda Dijelajahi' }, emoji: '📜', value: impactCounts.legendsExplored },
    { key: 'danceStepsPracticed' as const, label: { EN: 'Dance Steps Practiced', ID: 'Langkah Tari Dipraktikkan' }, emoji: '💃', value: impactCounts.danceStepsPracticed },
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-neon-green" /> {language === 'EN' ? 'Our Impact' : 'Dampak Kita'}
          </h2>
          <button
            onClick={() => setPage('impact')}
            className="text-sm text-neon-blue hover:underline flex items-center gap-1"
          >
            {language === 'EN' ? 'See details' : 'Lihat detail'} <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.key} className="text-center">
              <div className="text-4xl mb-2 animate-float">{item.emoji}</div>
              <div className="text-3xl font-display font-black text-neon-blue">
                {item.value.toLocaleString()}
              </div>
              <p className="text-ink-300 text-sm mt-1">{t(item.label, language)}</p>
            </Card>
          ))}
        </div>
        <p className="text-center text-ink-500 text-xs mt-4">
          {language === 'EN' ? 'Demo numbers — anonymous, no personal data.' : 'Angka demo — anonim, tanpa data pribadi.'}
        </p>
      </div>
    </section>
  );
}

export function HomePage() {
  const { setPage, language, isCreator, learningStyle, profile } = useApp();
  const [surprisePulse, setSurprisePulse] = useState(false);

  // Listen for surprise-me events
  useEffect(() => {
    const handler = () => setSurprisePulse(true);
    window.addEventListener('surprise-me', handler);
    return () => window.removeEventListener('surprise-me', handler);
  }, []);

  const featuredLegend = content.legends[0];
  const trendingArt = content.gallery[0];
  const todayChallenge = content.irlChallenges[0];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 batik-bg opacity-50" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-neon-pink/10 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-batik-400/20 border border-batik-400/40 text-batik-300 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles size={14} />
            {language === 'EN' ? 'Indonesian culture, reimagined' : 'Budaya Indonesia, dimodernkan'}
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-tight mb-4 animate-slide-up">
            Discover Your
            <br />
            <span className="shimmer-text">Culture</span>, The Cool Way
          </h1>

          <p className="text-lg text-ink-300 max-w-2xl mx-auto mb-8 animate-slide-up">
            {language === 'EN'
              ? 'Legends, dances, batik, languages, and more — brought to life with AI. Made for Indonesian youth, by Indonesian youth.'
              : 'Legenda, tari, batik, bahasa, dan lainnya — dihidupkan dengan AI. Dibuat untuk pemuda Indonesia, oleh pemuda Indonesia.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="neon-pink"
              className={surprisePulse ? 'animate-wiggle' : ''}
              onClick={() => {
                const allPages: Array<'legends' | 'gallery' | 'language' | 'dance' | 'outfit' | 'takeitirl'> = ['legends', 'gallery', 'language', 'dance', 'outfit', 'takeitirl'];
                setPage(allPages[Math.floor(Math.random() * allPages.length)]);
                setSurprisePulse(false);
              }}
            >
              <Gift size={20} /> Surprise Me!
            </Button>
            <Button size="lg" variant="neon-blue" onClick={() => setPage('legends')}>
              <ScrollText size={20} /> {language === 'EN' ? 'Explore Legends' : 'Jelajahi Legenda'}
            </Button>
          </div>

          {/* Learning style indicator */}
          <div className="mt-8 inline-flex items-center gap-2 text-sm text-ink-400">
            <span>{language === 'EN' ? 'You\'re learning:' : 'Kamu belajar:'}</span>
            <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green font-medium">
              {learningStyle}
            </span>
            <span>·</span>
            <span className="px-3 py-1 rounded-full bg-batik-400/20 text-batik-300 font-medium">
              {isCreator ? 'Creator' : 'Explorer'}
            </span>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <Star className="text-neon-yellow" /> {language === 'EN' ? 'Today\'s Picks' : 'Pilihan Hari Ini'}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Featured legend */}
            <Card onClick={() => setPage('legends')} className="group">
              <div className="text-4xl mb-3">{featuredLegend.emoji}</div>
              <div className="flex items-center gap-2 mb-2">
                <ScrollText size={14} className="text-batik-400" />
                <span className="text-xs text-batik-400 font-medium">
                  {language === 'EN' ? 'Legend of the Day' : 'Legenda Hari Ini'}
                </span>
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-1">
                {t(featuredLegend.title, language)}
              </h3>
              <p className="text-sm text-ink-400">{t(featuredLegend.short, language)}</p>
              <div className="mt-3 text-neon-blue text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                {language === 'EN' ? 'Read' : 'Baca'} <ChevronRight size={14} />
              </div>
            </Card>

            {/* Trending artwork */}
            <Card onClick={() => setPage('gallery')} className="group">
              <div className="text-4xl mb-3">{trendingArt.emoji}</div>
              <div className="flex items-center gap-2 mb-2">
                <Frame size={14} className="text-neon-pink" />
                <span className="text-xs text-neon-pink font-medium">
                  {language === 'EN' ? 'Trending Art' : 'Seni Trending'}
                </span>
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-1">
                {t(trendingArt.name, language)}
              </h3>
              <p className="text-sm text-ink-400">{t(trendingArt.desc, language).slice(0, 80)}...</p>
              <div className="mt-3 text-neon-pink text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                {language === 'EN' ? 'View' : 'Lihat'} <ChevronRight size={14} />
              </div>
            </Card>

            {/* Today's challenge */}
            <Card onClick={() => setPage('takeitirl')} className="group">
              <div className="text-4xl mb-3">{todayChallenge.emoji}</div>
              <div className="flex items-center gap-2 mb-2">
                <Home size={14} className="text-neon-green" />
                <span className="text-xs text-neon-green font-medium">
                  {language === 'EN' ? 'Today\'s IRL Challenge' : 'Tantangan IRL Hari Ini'}
                </span>
              </div>
              <h3 className="text-sm font-display font-bold text-white mb-1">
                {t(todayChallenge.text, language)}
              </h3>
              <div className="mt-3 text-neon-green text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                {language === 'EN' ? 'Take it on' : 'Coba sekarang'} <ChevronRight size={14} />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why section with translation */}
      <WhySection />

      {/* Impact counter */}
      <ImpactCounter />

      {/* Quick access grid */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-white mb-6">
            {language === 'EN' ? 'Jump Right In' : 'Langsung Mulai'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { page: 'dance' as const, icon: PersonStanding, label: { EN: 'Dance Studio', ID: 'Studio Tari' }, color: 'text-neon-pink' },
              { page: 'outfit' as const, icon: Sparkles, label: { EN: 'Outfit Studio', ID: 'Studio Outfit' }, color: 'text-neon-blue' },
              { page: 'clubs' as const, icon: Users, label: { EN: 'Culture Clubs', ID: 'Klub Budaya' }, color: 'text-neon-green' },
              { page: 'language' as const, icon: ScrollText, label: { EN: 'Language Center', ID: 'Pusat Bahasa' }, color: 'text-neon-yellow' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.page} onClick={() => setPage(item.page)} className="text-center group">
                  <Icon className={`${item.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} size={32} />
                  <p className="text-sm font-medium text-white">{t(item.label, language)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
