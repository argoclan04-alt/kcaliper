import { ArrowRight, ArrowLeft, CheckCircle2, Menu, X, Instagram, Users, Camera, Bell, BarChart3, Clock, Star, Send, Shield, Activity, Sparkles, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useWaitlist } from "../hooks/useWaitlist";

interface CoachLandingPageProps {
  onNavigate?: (page: string) => void;
}

/* ============ FOMO SOCIAL PROOF WIDGET ============ */
const fakeSignups = [
  { name: 'Coach Roberto', country: '🇪🇸 España', type: 'Coach Pro', time: 'hace 3 min' },
  { name: 'Carlos M.', country: '🇲🇽 México', type: 'Atleta', time: 'hace 5 min' },
  { name: 'Coach Fitness Laura', country: '🇲🇽 México', type: 'Coach Pro', time: 'hace 9 min' },
  { name: 'Ana G.', country: '🇨🇴 Colombia', type: 'Correo registrado', time: 'hace 12 min' },
  { name: 'Coach Andrés', country: '🇨🇴 Colombia', type: 'Coach Pro', time: 'hace 16 min' },
  { name: 'Diego F.', country: '🇨🇱 Chile', type: 'Atleta', time: 'hace 20 min' },
  { name: 'Coach Nutrición Marta', country: '🇪🇸 España', type: 'Coach Pro', time: 'hace 25 min' },
  { name: 'Valentina R.', country: '🇪🇨 Ecuador', type: 'Correo registrado', time: 'hace 30 min' },
];

function SocialProofWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const initialDelay = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!visible) return;
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

/* ============ EMAIL CAPTURE FOR COACHES ============ */
function CoachEmailCapture({ onComplete }: { onComplete: () => void }) {
  const { submitEmail, updateProfile, loading } = useWaitlist();
  const [step, setStep] = useState<'email' | 'profile' | 'celebration'>('email');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [source, setSource] = useState('');
  const [rowId, setRowId] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const id = await submitEmail(email, 'coach');
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
    setTimeout(() => onComplete(), 3500);
  };

  const handleSkip = () => {
    setStep('celebration');
    setTimeout(() => onComplete(), 3500);
  };

  if (step === 'celebration') {
    return (
      <div className="animate-fade-in py-6 text-center">
        <div className="text-6xl mb-4 animate-float">🚀</div>
        <h3 className="text-2xl font-extrabold text-white mb-2">¡Tu dashboard te espera!</h3>
        <p className="text-white/70 text-sm mb-3">Serás de los primeros coaches en acceder a la plataforma.</p>
        <div className="flex items-center justify-center gap-2 text-green-400">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-bold">Registro completado — Redirigiendo...</p>
        </div>
        <div className="mt-4 w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-[#00D2FF] rounded-full" style={{ animation: 'expandWidth 3.5s ease-out forwards' }} />
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
          <p className="text-white/70 text-sm text-center mb-2">Cuéntanos sobre tu práctica:</p>
          <div className="flex gap-3">
            <input type="text" placeholder="Nombre" value={firstName} onChange={e => setFirstName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D2FF]/50" />
            <input type="text" placeholder="Apellido" value={lastName} onChange={e => setLastName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D2FF]/50" />
          </div>
          <input type="text" placeholder="País" value={country} onChange={e => setCountry(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D2FF]/50" />
          <select value={source} onChange={e => setSource(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00D2FF]/50 appearance-none">
            <option value="" className="bg-[#0A0A1A]">¿Cómo nos encontraste?</option>
            <option value="instagram" className="bg-[#0A0A1A]">Instagram</option>
            <option value="tiktok" className="bg-[#0A0A1A]">TikTok</option>
            <option value="client" className="bg-[#0A0A1A]">Un Cliente</option>
            <option value="google" className="bg-[#0A0A1A]">Google</option>
            <option value="colleague" className="bg-[#0A0A1A]">Un Colega</option>
            <option value="other" className="bg-[#0A0A1A]">Otro</option>
          </select>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 bg-[#00D2FF] text-black hover:bg-[#00D2FF]/90 rounded-full py-3 font-bold text-sm shadow-lg">
              Completar <Send className="w-4 h-4 ml-2" />
            </Button>
            <button type="button" onClick={handleSkip} className="text-white/40 hover:text-white/60 text-xs underline px-2">Saltar</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input type="email" required placeholder="coach@email.com" value={email} onChange={e => setEmail(e.target.value)}
        className="flex-1 px-5 py-3.5 rounded-full bg-white/20 border border-white/30 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/50" />
      <Button type="submit" disabled={loading} className="bg-[#00D2FF] text-black hover:bg-[#00D2FF]/90 rounded-full px-8 py-3.5 font-bold text-sm shadow-lg">
        {loading ? 'Guardando...' : 'Solicitar Acceso'} <Send className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
}

/* ============ MAIN COMPONENT ============ */
export function CoachLandingPage({ onNavigate }: CoachLandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const goHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen fp-dark-bg overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Particles BG */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[160px] animate-pulse-slow" style={{ background: 'rgba(0,210,255,0.08)' }} />
        <div className="absolute top-[40%] -right-[15%] w-[40%] h-[40%] rounded-full blur-[160px] animate-pulse-slow delay-1000" style={{ background: 'rgba(108,92,231,0.06)' }} />
      </div>

      {/* Social Proof Widget */}
      <SocialProofWidget />

      {/* ===== FOMO BANNER ===== */}
      <div className="fixed top-0 w-full z-[60] bg-gradient-to-r from-[#00D2FF] via-[#6C5CE7] to-[#00D2FF] text-white text-center py-2 px-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span className="text-xs sm:text-sm font-bold">
            🎯 ACCESO COACH — Escala tu coaching con IA · Clientes ilimitados · $12.99/mes · 
            <span className="underline cursor-pointer" onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}>
              Registrar mi equipo →
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;🎯 ACCESO COACH — Escala tu coaching con IA · Clientes ilimitados · $12.99/mes · 
            <span className="underline cursor-pointer">Registrar mi equipo →</span>
          </span>
        </div>
      </div>

      {/* ===== NAV ===== */}
      <nav className={`fixed top-8 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-dark py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={goHome} className="text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={goHome}>
              <div className="w-10 h-10 bg-fp-gradient rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">kCaliper<span className="text-fp-gradient">.ai</span></span>
            </div>
            <span className="text-[#00D2FF] text-xs font-bold uppercase tracking-wider bg-[#00D2FF]/10 px-3 py-1 rounded-full">Coaches</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[['#features','Funciones'],['#pricing','Precio'],['#cta','Registrarse']].map(([href, label]) => (
              <a key={href} href={href} className="text-sm font-medium text-white/70 hover:text-white transition-colors">{label}</a>
            ))}
            <button onClick={goHome} className="text-sm font-medium text-white/50 hover:text-white transition-colors">← Para Atletas</button>
            <button onClick={() => navTo('login')} className="text-sm font-medium text-[#00D2FF]/70 hover:text-[#00D2FF] transition-colors">Ingresar</button>
          </div>
          <button className="md:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full glass-dark p-6 flex flex-col gap-4 animate-fade-in">
            {[['#features','Funciones'],['#pricing','Precio'],['#cta','Registrarse']].map(([href, label]) => (
              <a key={href} href={href} className="text-lg font-medium text-white/80" onClick={() => setIsMenuOpen(false)}>{label}</a>
            ))}
            <button onClick={() => { setIsMenuOpen(false); goHome(); }} className="text-lg font-medium text-white/50 text-left">← Para Atletas</button>
            <button onClick={() => { setIsMenuOpen(false); navTo('login'); }} className="text-lg font-medium text-[#00D2FF]/70 text-left">Ingresar</button>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-36 pb-16 px-5 min-h-[85dvh] flex flex-col justify-center">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#00D2FF]/10 border border-[#00D2FF]/20 rounded-full px-4 py-1.5 mb-6 animate-slide-up">
            <Users className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span className="text-[#00D2FF] text-xs font-bold uppercase tracking-wider">Para Coaches y Nutricionistas</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 text-white animate-slide-up delay-100">
            Deja de perseguir atletas.{' '}
            <span style={{ background: 'linear-gradient(135deg, #00D2FF 0%, #6C5CE7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Kcaliper lo hace por ti.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/60 mb-8 animate-slide-up delay-200 max-w-2xl mx-auto">
            Dashboard profesional con alertas inteligentes, seguimiento automatizado, y CaliBot que audita a tus atletas. Más tiempo para entrenar, menos tiempo persiguiendo datos.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up delay-300 justify-center">
            <a href="#cta">
              <Button size="lg" className="bg-[#00D2FF] text-black hover:bg-[#00D2FF]/90 rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-[#00D2FF]/20">
                Solicitar Acceso Coach <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <p className="text-xs text-white/40">$12.99/mes · Clientes ilimitados</p>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 sm:py-28 px-5" style={{ background: 'rgba(0,210,255,0.03)' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#00D2FF] text-xs font-bold uppercase tracking-widest mb-3">Tu Sistema Operativo</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Todo lo que necesitas para <span style={{ background: 'linear-gradient(135deg, #00D2FF 0%, #6C5CE7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>escalar tu coaching</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <BarChart3 className="w-6 h-6" />, color: '#00D2FF', title: 'Dashboard Unificado', desc: 'Todos tus atletas en una pantalla con métricas clave, tendencias DEMA y estados de urgencia.' },
              { icon: <Bell className="w-6 h-6" />, color: '#6C5CE7', title: 'Alertas Inteligentes', desc: 'Recibe notificaciones solo cuando un atleta se desvía de su objetivo. Sin ruido, solo lo importante.' },
              { icon: <Camera className="w-6 h-6" />, color: '#FF6B6B', title: 'Fotos de Progreso', desc: 'Solicita y recibe fotos de physique organizadas automáticamente. Compara visualmente.' },
              { icon: <Star className="w-6 h-6" />, color: '#FFD93D', title: 'Milestones por Atleta', desc: 'Configura metas individuales y celebra logros. Mantén la motivación de cada cliente.' },
              { icon: <Clock className="w-6 h-6" />, color: '#00D2FF', title: 'Recordatorios Automáticos', desc: 'CaliBot recuerda a tus atletas que se pesen. Tú no tienes que perseguir a nadie.' },
              { icon: <Shield className="w-6 h-6" />, color: '#6C5CE7', title: 'Historial Completo', desc: 'Accede a todo el historial de peso de cada cliente con exportación de datos incluida.' },
            ].map((f, i) => (
              <div key={i} className="group fp-dark-card rounded-2xl p-6 hover:border-[#00D2FF]/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${f.color}15`, color: f.color }}>{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 sm:py-28 px-5">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">¿Cómo funciona?</h2>
          </div>
          <div className="space-y-6">
            {[
              { num: '01', title: 'Tú te suscribes como Coach', desc: 'Con $12.99/mes tienes acceso al dashboard profesional, alertas inteligentes, y CaliBot auditorías.' },
              { num: '02', title: 'Tus clientes crean su cuenta de atleta', desc: 'Cada cliente necesita su propia cuenta Kcaliper ($3.99/mes o $12.90/año). Ellos registran su peso y fotos.' },
              { num: '03', title: 'Tú ves todo desde tu dashboard', desc: 'Ve las tendencias, recibe alertas de desvíos, envía recordatorios. Sin perseguir WhatsApps ni Excels.' },
            ].map((s, i) => (
              <div key={i} className="flex gap-6 items-start fp-dark-card rounded-2xl p-6 hover:border-[#00D2FF]/30 transition-all">
                <div className="text-3xl font-black text-[#00D2FF]/30 flex-shrink-0">{s.num}</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-sm text-white/50">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-20 sm:py-28 px-5" style={{ background: 'rgba(0,210,255,0.03)' }}>
        <div className="container mx-auto max-w-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">Un solo plan. Todo incluido.</h2>
            <p className="text-white/50">Sin niveles confusos. Paga y escala.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Coach Monthly */}
            <div className="fp-dark-card rounded-3xl p-8 border-white/10 hover:border-[#00D2FF]/30 transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-[#00D2FF] opacity-5 blur-2xl rounded-full group-hover:opacity-10 transition-opacity" />
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 mb-4 transform group-hover:scale-110 transition-transform duration-500">
                  <img src="/assets/coach_pro_mensual.png" alt="Coach Pro" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold text-white">Coach Professional</h3>
                <p className="text-[#00D2FF] text-xs font-bold uppercase tracking-widest mt-1">Suscripción Mensual</p>
              </div>
              <div className="flex items-baseline gap-2 mb-1 justify-center">
                <span className="text-4xl font-black text-white">$12.99</span>
                <span className="text-white/40 text-sm">/mes</span>
              </div>
              <p className="text-center text-white/50 text-xs mb-8">Clientes ilimitados</p>
              <ul className="space-y-3 mb-8">
                {['Dashboard unificado', 'Alertas inteligentes', 'CaliBot auditorías', 'Gestión de fotos'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-white/70"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FF]" />{f}</li>
                ))}
              </ul>
              <Button 
                onClick={() => window.location.href = "https://buy.stripe.com/7sYeVdaJl9lKeJVcjq3ZK0c"} 
                className="w-full bg-white/5 hover:bg-white/10 text-white rounded-full py-6 font-bold text-sm border border-white/10"
              >
                Elegir Mensual
              </Button>
            </div>

            {/* Coach Annual */}
            <div className="relative group mt-3">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00D2FF] text-black text-[10px] font-bold px-4 py-1 rounded-full shadow-lg z-10">MÁS POPULAR</div>
              <div className="fp-dark-card rounded-3xl p-8 border-[#00D2FF]/30 relative overflow-hidden h-full shadow-[0_0_40px_rgba(0,210,255,0.1)]">
                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-[#00D2FF] opacity-10 blur-2xl rounded-full" />
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 mb-4 transform group-hover:scale-110 transition-transform duration-500">
                    <img src="/assets/coach_legend_anual.png" alt="Coach Global" className="w-full h-full object-contain" />
                  </div>
                <h3 className="text-xl font-bold text-white">Coach Global Elite</h3>
                <p className="text-[#00D2FF] text-xs font-bold uppercase tracking-widest mt-1">Suscripción Anual</p>
              </div>
              <div className="flex items-baseline gap-2 mb-1 justify-center">
                <span className="text-xs text-white/30 line-through">$155.88</span>
                <span className="text-4xl font-black text-white">$99.90</span>
                <span className="text-white/40 text-sm">/año</span>
              </div>
              <p className="text-center text-green-400 text-xs font-bold mb-8">Ahorra $55 al año 🚀</p>
              <ul className="space-y-3 mb-8">
                {['Todo lo Pro', 'Soporte prioritario 24/7', 'Betas exclusivas', 'Infraestructura dedicada'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-white/70"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FF]" />{f}</li>
                ))}
              </ul>
              <Button 
                onClick={() => window.location.href = "https://buy.stripe.com/3cI5kDcRtapOeJV0AI3ZK0d"} 
                className="w-full bg-[#00D2FF] text-black hover:bg-[#00D2FF]/90 rounded-full py-6 font-bold text-sm shadow-lg shadow-[#00D2FF]/20"
              >
                Asegurar Plan Global
              </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section id="cta" className="py-20 sm:py-28 px-5">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #00D2FF 0%, #6C5CE7 100%)' }}>
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Lleva tu coaching al siguiente nivel</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">Únete a la lista de coaches y sé el primero en acceder al dashboard profesional.</p>
              <CoachEmailCapture onComplete={handleEmailComplete} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-16 px-5 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-fp-gradient rounded-lg flex items-center justify-center"><Activity className="text-white w-3.5 h-3.5" /></div>
              <span className="text-sm font-black text-white">kCaliper.ai</span>
              <span className="text-xs text-white/30">© 2026</span>
            </div>
            <div className="flex items-center gap-6">
              {[['privacidad','Privacidad'],['terminos','Términos']].map(([to,label]) => (
                <button key={to} onClick={() => navTo(to)} className="text-xs text-white/40 hover:text-white/80 transition-colors">{label}</button>
              ))}
              <a href="https://instagram.com/kcaliper.ai" target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-white/40 hover:text-white/80 transition-colors"><Instagram className="w-3.5 h-3.5" />@kcaliper.ai</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
