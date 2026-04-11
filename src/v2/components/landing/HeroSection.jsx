import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import ParticleBackground from './ParticleBackground';
import { useWaitlist } from '../../../hooks/useWaitlist';

const HeroSection = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [waitlistCount, setWaitlistCount] = useState(847);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { submitEmail, loading } = useWaitlist();

  // Simulate live counter
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setWaitlistCount(prev => prev + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    await submitEmail(email, 'athlete');
    setSubmitted(true);
    setWaitlistCount(prev => prev + 1);
    setIsSubmitting(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20 lg:pt-0">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00D2FF]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#00D2FF]" />
            <span className="text-[#00D2FF] text-sm font-semibold tracking-widest uppercase">
              {t('hero.badge')}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6"
          >
            {t('hero.title')}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] to-[#00D2FF]/70">
                {t('hero.titleHighlight')}
              </span>
              <motion.span
                className="absolute inset-0 bg-[#00D2FF]/20 blur-2xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </span>
            <br />
            {t('hero.titleEnd')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl mx-auto mb-8 flex flex-col gap-4"
          >
            {!submitted ? (
              <>
                <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('hero.placeholder')}
                    className="flex-1 px-5 py-4 bg-transparent text-white placeholder-white/40 focus:outline-none text-base"
                    required
                    data-testid="hero-email-input"
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-[#00D2FF] text-black font-bold rounded-xl hover:bg-[#33DBFF] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="hero-submit-btn"
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : (
                      <>
                        {t('hero.cta')}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
                
                <div className="flex items-center justify-center gap-4">
                  <Link 
                    to="/onboarding"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/10"
                  >
                    {language === 'es' ? 'O comenzar mi perfil ahora' : 'Or start my profile now'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-[#00D2FF]/10 border border-[#00D2FF]/30"
              >
                <p className="text-[#00D2FF] font-semibold text-lg">
                  ¡Estás en la lista! Te contactaremos pronto. 🎉
                </p>
                <Link to="/onboarding" className="mt-4 inline-block text-white/60 hover:text-white text-sm underline underline-offset-4 decoration-[#00D2FF]/30">
                  {language === 'es' ? '¿Quieres empezar ya?' : 'Want to start now?'}
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Live Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-6 flex-wrap"
          >
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D2FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D2FF]" />
              </span>
              <span className="text-white font-mono font-bold text-lg" data-testid="waitlist-counter">
                {waitlistCount.toLocaleString()}
              </span>
              <span className="text-white/50 text-sm">{t('hero.liveCounter')}</span>
            </div>

            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Users className="w-4 h-4" />
              <span>{t('hero.trustedBy')} <span className="text-white font-semibold">{t('hero.countries')}</span></span>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { value: '99%', label: 'Precisión DEMA' },
              { value: '24/7', label: 'CaliBot disponible' },
              { value: '2x', label: 'Retención de clientes' },
              { value: '<30s', label: 'Tiempo de registro' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00D2FF]/30 transition-colors group"
                whileHover={{ y: -4 }}
              >
                <div className="font-heading text-3xl lg:text-4xl font-black text-white group-hover:text-[#00D2FF] transition-colors">
                  {stat.value}
                </div>
                <div className="text-white/50 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
