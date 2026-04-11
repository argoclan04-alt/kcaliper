import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Clock, Users } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PricingSection = () => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    mins: 32,
    secs: 45,
  });
  const [spotsLeft, setSpotsLeft] = useState(127);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        
        secs--;
        if (secs < 0) { secs = 59; mins--; }
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) return prev;
        
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate spots decreasing
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && spotsLeft > 50) {
        setSpotsLeft(prev => prev - 1);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [spotsLeft]);

  const plans = [
    {
      key: 'athlete',
      featured: false,
    },
    {
      key: 'coach',
      featured: true,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00D2FF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 mb-6">
            <Zap className="w-4 h-4 text-[#00D2FF]" />
            <span className="text-[#00D2FF] text-sm font-semibold tracking-widest uppercase">
              {t('pricing.badge')}
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        {/* FOMO Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
        >
          {/* Spots Left */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-red-500/10 border border-red-500/30">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-red-400 font-bold text-lg">{spotsLeft}</span>
            <span className="text-red-400/70 text-sm">{t('pricing.spotsLeft')}</span>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00D2FF]" />
            <span className="text-white/60 text-sm">{t('pricing.countdown')}:</span>
            <div className="flex items-center gap-1">
              {[
                { value: timeLeft.days, label: t('pricing.days') },
                { value: timeLeft.hours, label: t('pricing.hours') },
                { value: timeLeft.mins, label: t('pricing.mins') },
                { value: timeLeft.secs, label: t('pricing.secs') },
              ].map((unit, i) => (
                <div key={i} className="flex items-center">
                  <div className="bg-white/10 px-2 py-1 rounded text-white font-mono font-bold">
                    {String(unit.value).padStart(2, '0')}
                  </div>
                  <span className="text-white/40 text-xs ml-0.5 mr-1">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const planData = t(`pricing.plans.${plan.key}`);
            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl ${
                  plan.featured
                    ? 'bg-[#0A0A0A] border-2 border-[#00D2FF]/50 shadow-[0_0_40px_rgba(0,210,255,0.15)]'
                    : 'bg-[#0A0A0A] border border-white/10'
                }`}
                data-testid={`pricing-${plan.key}`}
              >
                {/* Popular Badge */}
                {plan.featured && planData.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 rounded-full bg-[#00D2FF] text-black text-xs font-bold uppercase tracking-wider">
                      {planData.badge}
                    </div>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-white font-semibold text-xl mb-4">{planData.name}</h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black text-white">{planData.price}</span>
                  <span className="text-white/50">{planData.period}</span>
                  <span className="text-white/30 line-through text-lg ml-2">{planData.originalPrice}</span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {planData.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#00D2FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#00D2FF]" />
                      </div>
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    plan.featured
                      ? 'bg-[#00D2FF] text-black hover:bg-[#33DBFF] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)]'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                  data-testid={`pricing-cta-${plan.key}`}
                  onClick={() => {
                     // Conexión con Stripe Webhooks
                     if (plan.key === 'athlete') window.location.href = "https://buy.stripe.com/test_5kQdR95rtgQLeDd7qO04805";
                     if (plan.key === 'coach') window.location.href = "https://buy.stripe.com/test_aFa8wP8DF0RN52D5iG04803";
                  }}
                >
                  {t('pricing.cta')}
                </motion.button>

                {/* Glowing border effect for featured */}
                {plan.featured && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00D2FF]/10 via-transparent to-[#00D2FF]/10 pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-6 mt-12 text-white/40 text-sm"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Cancela cuando quieras</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>14 días de prueba</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Soporte 24/7</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
