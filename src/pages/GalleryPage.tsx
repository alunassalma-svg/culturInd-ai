import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, AIBadge } from '@/components/ui';
import { content, t } from '@/data/content';
import { useTTS } from '@/hooks/useTTS';
import {
  Frame, Search, Volume2, Pause, Play, MapPin, X,
  ChevronLeft, BookOpen,
} from 'lucide-react';

const categories = ['all', 'textile', 'art', 'music', 'dance', 'food', 'craft'];
const categoryLabels: Record<string, { EN: string; ID: string }> = {
  all: { EN: 'All', ID: 'Semua' },
  textile: { EN: 'Textiles', ID: 'Tekstil' },
  art: { EN: 'Art', ID: 'Seni' },
  music: { EN: 'Music', ID: 'Musik' },
  dance: { EN: 'Dance', ID: 'Tari' },
  food: { EN: 'Food', ID: 'Makanan' },
  craft: { EN: 'Crafts', ID: 'Kerajinan' },
};

export function GalleryPage() {
  const { language, learningStyle } = useApp();
  const { speak, stop, speaking } = useTTS();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<typeof content.gallery[0] | null>(null);

  const filtered = useMemo(() => {
    return content.gallery.filter((item) => {
      const matchCategory = category === 'all' || item.category === category;
      const name = t(item.name, language).toLowerCase();
      const matchSearch = !search || name.includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, category, language]);

  const handleListen = (text: string) => {
    if (speaking) {
      stop();
    } else {
      speak(text, language === 'EN' ? 'en-US' : 'id-ID');
    }
  };

  // Detail view
  if (selected) {
    const item = selected;
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-ink-400 hover:text-white mb-6"
        >
          <ChevronLeft size={20} /> {language === 'EN' ? 'Back to gallery' : 'Kembali ke galeri'}
        </button>

        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-float">{item.emoji}</div>
          <h1 className="text-4xl font-display font-black text-white mb-2">{t(item.name, language)}</h1>
          <div className="flex items-center justify-center gap-2 text-ink-400">
            <MapPin size={16} /> {t(item.region, language)}
          </div>
        </div>

        {/* Image placeholder */}
        <Card className="mb-6">
          <div className="aspect-video bg-gradient-to-br from-batik-600/30 via-ink-800 to-neon-blue/20 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 batik-bg opacity-30" />
            <div className="text-8xl">{item.emoji}</div>
          </div>
        </Card>

        {/* Description */}
        <Card className="mb-6">
          <h3 className="text-lg font-display font-bold text-white flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-batik-400" />
            {language === 'EN' ? 'About' : 'Tentang'}
          </h3>
          <p className="text-ink-200 leading-relaxed">{t(item.desc, language)}</p>
        </Card>

        {/* Auditory: podcast-style audio explanation */}
        {learningStyle === 'Auditory' && (
          <Card className="mb-6 border-l-4 border-l-neon-green">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2 mb-3">
              <Volume2 size={18} className="text-neon-green" />
              {language === 'EN' ? 'Podcast Explanation' : 'Penjelasan Podcast'}
            </h3>
            <p className="text-sm text-ink-400 mb-4">
              {language === 'EN'
                ? 'A friendly host explains the story, meaning, and history behind this piece.'
                : 'Seorang host ramah menjelaskan kisah, makna, dan sejarah di balik karya ini.'}
            </p>
            {/* Audio player mock */}
            <div className="bg-ink-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => handleListen(t(item.desc, language))}
                  className="w-12 h-12 rounded-full bg-neon-green/20 border-2 border-neon-green flex items-center justify-center text-neon-green hover:bg-neon-green/30 transition-colors"
                  aria-label={speaking ? 'Pause' : 'Play'}
                >
                  {speaking ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-ink-400 mb-1">
                    <span>0:00</span>
                    <span>2:30</span>
                  </div>
                  <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-neon-green rounded-full transition-all ${speaking ? 'w-1/3' : 'w-0'}`} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-500">Speed:</span>
                {['0.5x', '1x', '1.5x', '2x'].map((speed) => (
                  <button
                    key={speed}
                    className="px-2 py-0.5 text-xs rounded bg-ink-700 text-ink-300 hover:bg-ink-600"
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-ink-500 mt-2">
              {language === 'EN'
                ? 'Uses browser text-to-speech. Real version would have professional recordings.'
                : 'Menggunakan text-to-speech browser. Versi nyata akan memiliki rekaman profesional.'}
            </p>
          </Card>
        )}

        {/* Visual: tap to zoom hint */}
        {learningStyle === 'Visual' && (
          <Card className="mb-6 border-l-4 border-l-neon-blue">
            <p className="text-ink-300 text-sm">
              {language === 'EN'
                ? '🖼️ Visual mode: Picture-first browsing. Tap any image to zoom in for detail.'
                : '🖼️ Mode Visual: Penjelajahan gambar-di-depan. Ketuk gambar untuk perbesar detail.'}
            </p>
          </Card>
        )}

        {/* Kinesthetic: Try it activity */}
        {learningStyle === 'Kinesthetic' && (
          <Card className="mb-6 border-l-4 border-l-neon-pink">
            <h3 className="text-lg font-display font-bold text-white mb-2">
              {language === 'EN' ? 'Try It!' : 'Coba!'}
            </h3>
            <p className="text-ink-300 text-sm mb-3">
              {item.category === 'textile'
                ? language === 'EN'
                  ? 'Design your own batik pattern in the Batik Designer!'
                  : 'Rancang pola batikmu sendiri di Batik Designer!'
                : language === 'EN'
                ? 'Draw this on paper and show it to a friend!'
                : 'Gambar ini di kertas dan tunjukkan ke teman!'}
            </p>
            <Button size="sm" variant="neon-pink" onClick={() => {}}>
              {language === 'EN' ? 'Open Batik Designer' : 'Buka Batik Designer'}
            </Button>
          </Card>
        )}

        {/* Source */}
        <div className="text-xs text-ink-500 flex items-center gap-2">
          <span>📚</span>
          {language === 'EN'
            ? 'Source: Cultural institution reference. Learn more / ask your elders.'
            : 'Sumber: Referensi institusi budaya. Pelajari lebih lanjut / tanyakan ke tetua.'}
        </div>
      </div>
    );
  }

  // Gallery grid
  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
          <Frame className="text-neon-pink" /> {language === 'EN' ? 'Art & Culture Gallery' : 'Galeri Seni & Budaya'}
        </h1>
        <p className="text-ink-400 mt-1">
          {language === 'EN'
            ? 'Explore Indonesian art, textiles, music, dance, food, and crafts.'
            : 'Jelajahi seni, tekstil, musik, tari, makanan, dan kerajinan Indonesia.'}
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'EN' ? 'Search gallery...' : 'Cari galeri...'}
            className="w-full bg-ink-800 border border-ink-600 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-neon-pink"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/40'
                  : 'bg-ink-800 text-ink-400 border border-ink-700 hover:text-white'
              }`}
            >
              {t(categoryLabels[cat], language)}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-500">
          <div className="text-5xl mb-3">🔍</div>
          <p>{language === 'EN' ? 'No results found. Try a different search!' : 'Tidak ada hasil. Coba pencarian lain!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((item) => (
            <Card key={item.id} onClick={() => setSelected(item)} className="text-center group">
              <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">{item.emoji}</div>
              <h3 className="text-sm font-display font-bold text-white">{t(item.name, language)}</h3>
              <p className="text-xs text-ink-500 mt-1">{t(item.region, language)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
