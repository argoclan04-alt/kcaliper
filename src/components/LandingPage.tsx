import { ArrowRight, Bot, TrendingUp, Shield, CheckCircle2, ChevronDown, Menu, X, Instagram, Users, Camera, Bell, Target, Eye, Award, Send, Activity, Sparkles, UserPlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useWaitlist } from "../hooks/useWaitlist";
import calibotMascot from "../assets/calibot-mascot.png";

interface LandingPageProps {
  onNavigate?: (page: string) => void;
}

/* ============ COUNTDOWN HOOK ============ */
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

/* ============ FOMO SOCIAL PROOF WIDGET ============ */
const fakeSignups = [
  { name: 'Carlos M.', country: '🇲🇽 México', type: 'Atleta', time: 'hace 2 min' },
  { name: 'Ana G.', country: '🇨🇴 Colombia', type: 'Atleta', time: 'hace 5 min' },
  { name: 'Coach Roberto', country: '🇪🇸 España', type: 'Coach Pro', time: 'hace 8 min' },
  { name: 'María L.', country: '🇦🇷 Argentina', type: 'Atleta', time: 'hace 12 min' },
  { name: 'Diego F.', country: '🇨🇱 Chile', type: 'Atleta', time: 'hace 15 min' },
  { name: 'Coach Fitness Laura', country: '🇲🇽 México', type: 'Coach Pro', time: 'hace 18 min' },
  { name: 'Pedro S.', country: '🇵🇪 Perú', type: 'Atleta', time: 'hace 22 min' },
  { name: 'Valentina R.', country: '🇪🇨 Ecuador', type: 'Correo registrado', time: 'hace 25 min' },
  { name: 'Coach Andrés', country: '🇨🇴 Colombia', type: 'Coach Pro', time: 'hace 28 min' },
  { name: 'Sofía K.', country: '🇺🇾 Uruguay', type: 'Atleta', time: 'hace 31 min' },
  { name: 'Javier T.', country: '🇻🇪 Venezuela', type: 'Correo registrado', time: 'hace 35 min' },
  { name: 'Coach Nutrición Marta', country: '🇪🇸 España', type: 'Coach Pro', time: 'hace 40 min' },
];

function SocialProofWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show first one after 5 seconds
    const initialDelay = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!visible) return;
    // Hide after 4 seconds, then show next after 15 seconds total cycle
    const hideTimer = setTimeout(() => setVisible(false), 4000);
    const nextTimer = setTimeout(() => {
      setCurrentIndex(i => (i + 1) % fakeSignups.length);
      setVisible(true);
    }, 15000);
    return () => { clearTimeout(hideTimer); clearTimeout(nextTimer); };
  }, [currentIndex, visible]);

  const signup = fakeSignups[currentIndex];
  const isCoach = signup.type.includes('Coach');

  return (
    <div className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ${visible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
      <div className="glass-dark rounded-2xl p-4 pr-6 flex items-center gap-3 shadow-2xl border border-white/10 max-w-xs">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCoach ? 'bg-[#00D2FF]/20 text-[#00D2FF]' : 'bg-[#6C5CE7]/20 text-[#6C5CE7]'}`}>
          <UserPlus className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{signup.name}</p>
          <p className="text-white/50 text-xs truncate">{signup.country} · {signup.type}</p>
          <p className="text-white/30 text-[10px]">{signup.time}</p>
        </div>
      </div>
    </div>
  );
}

/* ============ WHATSAPP CHAT SIMULATION ============ */
function WhatsAppChat() {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const messages = [
    { type: 'bot', text: 'Buenos días María 👋 Veo que hoy marcaste 72.1 kg. Tu tendencia DEMA sigue bajando (-0.28 kg/semana). ¡Vas perfecto! 💪', time: '8:02 a.m.' },
    { type: 'user', text: 'Pero ayer subí 0.4kg 😰', time: '8:03 a.m.' },
    { type: 'bot', text: 'Tranquila — eso es retención de agua normal. Tu tendencia REAL de grasa sigue en -0.28/semana. Mira tu gráfica de los últimos 30 días 📊', time: '8:03 a.m.' },
    { type: 'user', text: 'Wow 😍 me quedo más tranquila, gracias!', time: '8:04 a.m.' },
    { type: 'bot', text: 'Para eso estoy 🤖✨ ¡Sigue así que vas increíble! ¿Te recuerdo mañana a las 8am?', time: '8:04 a.m.' },
    { type: 'user', text: 'Siii porfa 🙏', time: '8:05 a.m.' },
  ];

  useEffect(() => {
    if (visibleMessages < messages.length) {
      const delay = visibleMessages === 0 ? 800 : 1200 + Math.random() * 800;
      const timer = setTimeout(() => setVisibleMessages(v => v + 1), delay);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages, messages.length]);

  return (
    <div className="wa-chat-container shadow-2xl">
      <div className="wa-header">
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
          <img src={calibotMascot} alt="CaliBot" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#E9EDEF]">CaliBot IA</p>
          <p className="text-[11px] text-[#8696A0]">en línea</p>
        </div>
      </div>
      <div className="wa-messages">
        {messages.slice(0, visibleMessages).map((msg, i) => (
          <div key={i} className={`animate-chat-appear ${msg.type === 'bot' ? 'wa-bubble-bot' : 'wa-bubble-user'}`}>
            <p>{msg.text}</p>
            <p className="wa-time">{msg.time}</p>
          </div>
        ))}
        {visibleMessages < messages.length && visibleMessages > 0 && (
          <div className="wa-bubble-bot" style={{ width: 60, padding: '12px 16px' }}>
            <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ EMAIL CAPTURE MULTI-STEP ============ */
function EmailCapture({ onComplete }: { onComplete: () => void }) {
  const { submitEmail, updateProfile, loading } = useWaitlist();
  const [step, setStep] = useState<'email' | 'profile' | 'celebration' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [source, setSource] = useState('');
  const [rowId, setRowId] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const id = await submitEmail(email, 'athlete');
    if (id) {
      setRowId(id);
      setStep('profile');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rowId) {
      await updateProfile(rowId, { firstName, lastName, country, source });
    }
    setStep('celebration');
    // Auto-redirect after 3 seconds
    setTimeout(() => {
      onComplete();
    }, 3500);
  };

  const handleSkip = () => {
    setStep('celebration');
    setTimeout(() => {
      onComplete();
    }, 3500);
  };

  if (step === 'celebration' || step === 'done') {
    return (
      <div className="animate-fade-in py-6 text-center">
        <div className="text-6xl mb-4 animate-float">☕</div>
        <h3 className="text-2xl font-extrabold text-white mb-2">¡Tu café del día está listo!</h3>
        <p className="text-white/70 text-sm mb-3">Por menos que un café diario, tendrás un coach de IA 24/7.</p>
        <div className="flex items-center justify-center gap-2 text-green-400">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-bold">Lugar asegurado — Redirigiendo...</p>
        </div>
        <div className="mt-4 w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-fp-gradient rounded-full animate-[shimmer_3s_linear]" style={{ animation: 'expandWidth 3.5s ease-out forwards' }} />
        </div>
      </div>
    );
  }

  if (step === 'profile') {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center gap-2 text-green-400 mb-4">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-bold text-sm">✅ Email guardado correctamente</p>
        </div>
        <form onSubmit={handleProfileSubmit} className="w-full max-w-md mx-auto space-y-3">
          <p className="text-white/70 text-sm text-center mb-2">Cuéntanos un poco más para personalizar tu experiencia:</p>
          <div className="flex gap-3">
            <input type="text" placeholder="Nombre" value={firstName} onChange={e => setFirstName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50" />
            <input type="text" placeholder="Apellido" value={lastName} onChange={e => setLastName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50" />
          </div>
          <input type="text" placeholder="País" value={country} onChange={e => setCountry(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50" />
          <select value={source} onChange={e => setSource(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 appearance-none">
            <option value="" className="bg-[#0A0A1A]">¿Cómo nos encontraste?</option>
            <option value="instagram" className="bg-[#0A0A1A]">Instagram</option>
            <option value="tiktok" className="bg-[#0A0A1A]">TikTok</option>
            <option value="twitter" className="bg-[#0A0A1A]">Twitter / X</option>
            <option value="coach" className="bg-[#0A0A1A]">Mi Coach</option>
            <option value="google" className="bg-[#0A0A1A]">Google</option>
            <option value="friend" className="bg-[#0A0A1A]">Un Amigo</option>
            <option value="other" className="bg-[#0A0A1A]">Otro</option>
          </select>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 bg-white text-[#6C5CE7] hover:bg-white/90 rounded-full py-3 font-bold text-sm shadow-lg">
              Completar <Send className="w-4 h-4 ml-2" />
            </Button>
            <button type="button" onClick={handleSkip} className="text-white/40 hover:text-white/60 text-xs underline px-2">
              Saltar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input type="email" required placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)}
        className="flex-1 px-5 py-3.5 rounded-full bg-white/20 border border-white/30 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/50" />
      <Button type="submit" disabled={loading} className="bg-white text-[#6C5CE7] hover:bg-white/90 rounded-full px-8 py-3.5 font-bold text-sm shadow-lg">
        {loading ? 'Guardando...' : 'Unirme a la Lista'} <Send className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
}

/* ============ MAIN COMPONENT ============ */
export function LandingPage({ onNavigate }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const launchDate = useRef(new Date(Date.now() + 16 * 24 * 60 * 60 * 1000));
  const countdown = useCountdown(launchDate.current);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navTo = (page: string) => { if (onNavigate) onNavigate(page); };

  const handleEmailComplete = () => {
    window.history.pushState({}, '', '/early-access');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen fp-dark-bg overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Particles BG */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[160px] animate-pulse-slow" style={{ background: 'rgba(108,92,231,0.08)' }} />
        <div className="absolute top-[40%] -right-[15%] w-[40%] h-[40%] rounded-full blur-[160px] animate-pulse-slow delay-1000" style={{ background: 'rgba(0,210,255,0.06)' }} />
        <div className="absolute -bottom-[10%] left-[30%] w-[35%] h-[35%] rounded-full blur-[160px] animate-pulse-slow delay-2000" style={{ background: 'rgba(255,107,107,0.05)' }} />
      </div>

      {/* Social Proof Widget */}
      <SocialProofWidget />

      {/* ===== FOMO BANNER ===== */}
      <div className="fixed top-0 w-full z-[60] bg-gradient-to-r from-[#6C5CE7] via-[#FF6B6B] to-[#00D2FF] text-white text-center py-2 px-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span className="text-xs sm:text-sm font-bold">
            🔥 PRE-LANZAMIENTO — 60% de descuento solo para los primeros fundadores · Quedan pocas plazas · 
            <span className="underline cursor-pointer" onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}>
              Asegura tu lugar →
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;🔥 PRE-LANZAMIENTO — 60% de descuento solo para los primeros fundadores · Quedan pocas plazas · 
            <span className="underline cursor-pointer">Asegura tu lugar →</span>
          </span>
        </div>
      </div>

      {/* ===== NAV ===== */}
      <nav className={`fixed top-8 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-dark py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-fp-gradient rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">kCaliper<span className="text-fp-gradient">.ai</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[['#funciones','Funciones'],['#calibot','CaliBot IA'],['#faq','FAQ']].map(([href, label]) => (
              <a key={href} href={href} className="text-sm font-medium text-white/70 hover:text-white transition-colors">{label}</a>
            ))}
            <button onClick={() => navTo('coach')} className="text-sm font-medium text-[#00D2FF] hover:text-[#00D2FF]/80 transition-colors flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Para Coaches
            </button>
            <button onClick={() => navTo('login')} className="text-sm font-medium text-white/50 hover:text-white transition-colors flex items-center gap-1">
              Ingresar
            </button>
            <a href="#cta">
              <Button className="bg-fp-gradient hover:opacity-90 text-white rounded-full px-6 text-sm shadow-lg shadow-[#6C5CE7]/20">
                Únete Gratis <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </div>
          <button className="md:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full glass-dark p-6 flex flex-col gap-4 animate-fade-in">
            {[['#funciones','Funciones'],['#calibot','CaliBot IA'],['#faq','FAQ']].map(([href, label]) => (
              <a key={href} href={href} className="text-lg font-medium text-white/80" onClick={() => setIsMenuOpen(false)}>{label}</a>
            ))}
            <button onClick={() => { setIsMenuOpen(false); navTo('coach'); }} className="text-lg font-medium text-[#00D2FF] text-left">Para Coaches</button>
            <button onClick={() => { setIsMenuOpen(false); navTo('login'); }} className="text-lg font-medium text-white/50 text-left">Ingresar</button>
            <a href="#cta"><Button className="bg-fp-gradient text-white w-full rounded-full" onClick={() => setIsMenuOpen(false)}>Únete Gratis</Button></a>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section id="hero" className="relative pt-36 pb-16 px-5 min-h-[100dvh] flex flex-col justify-center">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Copy */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 rounded-full px-4 py-1.5 mb-6 animate-slide-up">
                <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span className="text-[#6C5CE7] text-xs font-bold uppercase tracking-wider">Tu Coach de IA Personal</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 text-white animate-slide-up delay-100">
                Nunca más estarás{' '}
                <span className="text-fp-gradient">solo en tu transformación.</span>
              </h1>
              <p className="text-base sm:text-lg text-white/60 mb-8 animate-slide-up delay-200 max-w-xl mx-auto lg:mx-0">
                Kcaliper AI te explica cada cambio de peso, te dice si realmente estás progresando, y te acompaña como un coach objetivo 24/7. Sin pánico. Sin adivinar. Solo ciencia.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up delay-300 justify-center lg:justify-start">
                <a href="#cta">
                  <Button size="lg" className="bg-fp-gradient hover:opacity-90 text-white rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-[#6C5CE7]/20 cta-pulse">
                    Quiero Acceso Anticipado <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
                <p className="text-xs text-white/40">Gratis · Solo deja tu email</p>
              </div>
            </div>

            {/* Right: WhatsApp Chat */}
            <div className="lg:w-1/2 w-full max-w-md mx-auto animate-slide-up delay-500">
              <div className="animate-float">
                <WhatsAppChat />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-12 animate-scroll-indicator">
            <ChevronDown className="w-6 h-6 text-white/30" />
          </div>
        </div>
      </section>

      {/* ===== URGENCY BAR ===== */}
      <section className="relative py-4 border-y border-white/5" style={{ background: 'linear-gradient(90deg, rgba(108,92,231,0.1) 0%, rgba(255,107,107,0.1) 100%)' }}>
        <div className="container mx-auto px-5 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {[
                { val: countdown.days, label: 'Días' },
                { val: countdown.hours, label: 'Hrs' },
                { val: countdown.minutes, label: 'Min' },
                { val: countdown.seconds, label: 'Seg' },
              ].map((c, i) => (
                <div key={i} className="countdown-digit flex flex-col items-center">
                  <span>{String(c.val).padStart(2, '0')}</span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/10" />
          <p className="text-sm text-white/60">
            🚀 <span className="text-[#00D2FF] font-bold">Lanzamiento pronto</span> — Acceso anticipado con 60% OFF
          </p>
        </div>
      </section>

      {/* ===== PROBLEM / SOLUTION ===== */}
      <section className="py-20 sm:py-28 px-5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#FF6B6B] text-xs font-bold uppercase tracking-widest mb-3">El Problema</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">¿Te ha pasado esto? <span className="text-fp-gradient-warm">No estás solo.</span></h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              { emoji: '😰', title: 'Subiste 0.5kg y entraste en pánico', desc: 'Fue solo agua. Pero nadie te lo explicó y cambiaste toda tu dieta por nada.' },
              { emoji: '🤷', title: 'Tu peso sube y baja sin sentido', desc: 'Sin un análisis matemático real, no sabes si estás ganando grasa o solo reteniendo líquidos.' },
              { emoji: '😞', title: 'Te rindes porque "no funciona"', desc: 'Sin retroalimentación objetiva, abandonas dietas que SÍ estaban funcionando.' },
            ].map((p, i) => (
              <div key={i} className="fp-dark-card rounded-2xl p-6 text-center hover:border-[#FF6B6B]/30 transition-all">
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-5 py-2 mb-6">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-bold">La Solución</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 max-w-3xl mx-auto">
              Todo lo que hace un coach humano, <span className="text-fp-gradient">ahora lo tienes 24/7 con IA.</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              Kcaliper AI analiza tus datos con matemáticas avanzadas (DEMA) y te acompaña en cada paso. Nunca más adivinas. Siempre sabes qué pasa.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FUNCIONES (ATHLETE FEATURES) ===== */}
      <section id="funciones" className="py-20 sm:py-28 px-5" style={{ background: 'rgba(108,92,231,0.03)' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#6C5CE7] text-xs font-bold uppercase tracking-widest mb-3">Funciones</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Todo lo que necesitas para <span className="text-fp-gradient">nunca fallar.</span></h2>
            <p className="text-white/50 max-w-2xl mx-auto">Herramientas diseñadas para que entiendas tu cuerpo y tomes decisiones informadas.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Bot className="w-6 h-6" />, color: '#6C5CE7', title: 'Coach IA Personal', desc: 'CaliBot analiza cada pesaje y te explica por qué tu peso cambió. Retención de agua, estrés, ciclo menstrual — entiende todo y te da una opinión objetiva.' },
              { icon: <TrendingUp className="w-6 h-6" />, color: '#00D2FF', title: 'Tendencia Real (DEMA)', desc: 'Ve tu progreso real eliminando el ruido del agua y la inflamación. Sin pánico por fluctuaciones diarias. Solo matemáticas puras.' },
              { icon: <Camera className="w-6 h-6" />, color: '#FF6B6B', title: 'Fotos de Progreso', desc: 'Sube tus fotos y ve cómo se ve tu cuerpo en cada peso. La importancia de saber tu "look por peso" es clave para motivarte.' },
              { icon: <Target className="w-6 h-6" />, color: '#FFD93D', title: 'Milestones Inteligentes', desc: 'Configura metas y celebra cada logro. Kcaliper te avisa cuando alcanzas un nuevo mínimo o superas una meta.' },
              { icon: <Bell className="w-6 h-6" />, color: '#00D2FF', title: 'Recordatorios Proactivos', desc: 'Si te sales del objetivo o dejas de pesarte, CaliBot te lo recuerda. Adherencia del 100% sin depender de nadie.' },
              { icon: <Eye className="w-6 h-6" />, color: '#6C5CE7', title: 'Look por Peso', desc: 'Compara cómo te veías a 75kg vs 72kg. A veces el peso baja pero te ves mejor antes. Kcaliper te ayuda a entender esto.' },
            ].map((f, i) => (
              <div key={i} className="group fp-dark-card rounded-2xl p-6 hover:border-[color:var(--fp-violet)] transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${f.color}15`, color: f.color }}>{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CALIBOT AI MASCOT SECTION ===== */}
      <section id="calibot" className="py-20 sm:py-28 px-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-fp-gradient opacity-[0.03]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Mascot Image */}
            <div className="lg:w-5/12 w-full flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-fp-gradient opacity-20 blur-[80px] rounded-full" />
                <div className="relative animate-float">
                  <img src={calibotMascot} alt="CaliBot AI - Tu Coach Personal de IA" className="w-64 sm:w-80 rounded-3xl shadow-2xl shadow-[#6C5CE7]/20" />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-fp-gradient text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg whitespace-nowrap">
                  🤖 CaliBot — Disponible 24/7
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:w-7/12">
              <div className="inline-flex items-center gap-2 bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 rounded-full px-4 py-1.5 mb-4">
                <Bot className="w-4 h-4 text-[#6C5CE7]" />
                <span className="text-[#6C5CE7] text-xs font-bold uppercase tracking-wider">Tu Ventaja Competitiva</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Conoce a <span className="text-fp-gradient">CaliBot</span></h2>
              <p className="text-white/60 mb-8 text-lg">
                Tu coach personal de IA que entiende tu cuerpo mejor que nadie. No necesitas pagar un nutricionista para saber si estás progresando. CaliBot te lo dice con matemáticas.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: <TrendingUp className="w-5 h-5" />, title: 'Analiza cada cambio de peso', desc: 'Te explica si subiste agua, grasa, o músculo. Sin adivinanzas.' },
                  { icon: <Shield className="w-5 h-5" />, title: 'Predice estancamientos', desc: 'Te avisa ANTES de que te estanques para que ajustes a tiempo.' },
                  { icon: <Award className="w-5 h-5" />, title: 'Celebra tus logros', desc: 'Reconoce cada milestone y te mantiene motivado con datos reales.' },
                  { icon: <Bell className="w-5 h-5" />, title: 'Recordatorios inteligentes', desc: 'Si dejas de pesarte o te sales del objetivo, CaliBot te recuerda.' },
                ].map((b, i) => (
                  <div key={i} className="flex gap-4 items-start fp-dark-card rounded-xl p-4 hover:border-[#6C5CE7]/40 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/10 flex items-center justify-center text-[#6C5CE7] flex-shrink-0">{b.icon}</div>
                    <div><h4 className="font-bold text-white text-sm mb-1">{b.title}</h4><p className="text-xs text-white/50">{b.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp demo below */}
          <div className="mt-16 flex justify-center">
            <div className="max-w-sm w-full">
              <p className="text-center text-white/40 text-sm mb-4">💬 Así se ve una conversación real con CaliBot:</p>
              <WhatsAppChat />
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPOSITION ===== */}
      <section className="py-20 sm:py-28 px-5">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Todo lo que un coach haría por ti, <span className="text-fp-gradient">pero disponible siempre.</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">Ya no dependerás de nadie para saber si tu dieta funciona. Kcaliper te da las herramientas para ser tu propio coach.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { emoji: '🧠', title: 'Opinión objetiva de un tercero', desc: 'CaliBot no tiene sesgo emocional. Te dice la verdad basándote en tus datos, no en cómo te sientes hoy.' },
              { emoji: '📸', title: 'Progreso visual por fecha', desc: 'Sube fotos y ve tu transformación organizada por fecha y peso. Sabrás exactamente cómo te ves en cada etapa.' },
              { emoji: '🎯', title: 'Milestones que celebrar', desc: 'Cada nuevo mínimo, cada semana consistente — Kcaliper celebra tus logros y te mantiene enfocado.' },
              { emoji: '🔔', title: 'Nunca te sales del camino', desc: 'Recordatorios si dejas de pesarte. Alertas si tu tendencia cambia. Siempre sabrás dónde estás parado.' },
            ].map((b, i) => (
              <div key={i} className="fp-dark-card rounded-2xl p-8 hover:border-[#6C5CE7]/30 transition-all group">
                <div className="text-3xl mb-4">{b.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-fp-gradient transition-colors">{b.title}</h3>
                <p className="text-white/50 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 sm:py-28 px-5" style={{ background: 'rgba(108,92,231,0.03)' }}>
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">Preguntas Frecuentes</h2>
            <p className="text-white/50">Todo lo que necesitas saber antes de unirte</p>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              ['¿Por qué mi peso sube si estoy comiendo bien?', 'Las fluctuaciones diarias de peso son normales — retención de agua, sodio, fibra, ciclo menstrual, estrés. Kcaliper usa DEMA (Double Exponential Moving Average) para filtrar todo ese ruido y mostrarte tu tendencia REAL de grasa corporal.'],
              ['¿Qué es CaliBot y cómo funciona?', 'CaliBot es tu coach de IA personal. Analiza tus registros de peso automáticamente, te explica cada fluctuación, te recuerda pesarte, y te avisa si detecta un estancamiento antes de que ocurra. Es como tener un nutricionista objetivo disponible 24/7.'],
              ['¿Necesito un coach humano para usar Kcaliper?', 'No. Kcaliper está diseñado para que puedas gestionar tu progreso de forma independiente. CaliBot actúa como tu coach personal de IA. Si ya tienes un coach, Kcaliper complementa su trabajo con datos objetivos.'],
              ['¿Funciona si quiero subir de peso (volumen)?', 'Sí. Kcaliper funciona tanto para déficit como para superávit. Las alertas y tendencias se adaptan a tu objetivo configurado.'],
              ['¿Cuánto cuesta?', 'Estamos en pre-lanzamiento. Los primeros en registrarse obtienen un 60% de descuento permanente. Únete a la lista de espera para asegurar tu precio.'],
              ['¿Mis datos son seguros?', 'Tus datos están encriptados y son 100% privados. Nunca vendemos datos a terceros. Solo tú puedes ver tu información.'],
              ['¿Puedo cancelar en cualquier momento?', 'Sí. Sin contratos, sin letras pequeñas. Cancela cuando quieras.'],
            ].map(([q, a], i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="fp-dark-card px-6 rounded-2xl border-none">
                <AccordionTrigger className="hover:no-underline font-bold text-left text-white text-sm py-4">{q}</AccordionTrigger>
                <AccordionContent className="text-white/50 pb-5 text-sm leading-relaxed">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ===== EMAIL CAPTURE CTA ===== */}
      <section id="cta" className="py-20 sm:py-28 px-5">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-fp-gradient rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Sé el primero en acceder a Kcaliper AI</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">Únete a la lista de espera y asegura tu acceso anticipado con 60% de descuento permanente.</p>
              <EmailCapture onComplete={handleEmailComplete} />
              <p className="text-xs text-white/50 mt-4">Sin spam. Solo actualizaciones de lanzamiento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-16 px-5 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-fp-gradient rounded-xl flex items-center justify-center shadow-lg"><Activity className="text-white w-5 h-5" /></div>
              <span className="text-xl font-black tracking-tight text-white">kCaliper.ai</span>
            </div>
              <p className="text-xs text-white/40 leading-relaxed">Precisión en cada gramo. Inteligencia artificial para tu composición corporal.</p>
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-4">Producto</p>
              <div className="space-y-2.5">
                {[['#funciones','Funciones'],['#calibot','CaliBot IA'],['#faq','FAQ']].map(([h,l]) => (
                  <a key={h} href={h} className="block text-sm text-white/40 hover:text-white/80 transition-colors">{l}</a>
                ))}
                <button onClick={() => navTo('coach')} className="block text-sm text-white/40 hover:text-white/80 transition-colors">Para Coaches</button>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-4">Legal</p>
              <div className="space-y-2.5">
                {[['privacidad','Política de Privacidad'],['terminos','Términos y Condiciones'],['uso-aceptable','Uso Aceptable'],['nosotros','Nosotros']].map(([to,label]) => (
                  <button key={to} onClick={() => navTo(to)} className="block text-sm text-white/40 hover:text-white/80 transition-colors">{label}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">© 2026 Kcaliper AI. Todos los derechos reservados.</p>
            <a href="https://instagram.com/kcaliper.ai" target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors"><Instagram className="w-4 h-4" />@kcaliper.ai</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
