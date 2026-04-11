import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useWaitlist } from '../../../hooks/useWaitlist';

const FinalCTA = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { submitEmail, loading } = useWaitlist();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    await submitEmail(email, 'athlete');
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <section id="waitlist" className="relative py-24 lg:py-32 bg-black overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00D2FF]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-[10%] w-20 h-20 bg-[#00D2FF]/5 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-1/4 right-[10%] w-32 h-32 bg-[#00D2FF]/5 rounded-full blur-xl"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            {t('cta.title')}
          </h2>
          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            {t('cta.subtitle')}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto"
        >
          {!submitted ? (
            <div className="relative">
              {/* Glowing border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00D2FF]/50 via-[#00D2FF] to-[#00D2FF]/50 rounded-2xl blur opacity-30" />
              
              <div className="relative flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-[#0A0A0A] border border-[#00D2FF]/30">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('cta.placeholder')}
                  className="flex-1 px-5 py-4 bg-transparent text-white placeholder-white/40 focus:outline-none text-base"
                  required
                  data-testid="cta-email-input"
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-[#00D2FF] text-black font-bold rounded-xl hover:bg-[#33DBFF] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid="cta-submit-btn"
                >
                  {isSubmitting ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <>
                      {t('cta.button')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-[#00D2FF]/10 border border-[#00D2FF]/30"
            >
              <Sparkles className="w-12 h-12 text-[#00D2FF] mx-auto mb-4" />
              <p className="text-[#00D2FF] font-semibold text-xl">
                ¡Bienvenido al futuro! Te contactaremos pronto. 🚀
              </p>
            </motion.div>
          )}

          <p className="text-white/40 text-sm mt-4">
            {t('cta.privacy')}
          </p>
          
          <div className="mt-8">
            <Link 
              to="/onboarding"
              className="text-[#00D2FF]/60 hover:text-[#00D2FF] text-sm font-medium transition-colors"
            >
              {language === 'es' ? 'O crea tu cuenta gratis ahora →' : 'Or create your free account now →'}
            </Link>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default FinalCTA;
