import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthScreen } from '@/components/AuthScreen';
import { AgeCheck } from '@/components/AgeCheck';
import { Layout } from '@/components/Layout';
import { AIAssistant } from '@/components/AIAssistant';
import { HomePage } from '@/pages/HomePage';
import { LegendsPage } from '@/pages/LegendsPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { LanguagePage } from '@/pages/LanguagePage';
import { CommunityPage } from '@/pages/CommunityPage';
import { DancePage } from '@/pages/DancePage';
import { OutfitPage } from '@/pages/OutfitPage';
import { TakeItIRLPage } from '@/pages/TakeItIRLPage';
import { ClubsPage } from '@/pages/ClubsPage';
import { ImpactPage } from '@/pages/ImpactPage';
import { ModeratorPage } from '@/pages/ModeratorPage';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { ageGroup, currentPage } = useApp();
  const { user, loading, restoring } = useAuth();

  // When the "Why" page is selected, render the homepage and scroll to the section
  useEffect(() => {
    if (currentPage === 'why') {
      const section = document.getElementById('why-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentPage]);

  // 1. Supabase is resolving the session — show a branded loader.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900 batik-bg">
        <div className="text-center">
          <h1 className="text-4xl font-display font-black text-white mb-4">
            Cultur<span className="shimmer-text">Ind</span>.ai
          </h1>
          <Loader2 size={32} className="animate-spin text-batik-400 mx-auto" />
        </div>
      </div>
    );
  }

  // 2. Not logged in — show the email auth screen.
  if (!user) {
    return <AuthScreen />;
  }

  // 3. Logged in but restoring progress — brief loader so we don't flash
  //    default state before the saved state arrives.
  if (restoring) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900 batik-bg">
        <div className="text-center">
          <h1 className="text-4xl font-display font-black text-white mb-4">
            Cultur<span className="shimmer-text">Ind</span>.ai
          </h1>
          <Loader2 size={32} className="animate-spin text-batik-400 mx-auto" />
          <p className="text-ink-400 text-sm mt-3">Restoring your progress…</p>
        </div>
      </div>
    );
  }

  // 4. Logged in but hasn't completed birthday onboarding yet.
  if (!ageGroup) {
    return <AgeCheck />;
  }

  // Moderator dashboard is a standalone private page (no public layout/header)
  if (currentPage === 'moderator') {
    return <ModeratorPage />;
  }

  // All other pages use the standard layout with header, nav, footer
  return (
    <Layout>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'legends' && <LegendsPage />}
      {currentPage === 'gallery' && <GalleryPage />}
      {currentPage === 'language' && <LanguagePage />}
      {currentPage === 'community' && <CommunityPage />}
      {currentPage === 'dance' && <DancePage />}
      {currentPage === 'outfit' && <OutfitPage />}
      {currentPage === 'takeitirl' && <TakeItIRLPage />}
      {currentPage === 'clubs' && <ClubsPage />}
      {currentPage === 'impact' && <ImpactPage />}
      {(currentPage === 'why' || currentPage === 'home') && <HomePage />}
      <AIAssistant />
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
