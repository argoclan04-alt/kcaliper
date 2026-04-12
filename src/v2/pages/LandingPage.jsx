import { useEffect } from 'react';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import CalibotDemo from '../components/landing/CalibotDemo';
import ProblemSolution from '../components/landing/ProblemSolution';
import FeaturesSection from '../components/landing/FeaturesSection';
import InteractiveTrend from '../components/landing/InteractiveTrend';
import PricingSection from '../components/landing/PricingSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';
import GlobalFloatingMessages from '../components/landing/GlobalFloatingMessages';
import FomoBanner from '../components/landing/FomoBanner';
import SocialProofWidget from '../components/landing/SocialProofWidget';

const LandingPage = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-black relative" data-testid="landing-page">
      {/* Global floating messages throughout the page */}
      <GlobalFloatingMessages type="athlete" />
      
      {/* FOMO Banner above header */}
      <FomoBanner type="athlete" />
      
      <Header />
      <main>
        <HeroSection />
        <CalibotDemo />
        <ProblemSolution />
        <FeaturesSection />
        <InteractiveTrend />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      {/* Dynamic Social Proof Widget */}
      <SocialProofWidget />
    </div>
  );
};

export default LandingPage;
