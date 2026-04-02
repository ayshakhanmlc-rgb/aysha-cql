import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PartyProvider } from '@/contexts/PartyContext';
import Onboarding, { type OnboardingData } from '@/components/onboarding/Onboarding';
import SplashVideo from '@/components/SplashVideo';
import HeroLanding from '@/components/HeroLanding';
import VideoIntro from '@/components/VideoIntro';
import MainNavBar from '@/components/MainNavBar';
import GameMap from '@/components/map/GameMap';

type EntryPhase = 'splash' | 'hero' | 'video' | 'onboarding' | 'app';

const Index = () => {
  const [searchParams] = useSearchParams();
  const skipIntro = searchParams.get('skip') || sessionStorage.getItem('fq_in_app');
  const [phase, setPhase] = useState<EntryPhase>(skipIntro ? 'app' : 'splash');

  const handleOnboardingComplete = (_data: OnboardingData) => {
    sessionStorage.setItem('fq_in_app', '1');
    setPhase('app');
  };

  if (phase === 'splash') {
    return <SplashVideo onComplete={() => setPhase('hero')} />;
  }

  if (phase === 'hero') {
    return <HeroLanding onStart={() => setPhase('video')} />;
  }

  if (phase === 'video') {
    return (
      <VideoIntro
        onComplete={() => setPhase('onboarding')}
      />
    );
  }

  if (phase === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <PartyProvider>
      <div className="relative w-full h-screen overflow-hidden bg-background">
        <div className="absolute inset-0">
          <GameMap />
        </div>
        <MainNavBar />
      </div>
    </PartyProvider>
  );
};

export default Index;
