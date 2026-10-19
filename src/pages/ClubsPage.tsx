import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button } from '@/components/ui';
import { content, t } from '@/data/content';
import {
  Flag, Users, Pin, Sparkles, Plus, Lock, Heart, CheckCircle,
} from 'lucide-react';

export function ClubsPage() {
  const { language, isCreator, setProfile, profile, addPoints } = useApp();
  const [selectedClub, setSelectedClub] = useState<typeof content.clubs[0] | null>(null);

  const handleJoin = (clubId: string) => {
    if (!isCreator) return;
    setProfile({ favoriteClub: clubId });
    addPoints(5);
  };

  // Sample club posts
  const clubPosts: Record<string, { author: string; text: string; likes: number; time: string; pinned?: boolean }[]> = {
    'batik-lovers': [
      { author: 'BatikDreamer', text: 'Weekly Challenge: Create a batik pattern inspired by your hometown! Post your designs by Friday 🎨', likes: 34, time: '2h', pinned: true },
      { author: 'PatternPro', text: 'Did you know Parang motif was once only worn by royalty? Now anyone can wear it — that\'s democracy in fashion!', likes: 18, time: '5h' },
      { author: 'SongketStar', text: 'Poll: Which textile is your favorite? Batik, Songket, or Tenun?', likes: 22, time: '1d' },
    ],
    'traditional-dance': [
      { author: 'DanceStar', text: 'Pinned: This week\'s challenge — learn the first 4 steps of Tari Saman and share your experience!', likes: 45, time: '3h', pinned: true },
      { author: 'MoveMaster', text: 'Got 3 stars on Pendet in Move Mode! The arm movements are so graceful 💃', likes: 12, time: '6h' },
    ],
    'legends': [
      { author: 'CultureKid', text: 'My grandma told me a version of Malin Kundang where he actually apologized but the curse was already cast. So sad 😢', likes: 67, time: '1h' },
      { author: 'StoryLover', text: 'Weekly challenge: Retell your favorite legend in your own words! Best story gets featured.', likes: 28, time: '4h', pinned: true },
    ],
    'regional-languages': [
      { author: 'WordNerd', text: 'Did you know "matur suksma" means thank you in Balinese? What\'s your regional word for thank you?', likes: 19, time: '2h' },
      { author: 'JavaneseKid', text: 'In Javanese there are 3 levels of formality — ngoko, krama, and krama inggil. So complex but so cool!', likes: 31, time: '8h' },
    ],
    'culture-x-global': [
      { author: 'StreetStyleID', text: 'Made a hoodie with Kawung batik motifs. Culture x Global baby! 🔥', likes: 89, time: '3h', pinned: true },
      { author: 'RemixQueen', text: 'Challenge: Mix a traditional Indonesian element with your favorite global trend. Show your remix!', likes: 52, time: '1d' },
    ],
  };

  // Club detail view
  if (selectedClub) {
    const club = selectedClub;
    const posts = clubPosts[club.id] || [];
    const isMember = profile.favoriteClub === club.id;

    return (
      <div className="py-8 px-4 max-w-3xl mx-auto">
        <button
          onClick={() => setSelectedClub(null)}
          className="flex items-center gap-2 text-ink-400 hover:text-white mb-6"
        >
          ← {language === 'EN' ? 'Back to clubs' : 'Kembali ke klub'}
        </button>

        {/* Club header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-5xl">{club.emoji}</div>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-white">{t(club.name, language)}</h1>
            <p className="text-sm text-ink-400">{t(club.desc, language)}</p>
            <p className="text-xs text-ink-500 mt-1">{club.members} {language === 'EN' ? 'members' : 'anggota'}</p>
          </div>
          {isCreator && (
            <Button
              size="sm"
              variant={isMember ? 'secondary' : 'neon-pink'}
              onClick={() => handleJoin(club.id)}
              disabled={isMember}
            >
              {isMember
                ? <><CheckCircle size={14} /> {language === 'EN' ? 'Joined' : 'Bergabung'}</>
                : <><Plus size={14} /> {language === 'EN' ? 'Join' : 'Gabung'}</>}
            </Button>
          )}
        </div>

        {/* Mode notice for Explorer */}
        {!isCreator && (
          <Card className="mb-4 border-l-4 border-l-neon-blue">
            <p className="text-sm text-ink-300">
              {language === 'EN'
                ? 'Explorer mode: Clubs are read-only. You can react with emojis but can\'t post or comment. Join a club in Creator mode!'
                : 'Mode Explorer: Klub hanya bisa dibaca. Kamu bisa bereaksi dengan emoji tetapi tidak bisa posting atau berkomentar. Gabung klub di mode Creator!'}
            </p>
          </Card>
        )}

        {/* Pinned weekly challenge */}
        {posts.filter((p) => p.pinned).map((post, i) => (
          <Card key={`pin-${i}`} className="mb-4 border-l-4 border-l-neon-yellow">
            <div className="flex items-center gap-2 mb-2">
              <Pin size={14} className="text-neon-yellow" />
              <span className="text-xs font-bold text-neon-yellow uppercase">
                {language === 'EN' ? 'Pinned Weekly Challenge' : 'Tantangan Mingguan Dipinned'}
              </span>
            </div>
            <p className="text-white mb-2">{post.text}</p>
            <div className="flex items-center gap-3 text-xs text-ink-500">
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.time}</span>
              <span className="flex items-center gap-1"><Heart size={12} /> {post.likes}</span>
            </div>
          </Card>
        ))}

        {/* Club posts */}
        <div className="space-y-3">
          {posts.filter((p) => !p.pinned).map((post, i) => (
            <Card key={i}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-batik-400 flex items-center justify-center text-sm font-bold text-white">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{post.author}</p>
                  <p className="text-xs text-ink-500">{post.time}</p>
                </div>
              </div>
              <p className="text-ink-200 mb-3">{post.text}</p>
              <div className="flex items-center gap-3 text-sm text-ink-400">
                <button className="flex items-center gap-1 hover:text-neon-pink">
                  <Heart size={14} /> {post.likes}
                </button>
                {isCreator && (
                  <button className="hover:text-white">{language === 'EN' ? 'Comment' : 'Komentar'}</button>
                )}
                <button className="hover:text-neon-pink">{language === 'EN' ? 'Report' : 'Laporkan'}</button>
              </div>
            </Card>
          ))}
        </div>

        {/* Suggest new topic (Creator) */}
        {isCreator && (
          <Card className="mt-6 text-center">
            <Sparkles className="text-neon-pink mx-auto mb-2" size={24} />
            <p className="text-sm text-ink-300 mb-3">
              {language === 'EN' ? 'Have an idea for a new club? Suggest it!' : 'Punya ide klub baru? Sarankan!'}
            </p>
            <Button size="sm" variant="neon-pink">
              <Plus size={14} /> {language === 'EN' ? 'Suggest a Club' : 'Sarankan Klub'}
            </Button>
          </Card>
        )}
      </div>
    );
  }

  // Club list
  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
          <Flag className="text-batik-400" /> {language === 'EN' ? 'Culture Clubs' : 'Klub Budaya'}
        </h1>
        <p className="text-ink-400 mt-1">
          {language === 'EN'
            ? 'Join communities of people who love the same parts of Indonesian culture.'
            : 'Bergabung dengan komunitas orang yang menyukai bagian budaya Indonesia yang sama.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {content.clubs.map((club) => (
          <Card key={club.id} onClick={() => setSelectedClub(club)} className="group">
            <div className="flex items-start gap-3">
              <div className="text-4xl group-hover:scale-110 transition-transform">{club.emoji}</div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-white">{t(club.name, language)}</h3>
                <p className="text-sm text-ink-400 mt-0.5">{t(club.desc, language)}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-ink-500">
                  <span className="flex items-center gap-1"><Users size={12} /> {club.members}</span>
                  {profile.favoriteClub === club.id && (
                    <span className="flex items-center gap-1 text-neon-green"><CheckCircle size={12} /> {language === 'EN' ? 'Joined' : 'Bergabung'}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
