import { ArrowRight, CheckCircle2, Play, Clock, Shield, Sparkles, Instagram, Activity } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { VideoPlayer } from "./ui/video-player";
import { TextEffect } from "./ui/text-effect";
import { AnimatedGroup } from "./ui/animated-group";
import { FAQSection } from "./ui/faq-section";

interface EarlyAccessPageProps {
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

export function EarlyAccessPage({ onNavigate }: EarlyAccessPageProps) {
  const [pricingTab, setPricingTab] = useState<'athlete' | 'coach'>('athlete');
  const [athleteBilling, setAthleteBilling] = useState<'monthly' | 'annual'>('annual');
  const [coachBilling, setCoachBilling] = useState<'monthly' | 'annual'>('annual');
  const launchDate = useRef(new Date(Date.now() + 16 * 24 * 60 * 60 * 1000));
  const countdown = useCountdown(launchDate.current);

  const faqsLeft = [
    {
      question: "¿Qué recibo al asegurar mi precio de Fundador?",
      answer: "Obtienes un 60% de descuento vitalicio sobre el precio de lanzamiento, acceso anticipado a la plataforma y línea directa con nuestro equipo de desarrollo."
    },
    {
      question: "¿Cómo funciona la IA de Kcaliper?",
      answer: "Nuestra IA analiza tus pesajes diarios aplicando algoritmos de suavizado como DEMA para aislar el ruido (retención de agua, etc.) y mostrarte tu verdadera tendencia."
    },
  ];

  const faqsRight = [
    {
      question: "Si soy Coach, ¿qué pasa con mis clientes?",
      answer: "Tus clientes deben descargar Kcaliper y crear una cuenta de atleta. Desde tu Dashboard podrás agregarlos y monitorear todos sus datos automáticamente."
    },
    {
      question: "¿Puedo cancelar mi cuenta en cualquier momento?",
      answer: "Totalmente. El procesamiento de pagos está manejado por Stripe; no hay ataduras ni letras pequeñas. Si cancelas, mantienes acceso hasta el final del ciclo pagado."
    },
  ];

  const handlePayment = () => {
    let url = "";
    if (pricingTab === 'athlete') {
      url = athleteBilling === 'monthly' 
        ? "https://buy.stripe.com/test_5kQdR95rtgQLeDd7qO04805" // Atleta Mensual Test
        : "https://buy.stripe.com/test_5kQ3cv0792ZVamXbH404806"; // Atleta Anual Test
    } else {
      url = coachBilling === 'monthly'
        ? "https://buy.stripe.com/test_aFa8wP8DF0RN52D5iG04803" // Coach Mensual Test
        : "https://buy.stripe.com/test_7sY4gz7zB2ZVfHhaD004804"; // Coach Anual Test
    }
    window.location.href = url;
  };

  const navTo = (page: string) => { if (onNavigate) onNavigate(page); };

  const goHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen fp-dark-bg overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Particles BG */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[160px] animate-pulse-slow" style={{ background: 'rgba(108,92,231,0.1)' }} />
        <div className="absolute top-[40%] -right-[15%] w-[40%] h-[40%] rounded-full blur-[160px] animate-pulse-slow delay-1000" style={{ background: 'rgba(0,210,255,0.08)' }} />
        <div className="absolute -bottom-[10%] left-[30%] w-[35%] h-[35%] rounded-full blur-[160px] animate-pulse-slow delay-2000" style={{ background: 'rgba(255,107,107,0.06)' }} />
      </div>

      {/* ===== NAV ===== */}
      <nav className="fixed top-0 w-full z-50 glass-dark py-3">
        <div className="container mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={goHome}>
            <div className="w-10 h-10 bg-fp-gradient rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">kCaliper<span className="text-fp-gradient">.ai</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FFD93D] text-xs font-bold uppercase tracking-wider bg-[#FFD93D]/10 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Acceso Anticipado
            </span>
          </div>
        </div>
      </nav>

      {/* ===== HERO: WELCOME + VIDEO ===== */}
      <section className="relative pt-28 pb-12 px-5 z-10">
        <div className="container mx-auto max-w-5xl text-center">
            <AnimatedGroup preset="slide" className="flex flex-col items-center justify-center">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-5 py-2 mb-6">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-bold">¡Estás dentro! Tu lugar está asegurado.</span>
              </div>

              <div className="mb-6">
                <TextEffect per="word" as="h1" className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] text-white">
                  Bienvenido a la era de la precisión.
                </TextEffect>
              </div>

              <p className="text-base sm:text-lg text-white/60 mb-10 max-w-2xl mx-auto">
                Estamos en fase de lanzamiento. Mira este video donde te explico qué es Kcaliper AI y por qué esta es la <strong className="text-white">única oportunidad</strong> de obtener un 60% de descuento permanente.
              </p>
            </AnimatedGroup>

            {/* Video Player */}
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
               <VideoPlayer src="https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4" />
            </div>
        </div>
      </section>

      {/* ===== COUNTDOWN ===== */}
      <section className="py-8 px-5">
        <div className="container mx-auto max-w-2xl">
          <div className="fp-dark-card rounded-2xl p-6 text-center">
            <p className="text-white/60 text-sm mb-4">⏳ Lanzamiento oficial en:</p>
            <div className="flex justify-center gap-3 mb-4">
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
            <p className="text-xs text-white/40">Compra ahora y congela tu precio de fundador para siempre.</p>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-16 sm:py-24 px-5">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-[#FF6B6B] text-xs font-bold uppercase tracking-wider">🔥 60% OFF — Solo Fundadores</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Precio de Fundador</h2>
            <p className="text-white/50">Este descuento no volverá. Asegúralo hoy.</p>
          </div>

          {/* Tabs: Athlete / Coach */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white/5 rounded-full p-1 border border-white/10">
              <button onClick={() => setPricingTab('athlete')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${pricingTab === 'athlete' ? 'bg-fp-gradient text-white shadow-lg' : 'text-white/60 hover:text-white'}`}>
                🏋️ Soy Atleta
              </button>
              <button onClick={() => setPricingTab('coach')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${pricingTab === 'coach' ? 'bg-[#00D2FF] text-black shadow-lg' : 'text-white/60 hover:text-white'}`}>
                🎯 Soy Coach
              </button>
            </div>
          </div>

          {pricingTab === 'athlete' ? (
            <div className="max-w-md mx-auto">
              {/* Billing toggle */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex bg-white/5 rounded-full p-1 border border-white/10 text-sm">
                  <button onClick={() => setAthleteBilling('monthly')}
                    className={`px-5 py-2 rounded-full font-semibold transition-all ${athleteBilling === 'monthly' ? 'bg-white/10 text-white' : 'text-white/50'}`}>
                    Mensual
                  </button>
                  <button onClick={() => setAthleteBilling('annual')}
                    className={`px-5 py-2 rounded-full font-semibold transition-all relative ${athleteBilling === 'annual' ? 'bg-white/10 text-white' : 'text-white/50'}`}>
                    Anual
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">-73%</span>
                  </button>
                </div>
              </div>

              <div className="fp-dark-card rounded-3xl p-8 border-[#6C5CE7]/30 relative shadow-[0_0_40px_rgba(108,92,231,0.15)] overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-fp-gradient opacity-10 blur-2xl rounded-full" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-fp-gradient text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-lg">
                  60% OFF Fundador
                </div>
                
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 mb-4 transform hover:scale-105 transition-transform duration-500">
                    <img 
                      src={athleteBilling === 'monthly' ? "/assets/atleta_pro_mensual.png" : "/assets/atleta_legend_anual.png"} 
                      alt="Plan Atleta" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#6C5CE7]">{athleteBilling === 'monthly' ? 'Atleta Pro' : 'Atleta Legend'}</p>
                </div>

                {athleteBilling === 'monthly' ? (
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 justify-center">
                      <span className="text-xs text-white/30 line-through">$9.99</span>
                      <span className="text-5xl font-black text-white">$3.99</span>
                      <span className="text-white/40 text-sm">/mes</span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 justify-center">
                      <span className="text-xs text-white/30 line-through">$47.88/año</span>
                      <span className="text-5xl font-black text-white">$12.90</span>
                      <span className="text-white/40 text-sm">/año</span>
                    </div>
                    <p className="text-center text-green-400 text-xs font-bold mt-1">= $1.07/mes 🤯</p>
                  </div>
                )}

                <ul className="space-y-3 mb-8">
                  {[
                    athleteBilling === 'monthly' ? 'CaliBot IA — Coach personal 24/7' : 'Acceso Legend Vitalicio',
                    'Análisis de tendencia DEMA',
                    'Fotos de progreso por fecha',
                    'Milestones inteligentes',
                    'Recordatorios proactivos',
                    'Alertas de desvío',
                    athleteBilling === 'monthly' ? 'Soporte estándar' : 'Soporte prioritario',
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-white/70"><CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />{f}</li>
                  ))}
                </ul>

                <Button 
                  onClick={handlePayment}
                  className="w-full h-14 bg-fp-gradient text-white rounded-full hover:opacity-90 transition-all font-bold text-base shadow-lg shadow-[#6C5CE7]/30 cta-pulse"
                >
                  Asegurar Precio Fundador <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-xs text-white/30 text-center mt-3">🔒 Pago seguro · Cancela cuando quieras</p>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {/* Billing toggle Coach */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex bg-white/5 rounded-full p-1 border border-white/10 text-sm">
                  <button onClick={() => setCoachBilling('monthly')}
                    className={`px-5 py-2 rounded-full font-semibold transition-all ${coachBilling === 'monthly' ? 'bg-white/10 text-white' : 'text-white/50'}`}>
                    Mensual
                  </button>
                  <button onClick={() => setCoachBilling('annual')}
                    className={`px-5 py-2 rounded-full font-semibold transition-all relative ${coachBilling === 'annual' ? 'bg-white/10 text-white' : 'text-white/50'}`}>
                    Anual
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">-35%</span>
                  </button>
                </div>
              </div>

              <div className="fp-dark-card rounded-3xl p-8 border-[#00D2FF]/30 relative shadow-[0_0_40px_rgba(0,210,255,0.15)] overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-[#00D2FF] opacity-10 blur-2xl rounded-full" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00D2FF] text-black text-[10px] font-bold px-4 py-1 rounded-full shadow-lg">
                  Coach Pro
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 mb-4 transform hover:scale-105 transition-transform duration-500">
                    <img 
                      src={coachBilling === 'monthly' ? "/assets/coach_pro_mensual.png" : "/assets/coach_legend_anual.png"} 
                      alt="Plan Coach" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#00D2FF]">{coachBilling === 'monthly' ? 'Coach Professional' : 'Coach Global Elite'}</p>
                </div>

                {coachBilling === 'monthly' ? (
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 justify-center">
                      <span className="text-5xl font-black text-white">$12.99</span>
                      <span className="text-white/40 text-sm">/mes</span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 justify-center">
                      <span className="text-xs text-white/30 line-through">$155.88/año</span>
                      <span className="text-5xl font-black text-white">$99.90</span>
                      <span className="text-white/40 text-sm">/año</span>
                    </div>
                    <p className="text-center text-green-400 text-xs font-bold mt-1">Ahorra $55 al año 🚀</p>
                  </div>
                )}
                <p className="text-center text-white/50 text-sm mb-8">Clientes ilimitados</p>

                <ul className="space-y-3 mb-8">
                  {[
                    'Dashboard profesional unificado',
                    'Alertas inteligentes por atleta',
                    'CaliBot auditorías automáticas',
                    'Gestión de fotos de progreso',
                    'Milestones y recordatorios por cliente',
                    'Historial y exportación de datos',
                    'Clientes ilimitados',
                    'Soporte prioritario',
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-white/70"><CheckCircle2 className="w-4 h-4 text-[#00D2FF] flex-shrink-0" />{f}</li>
                  ))}
                </ul>

                <Button 
                  onClick={handlePayment}
                  className="w-full h-14 bg-[#00D2FF] text-black rounded-full hover:bg-[#00D2FF]/90 transition-all font-bold text-base shadow-lg shadow-[#00D2FF]/20"
                >
                  Asegurar Plan Coach <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-xs text-white/40 text-center mt-4">Tus clientes necesitan su cuenta de atleta ($3.99/mes o $12.90/año)</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== GUARANTEES ===== */}
      <section className="py-12 px-5">
        <div className="container mx-auto max-w-3xl">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <Shield className="w-5 h-5" />, title: 'Cancela cuando quieras', desc: 'Sin contratos ni letras pequeñas.' },
              { icon: <Clock className="w-5 h-5" />, title: 'Precio congelado', desc: 'Tu descuento de fundador es permanente.' },
              { icon: <Sparkles className="w-5 h-5" />, title: 'Acceso beta privado', desc: 'Serás de los primeros en usar la plataforma.' },
            ].map((g, i) => (
              <div key={i} className="fp-dark-card rounded-xl p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center mx-auto mb-3">{g.icon}</div>
                <h4 className="font-bold text-white text-sm mb-1">{g.title}</h4>
                <p className="text-xs text-white/50">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <div className="bg-black text-white relative z-10 border-t border-white/5">
        <FAQSection
          title="Preguntas Frecuentes"
          subtitle="Soporte y Dudas"
          description="Resolvemos las consultas más comunes sobre el precio fundador y la plataforma."
          buttonLabel="Escríbenos si tienes más dudas →"
          faqsLeft={faqsLeft}
          faqsRight={faqsRight}
          className="py-20"
        />
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 px-5 border-t border-white/5">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-fp-gradient rounded-lg flex items-center justify-center"><Activity className="text-white w-3.5 h-3.5" /></div>
              <span className="text-sm font-black text-white">kcaliper.com</span>
              <span className="text-xs text-white/30">© 2026</span>
            </div>
            <div className="flex items-center gap-6">
              {[['privacidad','Privacidad'],['terminos','Términos']].map(([to,label]) => (
                <button key={to} onClick={() => navTo(to)} className="text-xs text-white/40 hover:text-white/80 transition-colors">{label}</button>
              ))}
              <a href="https://instagram.com/kcaliper.com" target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-white/40 hover:text-white/80 transition-colors"><Instagram className="w-3.5 h-3.5" />@kcaliper.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
