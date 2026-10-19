import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, AIBadge } from '@/components/ui';
import { content, t } from '@/data/content';
import {
  Shirt, Sparkles, RefreshCw, BookOpen, MapPin,
  Check, Info,
} from 'lucide-react';

const outfitStyles = [
  { id: 'streetwear', name: { EN: 'Streetwear', ID: 'Streetwear' }, emoji: '🧥' },
  { id: 'formal', name: { EN: 'Formal', ID: 'Formal' }, emoji: '👔' },
  { id: 'casual', name: { EN: 'Casual', ID: 'Kasual' }, emoji: '👕' },
  { id: 'festive', name: { EN: 'Festive', ID: 'Festif' }, emoji: '🥻' },
];

const culturalElements = [
  { id: 'batik-parang', name: { EN: 'Batik Parang', ID: 'Batik Parang' }, meaning: { EN: 'Strength and resilience — the diagonal wave pattern represents the ocean.', ID: 'Kekuatan dan ketahanan — pola gelombang diagonal mewakili lautan.' } },
  { id: 'songket-gold', name: { EN: 'Songket Gold Thread', ID: 'Benang Emas Songket' }, meaning: { EN: 'Wealth and nobility — gold threads woven into fabric for special occasions.', ID: 'Kekayaan dan kebangsawanan — benang emas ditenun ke kain untuk acara khusus.' } },
  { id: 'tenun-geometric', name: { EN: 'Tenun Geometric', ID: 'Tenun Geometris' }, meaning: { EN: 'Ancestral stories — each geometric pattern tells a clan\'s history.', ID: 'Kisah leluhur — setiap pola geometris menceritakan sejarah klan.' } },
  { id: 'wayang-motif', name: { EN: 'Wayang Motif', ID: 'Motif Wayang' }, meaning: { EN: 'Wisdom and storytelling — inspired by shadow puppet characters.', ID: 'Kebijaksanaan dan penceritaan — terinspirasi dari karakter wayang.' } },
];

export function OutfitPage() {
  const { language, isCreator, addPoints } = useApp();
  const [selectedLegend, setSelectedLegend] = useState(content.legends[0]);
  const [selectedStyle, setSelectedStyle] = useState(outfitStyles[0]);
  const [selectedElement, setSelectedElement] = useState(culturalElements[0]);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      addPoints(10);
    }, 2000);
  };

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
          <Shirt className="text-neon-blue" /> {language === 'EN' ? 'Outfit Studio' : 'Studio Outfit'}
        </h1>
        <p className="text-ink-400 mt-1">
          {language === 'EN'
            ? 'Pick a legend and style. Get an AI-generated outfit with cultural meaning explained.'
            : 'Pilih legenda dan gaya. Dapatkan outfit AI dengan makna budaya dijelaskan.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* Legend selector */}
          <Card>
            <h3 className="font-display font-bold text-white mb-3">
              {language === 'EN' ? 'Choose a Legend' : 'Pilih Legenda'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {content.legends.map((legend) => (
                <button
                  key={legend.id}
                  onClick={() => setSelectedLegend(legend)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedLegend.id === legend.id
                      ? 'border-neon-blue bg-neon-blue/10'
                      : 'border-ink-600 hover:border-ink-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{legend.emoji}</div>
                  <p className="text-sm font-medium text-white">{t(legend.title, language)}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Style selector */}
          <Card>
            <h3 className="font-display font-bold text-white mb-3">
              {language === 'EN' ? 'Choose a Style' : 'Pilih Gaya'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {outfitStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    selectedStyle.id === style.id
                      ? 'border-neon-pink bg-neon-pink/10'
                      : 'border-ink-600 hover:border-ink-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{style.emoji}</div>
                  <p className="text-sm font-medium text-white">{t(style.name, language)}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Cultural element selector */}
          <Card>
            <h3 className="font-display font-bold text-white mb-3">
              {language === 'EN' ? 'Cultural Element' : 'Elemen Budaya'}
            </h3>
            <div className="space-y-2">
              {culturalElements.map((el) => (
                <button
                  key={el.id}
                  onClick={() => setSelectedElement(el)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    selectedElement.id === el.id
                      ? 'border-neon-green bg-neon-green/10'
                      : 'border-ink-600 hover:border-ink-500'
                  }`}
                >
                  <p className="text-sm font-medium text-white">{t(el.name, language)}</p>
                  <p className="text-xs text-ink-400 mt-0.5">{t(el.meaning, language)}</p>
                </button>
              ))}
            </div>
          </Card>

          <Button
            variant="neon-blue"
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <><RefreshCw size={20} className="animate-spin" /> {language === 'EN' ? 'Generating...' : 'Membuat...'}</>
            ) : (
              <><Sparkles size={20} /> {language === 'EN' ? 'Generate Outfit' : 'Buat Outfit'}</>
            )}
          </Button>
        </div>

        {/* Preview */}
        <div>
          <Card className="sticky top-32">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-white">
                {language === 'EN' ? 'Preview' : 'Pratinjau'}
              </h3>
              {generated && <AIBadge />}
            </div>

            <div className="aspect-[3/4] bg-gradient-to-br from-batik-600/30 via-ink-800 to-neon-blue/20 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 batik-bg opacity-30" />

              {generating && (
                <div className="text-center">
                  <div className="text-6xl animate-pulse-slow">🎨</div>
                  <p className="text-ink-400 text-sm mt-3">{language === 'EN' ? 'Creating your outfit...' : 'Membuat outfit kamu...'}</p>
                </div>
              )}

              {generated && !generating && (
                <div className="text-center animate-fade-in">
                  <div className="text-7xl mb-3">{selectedStyle.emoji}</div>
                  <div className="text-3xl mb-2">{selectedLegend.emoji}</div>
                  <div className="text-xs text-ink-400 px-4">
                    {t(selectedStyle.name, language)} × {t(selectedElement.name, language)}
                  </div>
                </div>
              )}

              {!generated && !generating && (
                <div className="text-center text-ink-500">
                  <Shirt size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{language === 'EN' ? 'Pick your options and generate!' : 'Pilih opsi dan buat!'}</p>
                </div>
              )}
            </div>

            {/* Cultural meaning explanation */}
            {generated && (
              <div className="mt-4 space-y-3 animate-fade-in">
                <div className="p-3 bg-ink-800 rounded-lg">
                  <h4 className="text-sm font-bold text-neon-blue mb-1 flex items-center gap-2">
                    <BookOpen size={14} /> {t(selectedElement.name, language)}
                  </h4>
                  <p className="text-xs text-ink-300">{t(selectedElement.meaning, language)}</p>
                </div>
                <div className="p-3 bg-ink-800 rounded-lg">
                  <h4 className="text-sm font-bold text-batik-400 mb-1 flex items-center gap-2">
                    <MapPin size={14} /> {t(selectedLegend.title, language)}
                  </h4>
                  <p className="text-xs text-ink-300">
                    {language === 'EN'
                      ? `Inspired by the legend from ${t(selectedLegend.region, 'EN')}. The design blends the story's spirit with ${t(selectedStyle.name, 'EN')} fashion.`
                      : `Terinspirasi dari legenda ${t(selectedLegend.region, 'ID')}. Desain ini memadukan semangat cerita dengan mode ${t(selectedStyle.name, 'ID')}.`}
                  </p>
                </div>
                <div className="p-3 bg-neon-yellow/5 rounded-lg border border-neon-yellow/20">
                  <p className="text-xs text-neon-yellow flex items-start gap-2">
                    <Info size={14} className="flex-shrink-0 mt-0.5" />
                    {language === 'EN'
                      ? 'This outfit uses illustrated avatars only. Sacred and ceremonial symbols are treated with respect.'
                      : 'Outfit ini hanya menggunakan avatar ilustrasi. Simbol sakral dan seremonial diperlakukan dengan hormat.'}
                  </p>
                </div>
                {isCreator && (
                  <Button size="sm" variant="neon-pink" className="w-full">
                    <Sparkles size={14} /> {language === 'EN' ? 'Share to Community' : 'Bagikan ke Komunitas'}
                  </Button>
                )}
              </div>
            )}

            <p className="text-xs text-ink-500 mt-3 text-center">
              {language === 'EN'
                ? 'AI-generated outfit placeholder. Real version would create a custom illustration.'
                : 'Placeholder outfit AI. Versi nyata akan membuat ilustrasi kustom.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
