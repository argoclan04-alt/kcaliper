import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Users, Bell, Camera, Target, Clock, Database, 
  CheckCircle, Zap, MessageSquare,
  BarChart3, AlertTriangle, UserCheck, ChevronRight, Star, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import ParticleBackground from './ParticleBackground';
import GlobalFloatingMessages from './GlobalFloatingMessages';
import FomoBanner from './FomoBanner';

const CoachesLandingPage = () => {
  const [language, setLanguage] = useState('es');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [coachCount, setCoachCount] = useState(312);
  const [spotsLeft, setSpotsLeft] = useState(88);
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 18, mins: 45, secs: 30 });

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

  // Simulate counters
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) setCoachCount(prev => prev + 1);
      if (Math.random() > 0.9 && spotsLeft > 20) setSpotsLeft(prev => prev - 1);
    }, 8000);
    return () => clearInterval(interval);
  }, [spotsLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
    setCoachCount(prev => prev + 1);
    setIsSubmitting(false);
  };

  const t = (key) => {
    const translations = {
      es: {
        banner: 'ACCESO COACH — Escala tu coaching con IA · Clientes ilimitados · $12.99/mes',
        bannerCta: 'Registrar mi equipo',
        badge: 'PARA COACHES Y NUTRICIONISTAS',
        heroTitle1: 'Deja de perseguir atletas.',
        heroTitle2: 'Kcaliper lo hace por ti.',
        heroSubtitle: 'Dashboard profesional con alertas inteligentes, seguimiento automatizado, y CaliBot que audita a tus atletas. Más tiempo para entrenar, menos tiempo persiguiendo datos.',
        heroCta: 'Solicitar Acceso Coach',
        heroPrice: '$12.99/mes · Clientes ilimitados',
        liveCoaches: 'coaches registrados',
        trustedBy: 'Usado por coaches en',
        countries: '12 países',
        
        problemTitle: 'Los problemas que resolvemos',
        problemSubtitle: 'El 67% de coaches pierden clientes por falta de seguimiento',
        problems: [
          { title: 'Persiguiendo Datos', desc: 'Pierdes horas enviando mensajes: "¿Te pesaste hoy?" sin respuesta.' },
          { title: 'Clientes Fantasma', desc: 'Atletas que desaparecen sin aviso. No sabes si abandonaron o están ocupados.' },
          { title: 'Análisis Manual', desc: 'Excel, WhatsApp, notas... datos dispersos que consumen tu tiempo.' }
        ],
        solutionTitle: 'Con Kcaliper',
        solutions: [
          { title: 'CaliBot Persigue Por Ti', desc: 'Recordatorios automáticos vía WhatsApp. Tú recibes los datos, no los persigues.' },
          { title: 'Alertas Inteligentes', desc: 'Notificaciones solo cuando un atleta se desvía. Sin ruido, solo acción.' },
          { title: 'Dashboard Unificado', desc: 'Todos tus atletas en una pantalla con métricas procesadas y listas.' }
        ],

        featuresTitle: 'Todo lo que necesitas para escalar',
        featuresSubtitle: 'Herramientas profesionales para coaches que quieren más tiempo y mejores resultados',
        features: [
          { icon: 'dashboard', title: 'Dashboard Unificado', desc: 'Todos tus atletas en una pantalla con métricas clave y estados de urgencia.' },
          { icon: 'bell', title: 'Alertas Inteligentes', desc: 'Notificaciones vía WhatsApp solo cuando un atleta se desvía de su objetivo.' },
          { icon: 'camera', title: 'Fotos de Progreso', desc: 'Solicita y recibe fotos organizadas automáticamente por atleta.' },
          { icon: 'target', title: 'Peso Objetivo', desc: 'Configura metas individuales y visualiza la tendencia vs. el objetivo.' },
          { icon: 'clock', title: 'Recordatorios Auto', desc: 'CaliBot hace el follow-up por ti para que se pesen diariamente.' },
          { icon: 'database', title: 'Historial Completo', desc: 'Acceso total a datos históricos con exportación a CSV.' }
        ],

        whatsappTitle: 'Todo en tu WhatsApp',
        whatsappSubtitle: 'Las notificaciones importantes van directo a tu WhatsApp para que tomes decisiones al instante',

        howItWorksTitle: 'Así de fácil funciona',
        steps: [
          { step: '1', title: 'Te suscribes como Coach', desc: '$12.99/mes por clientes ilimitados' },
          { step: '2', title: 'Invitas a tus atletas', desc: 'Ellos crean su cuenta ($3.99/mes)' },
          { step: '3', title: 'Gestionas desde el dashboard', desc: 'Todo centralizado, sin perseguir a nadie' }
        ],

        pricingBadge: 'PRECIO FUNDADOR',
        pricingTitle: 'Invierte menos de lo que cobras por 1 cliente',
        pricingSubtitle: 'El ROI más claro del mercado',
        spotsLeft: 'plazas fundador restantes',
        athletePlan: {
          name: 'Atleta Pro',
          price: '$3.99',
          period: '/mes',
          desc: 'Para tus clientes',
          features: ['Logbook personal', 'Análisis DEMA', 'CaliBot 24/7', 'Gráficos de tendencia']
        },
        coachPlan: {
          name: 'Coach Professional',
          price: '$12.99',
          period: '/mes',
          desc: 'Clientes ilimitados',
          popular: 'MÁS POPULAR',
          features: ['Dashboard centralizado', 'Alertas inteligentes', 'Auditoría con IA', 'Fotos de progreso', 'Peso objetivo por atleta', 'Soporte prioritario']
        },
        coachAnnual: {
          name: 'Coach Anual',
          price: '$8.32',
          period: '/mes',
          desc: 'Ahorra $55/año',
          features: ['Todo de Coach Pro', '2 meses gratis', 'Acceso beta features', 'Onboarding 1:1']
        },
        pricingCta: 'Reservar mi plaza',

        testimonialsTitle: 'Coaches que transformaron su negocio',
        testimonials: [
          { name: 'Roberto Martínez', role: 'Coach Online, 85 clientes', text: 'Antes perdía 3 horas diarias persiguiendo datos. Ahora Kcaliper me los entrega y puedo enfocarme en programar entrenamientos.' },
          { name: 'Ana Lucía Pérez', role: 'Nutricionista, Clínica Privada', text: 'Mis pacientes se sienten acompañados 24/7 con CaliBot. La retención aumentó 50% en 3 meses.' },
          { name: 'Diego Fernández', role: 'Preparador Físico, Perú', text: 'El dashboard me permite ver quién necesita atención. Ya no pierdo clientes por "falta de seguimiento".' }
        ],

        faqTitle: 'Preguntas de coaches',
        faqs: [
          { q: '¿Puedo probarlo antes de pagar?', a: 'Sí, ofrecemos 14 días de prueba gratuita con acceso completo al dashboard y todas las funcionalidades.' },
          { q: '¿Qué pasa si un atleta no paga?', a: 'El atleta necesita su propia suscripción ($3.99/mes). Si no paga, pierde acceso a CaliBot pero tú sigues viendo sus datos históricos.' },
          { q: '¿Las alertas van a mi WhatsApp personal?', a: 'Sí, conectas tu WhatsApp y recibes alertas solo de eventos importantes: desviaciones, hitos alcanzados, atletas inactivos.' },
          { q: '¿Puedo personalizar qué alertas recibo?', a: 'Absolutamente. Configuras umbrales por atleta y tipo de notificación. Tú controlas el nivel de ruido.' },
          { q: '¿Y si tengo más de 100 atletas?', a: 'El plan Coach Pro no tiene límite. Puedes tener 10 o 500 atletas por el mismo precio.' }
        ],

        ctaTitle: '¿Listo para escalar tu coaching?',
        ctaSubtitle: 'Únete a coaches que dejaron de perseguir y empezaron a liderar',
        ctaPlaceholder: 'Tu email profesional',
        ctaButton: 'Quiero Acceso Coach',
        ctaPrivacy: 'Sin spam. Cancelar cuando quieras.',

        footerTagline: 'El sistema nervioso central del coach moderno.',
        nav: { features: 'Funcionalidades', pricing: 'Precios', faq: 'FAQ' }
      },
      en: {
        banner: 'COACH ACCESS — Scale your coaching with AI · Unlimited clients · $12.99/mo',
        bannerCta: 'Register my team',
        badge: 'FOR COACHES AND NUTRITIONISTS',
        heroTitle1: 'Stop chasing athletes.',
        heroTitle2: 'Kcaliper does it for you.',
        heroSubtitle: 'Professional dashboard with smart alerts, automated tracking, and CaliBot that audits your athletes. More time to train, less time chasing data.',
        heroCta: 'Request Coach Access',
        heroPrice: '$12.99/mo · Unlimited clients',
        liveCoaches: 'registered coaches',
        trustedBy: 'Used by coaches in',
        countries: '12 countries',
        
        problemTitle: 'The problems we solve',
        problemSubtitle: '67% of coaches lose clients due to lack of follow-up',
        problems: [
          { title: 'Chasing Data', desc: 'You waste hours sending messages: "Did you weigh yourself today?" with no response.' },
          { title: 'Ghost Clients', desc: 'Athletes who disappear without notice. You don\'t know if they quit or are just busy.' },
          { title: 'Manual Analysis', desc: 'Excel, WhatsApp, notes... scattered data consuming your time.' }
        ],
        solutionTitle: 'With Kcaliper',
        solutions: [
          { title: 'CaliBot Chases For You', desc: 'Automatic WhatsApp reminders. You receive the data, you don\'t chase it.' },
          { title: 'Smart Alerts', desc: 'Notifications only when an athlete deviates. No noise, just action.' },
          { title: 'Unified Dashboard', desc: 'All your athletes on one screen with processed, ready metrics.' }
        ],

        featuresTitle: 'Everything you need to scale',
        featuresSubtitle: 'Professional tools for coaches who want more time and better results',
        features: [
          { icon: 'dashboard', title: 'Unified Dashboard', desc: 'All your athletes on one screen with key metrics and urgency states.' },
          { icon: 'bell', title: 'Smart Alerts', desc: 'WhatsApp notifications only when an athlete deviates from their goal.' },
          { icon: 'camera', title: 'Progress Photos', desc: 'Request and receive photos automatically organized by athlete.' },
          { icon: 'target', title: 'Goal Weight', desc: 'Set individual goals and visualize trend vs. target.' },
          { icon: 'clock', title: 'Auto Reminders', desc: 'CaliBot does the follow-up for you so they weigh daily.' },
          { icon: 'database', title: 'Complete History', desc: 'Full access to historical data with CSV export.' }
        ],

        whatsappTitle: 'Everything in your WhatsApp',
        whatsappSubtitle: 'Important notifications go straight to your WhatsApp so you can make instant decisions',

        howItWorksTitle: 'This easy it works',
        steps: [
          { step: '1', title: 'Subscribe as Coach', desc: '$12.99/mo for unlimited clients' },
          { step: '2', title: 'Invite your athletes', desc: 'They create their account ($3.99/mo)' },
          { step: '3', title: 'Manage from dashboard', desc: 'Everything centralized, no chasing' }
        ],

        pricingBadge: 'FOUNDER PRICING',
        pricingTitle: 'Invest less than you charge for 1 client',
        pricingSubtitle: 'The clearest ROI in the market',
        spotsLeft: 'founder spots remaining',
        athletePlan: {
          name: 'Athlete Pro',
          price: '$3.99',
          period: '/mo',
          desc: 'For your clients',
          features: ['Personal logbook', 'DEMA analysis', 'CaliBot 24/7', 'Trend charts']
        },
        coachPlan: {
          name: 'Coach Professional',
          price: '$12.99',
          period: '/mo',
          desc: 'Unlimited clients',
          popular: 'MOST POPULAR',
          features: ['Centralized dashboard', 'Smart alerts', 'AI audit', 'Progress photos', 'Goal weight per athlete', 'Priority support']
        },
        coachAnnual: {
          name: 'Coach Annual',
          price: '$8.32',
          period: '/mo',
          desc: 'Save $55/year',
          features: ['Everything in Coach Pro', '2 months free', 'Beta features access', '1:1 onboarding']
        },
        pricingCta: 'Reserve my spot',

        testimonialsTitle: 'Coaches who transformed their business',
        testimonials: [
          { name: 'Roberto Martínez', role: 'Online Coach, 85 clients', text: 'I used to lose 3 hours daily chasing data. Now Kcaliper delivers it and I can focus on programming workouts.' },
          { name: 'Ana Lucía Pérez', role: 'Nutritionist, Private Clinic', text: 'My patients feel supported 24/7 with CaliBot. Retention increased 50% in 3 months.' },
          { name: 'Diego Fernández', role: 'Physical Trainer, Peru', text: 'The dashboard lets me see who needs attention. I no longer lose clients due to "lack of follow-up".' }
        ],

        faqTitle: 'Coach questions',
        faqs: [
          { q: 'Can I try it before paying?', a: 'Yes, we offer a 14-day free trial with full access to the dashboard and all features.' },
          { q: 'What if an athlete doesn\'t pay?', a: 'The athlete needs their own subscription ($3.99/mo). If they don\'t pay, they lose CaliBot access but you still see their historical data.' },
          { q: 'Do alerts go to my personal WhatsApp?', a: 'Yes, you connect your WhatsApp and receive alerts only for important events: deviations, milestones reached, inactive athletes.' },
          { q: 'Can I customize which alerts I receive?', a: 'Absolutely. You configure thresholds per athlete and notification type. You control the noise level.' },
          { q: 'What if I have more than 100 athletes?', a: 'The Coach Pro plan has no limit. You can have 10 or 500 athletes for the same price.' }
        ],

        ctaTitle: 'Ready to scale your coaching?',
        ctaSubtitle: 'Join coaches who stopped chasing and started leading',
        ctaPlaceholder: 'Your professional email',
        ctaButton: 'I Want Coach Access',
        ctaPrivacy: 'No spam. Cancel anytime.',

        footerTagline: 'The central nervous system of the modern coach.',
        nav: { features: 'Features', pricing: 'Pricing', faq: 'FAQ' }
      }
    };
    return translations[language][key] || key;
  };

  // Floating elements for coaches - their thoughts/problems
  const floatingElements = [
    { value: '¿Se habrá pesado?', delay: 0, x: 30, y: 8, type: 'thought' },
    { value: '3 sin reportar...', delay: 1.2, x: -35, y: 22, type: 'alert' },
    { value: 'Otro cliente fantasma', delay: 2.4, x: 45, y: 40, type: 'thought' },
    { value: '¿Mandé el recordatorio?', delay: 0.7, x: -25, y: 55, type: 'thought' },
    { value: '+15 mensajes pendientes', delay: 1.8, x: 35, y: 70, type: 'alert' },
    { value: '¿Dónde anoté su peso?', delay: 2.8, x: -40, y: 85, type: 'thought' },
    { value: '85 atletas', delay: 0.4, x: 50, y: 28, type: 'number' },
    { value: '2h persiguiendo', delay: 1.5, x: -30, y: 65, type: 'alert' },
    { value: 'Excel otra vez...', delay: 3.2, x: 40, y: 48, type: 'thought' },
    { value: '¿Sigue el plan?', delay: 2, x: -45, y: 78, type: 'thought' },
  ];

  const FloatingElement = ({ value, delay, x, y, type }) => {
    const getStyles = () => {
      switch (type) {
        case 'thought':
          return 'text-white/20 text-xs italic max-w-[100px] text-center';
        case 'alert':
          return 'text-orange-400/30 text-xs font-medium';
        default:
          return 'font-mono text-[#00D2FF]/30 text-sm font-bold';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: [0, 0.7, 0],
          y: [20, -100],
          x: [0, x]
        }}
        transition={{ 
          duration: 5.5,
          delay,
          repeat: Infinity,
          repeatDelay: Math.random() * 3 + 2
        }}
        className={`absolute pointer-events-none ${getStyles()}`}
        style={{ left: `${y}%`, top: '50%' }}
      >
        {value}
      </motion.div>
    );
  };

  const featureIcons = {
    dashboard: BarChart3,
    bell: Bell,
    camera: Camera,
    target: Target,
    clock: Clock,
    database: Database
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative" data-testid="coaches-landing-page">
      {/* Global floating messages throughout the page */}
      <GlobalFloatingMessages type="coach" />
      
      {/* FOMO Banner */}
      <FomoBanner type="coach" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
                <span className="font-black text-black text-sm">K</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">
                kcaliper<span className="text-orange-400">.ai</span>
              </span>
              <span className="hidden sm:inline px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-xs font-bold">COACH</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('features')} className="text-white/60 hover:text-white text-sm font-medium">{t('nav').features}</button>
              <button onClick={() => scrollToSection('pricing')} className="text-white/60 hover:text-white text-sm font-medium">{t('nav').pricing}</button>
              <button onClick={() => scrollToSection('faq')} className="text-white/60 hover:text-white text-sm font-medium">{t('nav').faq}</button>
              <Link to="/nosotros" className="text-white/60 hover:text-white text-sm font-medium">
                {language === 'es' ? 'Nosotros' : 'About Us'}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {/* Para Atletas Link */}
              <Link
                to="/"
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] hover:bg-[#00D2FF]/20 hover:border-[#00D2FF]/50 transition-all text-sm font-semibold"
              >
                <span>{language === 'es' ? 'Para Atletas' : 'For Athletes'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setLanguage(prev => prev === 'es' ? 'en' : 'es')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-white/70 hover:text-orange-400 hover:border-orange-400 transition-all text-sm"
                data-testid="coach-language-toggle"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
              </button>
              <motion.button
                onClick={() => scrollToSection('coach-waitlist')}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold px-5 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(251,146,60,0.5)] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('heroCta')}
              </motion.button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <ParticleBackground />
        
        {/* Orange gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none z-10" />

        {/* Floating Elements */}
        {floatingElements.map((el, i) => (
          <FloatingElement key={i} {...el} />
        ))}

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-8"
            >
              <Users className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-semibold tracking-widest uppercase">
                {t('badge')}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6"
            >
              {t('heroTitle1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                {t('heroTitle2')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-white/60 mb-8 leading-relaxed max-w-2xl"
            >
              {t('heroSubtitle')}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-8"
            >
              <motion.button
                onClick={() => scrollToSection('coach-waitlist')}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold px-8 py-4 rounded-full hover:shadow-[0_0_30px_rgba(251,146,60,0.5)] transition-all text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="coach-hero-cta"
              >
                {t('heroCta')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <span className="text-white/40 text-sm self-center">{t('heroPrice')}</span>
            </motion.div>

            {/* Live Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-6 flex-wrap"
            >
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-400" />
                </span>
                <span className="text-white font-mono font-bold text-lg">{coachCount}</span>
                <span className="text-white/50 text-sm">{t('liveCoaches')}</span>
              </div>
              <span className="text-white/40 text-sm">{t('trustedBy')} <span className="text-white font-semibold">{t('countries')}</span></span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem / Solution Section */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('problemTitle')}
            </h2>
            <p className="text-white/60 text-lg">{t('problemSubtitle')}</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Problems */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 font-semibold uppercase tracking-wider text-sm">Sin Kcaliper</span>
              </div>
              {t('problems').map((problem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-xl bg-black border border-red-500/20 hover:border-red-500/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">{problem.title}</h3>
                      <p className="text-white/50 text-sm">{problem.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Solutions */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-orange-400 font-semibold uppercase tracking-wider text-sm">{t('solutionTitle')}</span>
              </div>
              {t('solutions').map((solution, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-xl bg-black border border-orange-500/20 hover:border-orange-500/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">{solution.title}</h3>
                      <p className="text-white/50 text-sm">{solution.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Notifications Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
                <MessageSquare className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-semibold">WhatsApp</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
                {t('whatsappTitle')}
              </h2>
              <p className="text-white/60 text-lg mb-8">
                {t('whatsappSubtitle')}
              </p>

              <div className="space-y-4">
                {[
                  { icon: Bell, text: language === 'es' ? '🔔 María se desvió de su objetivo (-0.8 kg/sem vs -0.5 kg/sem)' : '🔔 María deviated from her goal (-0.8 kg/wk vs -0.5 kg/wk)' },
                  { icon: Target, text: language === 'es' ? '🎯 Carlos alcanzó su primer milestone: 75 kg' : '🎯 Carlos reached his first milestone: 75 kg' },
                  { icon: AlertTriangle, text: language === 'es' ? '⚠️ 3 atletas sin registro en 48h: Juan, Pedro, Ana' : '⚠️ 3 athletes without check-in for 48h: Juan, Pedro, Ana' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#0B141A] border border-green-500/20"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-white/80 text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative max-w-xs mx-auto">
                <div className="bg-[#111] rounded-[3rem] p-3 border border-white/10">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20" />
                  <div className="bg-[#0B141A] rounded-[2.5rem] overflow-hidden">
                    <div className="bg-[#0B141A] px-4 py-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
                          <span className="font-bold text-black text-sm">K</span>
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">Kcaliper Coach</div>
                          <div className="text-green-400 text-xs">3 {language === 'es' ? 'alertas nuevas' : 'new alerts'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3 h-[300px]">
                      {[
                        { time: '10:23', text: language === 'es' ? '🔔 María bajó a 72.3 kg - nuevo mínimo histórico!' : '🔔 María dropped to 72.3 kg - new all-time low!' },
                        { time: '10:45', text: language === 'es' ? '⚠️ Juan no se ha pesado en 3 días' : '⚠️ Juan hasn\'t weighed in 3 days' },
                        { time: '11:02', text: language === 'es' ? '🎯 Pedro alcanzó 80 kg - milestone completado!' : '🎯 Pedro reached 80 kg - milestone completed!' },
                      ].map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.2 }}
                          className="bg-[#1F2C33] p-3 rounded-lg rounded-bl-none border-l-2 border-orange-400"
                        >
                          <p className="text-white text-sm">{msg.text}</p>
                          <span className="text-white/40 text-xs">{msg.time}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-4 bg-orange-500/10 rounded-[4rem] blur-2xl -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t('features').map((feature, i) => {
              const Icon = featureIcons[feature.icon];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="p-6 rounded-2xl bg-black border border-white/10 hover:border-orange-500/40 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                    <Icon className="w-7 h-7 text-orange-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('howItWorksTitle')}
            </h2>
          </motion.div>

          <div className="relative">
            {/* Line connecting steps */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 via-orange-400 to-yellow-400 hidden md:block" />

            <div className="space-y-12">
              {t('steps').map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className={`flex items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 ${i % 2 === 1 ? 'text-right' : ''}`}>
                    <h3 className="text-white font-semibold text-xl mb-2">{step.title}</h3>
                    <p className="text-white/50">{step.desc}</p>
                  </div>
                  <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-black text-2xl">{step.step}</span>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-6">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-semibold tracking-widest uppercase">
                {t('pricingBadge')}
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('pricingTitle')}
            </h2>
            <p className="text-white/60 text-lg">{t('pricingSubtitle')}</p>
          </motion.div>

          {/* FOMO */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-6 mb-12 flex-wrap"
          >
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-red-500/10 border border-red-500/30">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="text-red-400 font-bold">{spotsLeft}</span>
              <span className="text-red-400/70 text-sm">{t('spotsLeft')}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Clock className="w-4 h-4" />
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m {timeLeft.secs}s
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Athlete Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-black border border-white/10"
            >
              <p className="text-white/50 text-sm mb-2">{t('athletePlan').desc}</p>
              <h3 className="text-white font-semibold text-xl mb-4">{t('athletePlan').name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">{t('athletePlan').price}</span>
                <span className="text-white/50">{t('athletePlan').period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {t('athletePlan').features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/60 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#00D2FF]" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Coach Plan - Featured */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-6 rounded-2xl bg-black border-2 border-orange-500/50 shadow-[0_0_40px_rgba(251,146,60,0.15)]"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 text-black text-xs font-bold">
                {t('coachPlan').popular}
              </div>
              <p className="text-orange-400 text-sm mb-2">{t('coachPlan').desc}</p>
              <h3 className="text-white font-semibold text-xl mb-4">{t('coachPlan').name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">{t('coachPlan').price}</span>
                <span className="text-white/50">{t('coachPlan').period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {t('coachPlan').features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-orange-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button
                onClick={() => scrollToSection('coach-waitlist')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold hover:shadow-[0_0_20px_rgba(251,146,60,0.5)] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('pricingCta')}
              </motion.button>
            </motion.div>

            {/* Annual Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-black border border-white/10"
            >
              <p className="text-green-400 text-sm mb-2">{t('coachAnnual').desc}</p>
              <h3 className="text-white font-semibold text-xl mb-4">{t('coachAnnual').name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">{t('coachAnnual').price}</span>
                <span className="text-white/50">{t('coachAnnual').period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {t('coachAnnual').features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/60 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button
                onClick={() => scrollToSection('coach-waitlist')}
                className="w-full py-3 rounded-xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('pricingCta')}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('testimonialsTitle')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {t('testimonials').map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-white/70 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-black font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-white/50 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('faqTitle')}
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {t('faqs').map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-white/10 rounded-xl px-6 bg-black data-[state=open]:border-orange-500/30"
              >
                <AccordionTrigger className="text-white font-semibold text-left py-5 hover:text-orange-400 [&[data-state=open]]:text-orange-400">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section id="coach-waitlist" className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mb-6">
              {t('ctaTitle')}
            </h2>
            <p className="text-white/60 text-lg mb-10">
              {t('ctaSubtitle')}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto"
          >
            {!submitted ? (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 rounded-2xl blur opacity-30" />
                <div className="relative flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-[#0A0A0A] border border-orange-500/30">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('ctaPlaceholder')}
                    className="flex-1 px-5 py-4 bg-transparent text-white placeholder-white/40 focus:outline-none"
                    required
                    data-testid="coach-cta-email"
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(251,146,60,0.5)] transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="coach-cta-submit"
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : (
                      <>
                        {t('ctaButton')}
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
                className="p-8 rounded-2xl bg-orange-500/10 border border-orange-500/30"
              >
                <UserCheck className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <p className="text-orange-400 font-semibold text-xl">
                  {language === 'es' ? '¡Bienvenido al equipo! Te contactaremos pronto.' : 'Welcome to the team! We\'ll contact you soon.'} 🚀
                </p>
              </motion.div>
            )}

            <p className="text-white/40 text-sm mt-4">
              {t('ctaPrivacy')}
            </p>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
                <span className="font-black text-black text-sm">K</span>
              </div>
              <span className="font-heading font-bold text-white">
                kcaliper<span className="text-orange-400">.ai</span>
              </span>
            </div>
            <p className="text-white/50 text-sm text-center">
              {t('footerTagline')}
            </p>
            <p className="text-white/30 text-sm">
              © 2025 kcaliper.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CoachesLandingPage;
