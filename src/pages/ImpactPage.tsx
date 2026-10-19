import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui';
import { BarChart3, TrendingUp, Users, ScrollText, PersonStanding, Home } from 'lucide-react';

export function ImpactPage() {
  const { language, impactCounts } = useApp();

  const items = [
    { icon: Home, color: 'text-neon-green', bg: 'bg-neon-green/10', value: impactCounts.familyConversations, label: { EN: 'Family Conversations Started', ID: 'Percakapan Keluarga Dimulai' }, desc: { EN: 'Every time someone completes a Take It IRL challenge and talks to their family.', ID: 'Setiap kali seseorang menyelesaikan tantangan Take It IRL dan berbicara dengan keluarga.' } },
    { icon: ScrollText, color: 'text-neon-blue', bg: 'bg-neon-blue/10', value: impactCounts.legendsExplored, label: { EN: 'Legends Explored', ID: 'Legenda Dijelajahi' }, desc: { EN: 'Total legends read and explored by the community.', ID: 'Total legenda dibaca dan dijelajahi oleh komunitas.' } },
    { icon: PersonStanding, color: 'text-neon-pink', bg: 'bg-neon-pink/10', value: impactCounts.danceStepsPracticed, label: { EN: 'Dance Steps Practiced', ID: 'Langkah Tari Dipraktikkan' }, desc: { EN: 'Every dance step practiced in the Dance Studio.', ID: 'Setiap langkah tari yang dipraktikkan di Studio Tari.' } },
  ];

  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-display font-bold text-white flex items-center justify-center gap-2">
          <BarChart3 className="text-neon-green" /> {language === 'EN' ? 'Our Impact' : 'Dampak Kita'}
        </h1>
        <p className="text-ink-400 mt-2 max-w-xl mx-auto">
          {language === 'EN'
            ? 'See how CulturInd.ai is helping young Indonesians reconnect with their culture — one conversation, one legend, one dance at a time.'
            : 'Lihat bagaimana CulturInd.ai membantu pemuda Indonesia terhubung kembali dengan budaya mereka — satu percakapan, satu legenda, satu tari pada satu waktu.'}
        </p>
      </div>

      {/* Total */}
      <Card className="mb-6 text-center bg-gradient-to-br from-batik-400/10 to-transparent">
        <div className="text-5xl font-display font-black shimmer-text mb-2">
          {total.toLocaleString()}
        </div>
        <p className="text-ink-300">{language === 'EN' ? 'Total Actions' : 'Total Aksi'}</p>
      </Card>

      {/* Individual counters */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i} className="text-center">
              <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-3`}>
                <Icon className={item.color} size={28} />
              </div>
              <div className={`text-3xl font-display font-black ${item.color} animate-fade-in`}>
                {item.value.toLocaleString()}
              </div>
              <p className="text-sm text-white font-medium mt-2">{item.label[language]}</p>
              <p className="text-xs text-ink-500 mt-1">{item.desc[language]}</p>
            </Card>
          );
        })}
      </div>

      {/* Privacy note */}
      <Card className="border-l-4 border-l-neon-blue">
        <div className="flex items-start gap-3">
          <Users className="text-neon-blue flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm text-ink-200">
              {language === 'EN'
                ? 'These numbers are anonymous totals only. No names, no profiles, no personal data. Just the impact we\'re making together.'
                : 'Angka ini adalah total anonim saja. Tanpa nama, tanpa profil, tanpa data pribadi. Hanya dampak yang kita buat bersama.'}
            </p>
          </div>
        </div>
      </Card>

      <p className="text-center text-ink-500 text-xs mt-6">
        {language === 'EN' ? 'Demo numbers — updates as you complete challenges.' : 'Angka demo — diperbarui saat kamu menyelesaikan tantangan.'}
      </p>
    </div>
  );
}
