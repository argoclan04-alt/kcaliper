import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, CheckCircle2, Loader2, Dumbbell, Users, Activity, MessageSquare } from 'lucide-react';

interface OnboardingWizardProps {
  onBack: () => void;
  onComplete: () => void;
}

type GlobalStep = 'role' | 'questions' | 'analyzing' | 'tutorial' | 'paywall';
type Role = 'athlete' | 'coach' | null;

export const OnboardingWizard = ({ onBack, onComplete }: OnboardingWizardProps) => {
  // Initialize with role from localStorage if available, jump straight to questions
  const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('kcaliper_auth') : null;
  const initialRole = storedAuth ? JSON.parse(storedAuth).role : 'athlete';
  
  const [globalStep, setGlobalStep] = useState<string>('questions');
  const [role, setRole] = useState<string | null>(initialRole);

  // Animation specific UI state
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Form State - Shared
  const [questionIndex, setQuestionIndex] = useState(0);

  // Athlete Form Data
  const [hasCoach, setHasCoach] = useState<boolean | null>(null);
  const [weightValue, setWeightValue] = useState('');
  const [unit, setUnit] = useState<'kg'|'lbs'>('kg');

  // Tutorial
  const [tutorialSlide, setTutorialSlide] = useState(0);

  // Analyzing state texts
  const [loadingText, setLoadingText] = useState('Analizando información...');

  const goToNextGlobal = (next: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setGlobalStep(next);
      setIsTransitioning(false);
    }, 400);
  };

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    goToNextGlobal('questions');
  };

  const handleQuestionAnswer = (answer?: any) => {
    // Specifically catch the hasCoach question
    if (role === 'athlete' && questionIndex === 1 && typeof answer === 'boolean') {
      setHasCoach(answer);
    }

    setIsTransitioning(true);
    setTimeout(() => {
      if (questionIndex >= 3) {
        startAnalyzing();
      } else {
        setQuestionIndex(q => q + 1);
        setIsTransitioning(false);
      }
    }, 300);
  };

  const startAnalyzing = async () => {
    setGlobalStep('analyzing');
    setIsTransitioning(false);

    // GUARDAR PESO REAL EN LA BASE DE DATOS PARA ATLETAS
    if (role === 'athlete' && weightValue) {
       const wValue = parseFloat(weightValue);
       if (!isNaN(wValue)) {
          // Si eligen libras, Supabase espera KG o dependiendo del setup 
          // pero como es demo simplificada, lo guardamos directo 
          try {
             // Correct path to reach src/lib/supabase from src/components/pages/
             const { supabase } = await import('../../lib/supabase');
             const { data: { session } } = await supabase.auth.getSession();
             if (session) {
                await supabase.from('weight_entries').insert({
                   client_id: session.user.id,
                   date: new Date().toISOString().split('T')[0],
                   weight: unit === 'lbs' ? Number((wValue / 2.20462).toFixed(2)) : wValue,
                   notes: 'Peso Inicial (Onboarding)',
                   recorded_by: 'client'
                });
             }
          } catch (err) {
             console.error("Error saving initial weight:", err);
          }
       }
    }

    setTimeout(() => setLoadingText('Calculando algoritmos DEMA...'), 1200);
    setTimeout(() => setLoadingText('Preparando a CaliBot...'), 2400);
    setTimeout(() => {
      goToNextGlobal('tutorial');
    }, 3600);
  };

  const nextTutorialSlide = () => {
    if (tutorialSlide < 2) {
      setIsTransitioning(true);
      setTimeout(() => {
        setTutorialSlide(s => s + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      localStorage.setItem('kcaliper_onboarding_done', 'true');
      window.history.pushState({}, '', '/signup');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // --- RENDER HELPERS ---

  const renderBackBtn = () => {
    let action = onBack;
    if (globalStep === 'questions') {
      action = () => {
        if (questionIndex > 0) {
          setIsTransitioning(true);
          setTimeout(() => { setQuestionIndex(q => q - 1); setIsTransitioning(false); }, 300);
        } else {
          goToNextGlobal('role');
        }
      };
    } else if (globalStep === 'tutorial') {
      action = () => {
        if (tutorialSlide > 0) {
          setIsTransitioning(true);
          setTimeout(() => { setTutorialSlide(q => q - 1); setIsTransitioning(false); }, 300);
        } else {
          // Can't go back seamlessly to analyzing, skip to questions
          setIsTransitioning(true);
          setTimeout(() => { setGlobalStep('questions'); setIsTransitioning(false); }, 300);
        }
      };
    } else if (globalStep === 'paywall') {
      action = () => goToNextGlobal('tutorial');
    }

    if (globalStep === 'analyzing') return <div className="w-10" />;

    return (
      <button onClick={action} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </button>
    );
  };

  // --- STEPS ---

  const renderRole = () => (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto text-center px-4">
      <div className="mb-6 animate-pulse-slow">
         <Activity className="w-12 h-12 text-[var(--fp-violet)]" />
      </div>
      <h2 className="text-3xl font-extrabold text-white mb-3">
        Elige tu Ruta
      </h2>
      <p className="text-gray-400 mb-10 text-base">
        kcaliper.com adapta su inteligencia matemática al entorno en el que compites.
      </p>

      <div className="w-full space-y-4">
        <button 
          onClick={() => handleRoleSelect('athlete')}
          className="group w-full flex items-center p-5 rounded-2xl bg-[#111111] border border-white/10 hover:border-[var(--fp-violet)] hover:bg-white/5 transition-all text-left"
        >
          <div className="w-14 h-14 rounded-full bg-[var(--fp-violet)]/10 flex items-center justify-center mr-4 text-[var(--fp-violet)] group-hover:scale-110 transition-transform">
            <Dumbbell className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-0.5">Soy Atleta</h3>
            <p className="text-sm text-gray-500">Quiero trackear mis resultados.</p>
          </div>
        </button>

        <button 
          onClick={() => handleRoleSelect('coach')}
          className="group w-full flex items-center p-5 rounded-2xl bg-[#111111] border border-white/10 hover:border-[var(--fp-cyan)] hover:bg-white/5 transition-all text-left"
        >
          <div className="w-14 h-14 rounded-full bg-[var(--fp-cyan)]/10 flex items-center justify-center mr-4 text-[var(--fp-cyan)] group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-0.5">Soy Coach</h3>
            <p className="text-sm text-gray-500">Quiero gestionar a mis clientes.</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderQuestions = () => {
    // ATHLETE QUESTIONS
    if (role === 'athlete') {
      if (questionIndex === 0) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-8 leading-tight">¿Cuál es tu meta principal?</h2>
            <div className="w-full space-y-3">
              {['Perder Grasa', 'Ganar Masa Muscular', 'Recomposición'].map(opt => (
                <button key={opt} onClick={() => handleQuestionAnswer()} className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-lg transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }
      if (questionIndex === 1) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">¿Estás trabajando con un Coach o Nutricionista?</h2>
            <p className="text-gray-400 mb-8 text-sm">Personalizaremos tu experiencia según cómo entrenes.</p>
            <div className="w-full space-y-3">
              <button onClick={() => handleQuestionAnswer(true)} className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--fp-violet)] hover:bg-white/10 text-white font-semibold text-lg transition-colors">
                Sí, tengo equipo
              </button>
              <button onClick={() => handleQuestionAnswer(false)} className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--fp-cyan)] hover:bg-white/10 text-white font-semibold text-lg transition-colors">
                No, entreno por mi cuenta
              </button>
            </div>
          </div>
        );
      }
      if (questionIndex === 2) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">¿Cuál es tu peso actual aproximado?</h2>
            <p className="text-gray-400 mb-8 text-sm">Tranquilo/a, luego usaremos matemáticas para filtrar el agua retenida.</p>
            
            <div className="flex bg-[#111111] p-1 rounded-xl w-full mb-6 relative">
               <button onClick={() => setUnit('kg')} className={`flex-1 py-3 font-bold rounded-lg transition-colors z-10 ${unit === 'kg' ? 'text-white' : 'text-gray-500'}`}>Kg</button>
               <button onClick={() => setUnit('lbs')} className={`flex-1 py-3 font-bold rounded-lg transition-colors z-10 ${unit === 'lbs' ? 'text-white' : 'text-gray-500'}`}>Lbs</button>
               <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-lg transition-transform duration-300 ${unit === 'lbs' ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'}`} />
            </div>

            <input 
              type="number"
              value={weightValue}
              onChange={e => setWeightValue(e.target.value)}
              placeholder={`Ej. ${unit === 'kg' ? '70' : '154'}`}
              className="w-full text-center text-4xl font-extrabold bg-transparent border-b-2 border-white/20 py-4 text-white focus:outline-none focus:border-[var(--fp-violet)] transition-colors mb-8"
              autoFocus
            />

            <button disabled={!weightValue} onClick={() => handleQuestionAnswer()} className="w-full h-14 rounded-full bg-gradient-to-r from-[var(--fp-violet)] to-[var(--fp-cyan)] text-white font-bold text-lg disabled:opacity-50 transition-opacity">
              Continuar
            </button>
          </div>
        );
      }
      if (questionIndex === 3) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-8 leading-tight">Por último, ¿cómo nos descubriste?</h2>
            <div className="w-full grid grid-cols-2 gap-3">
              {['Instagram', 'TikTok', 'Por un Coach', 'Buscando web', 'Twitter', 'Otro'].map(opt => (
                <button key={opt} onClick={() => handleQuestionAnswer()} className="col-span-1 py-5 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/20 text-gray-300 font-semibold text-sm transition-colors text-center">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }
    }

    // COACH QUESTIONS
    if (role === 'coach') {
      if (questionIndex === 0) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-8 leading-tight">¿Cuál es tu ámbito de especialidad?</h2>
            <div className="w-full space-y-3">
              {['Fitness General / Gym', 'Bodybuilding / Prep', 'Nutrición Clínica / Dieta', 'Powerlifting / Fuerza', 'Otro'].map(opt => (
                <button key={opt} onClick={() => handleQuestionAnswer()} className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-base transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }
      if (questionIndex === 1) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-8 leading-tight">¿A cuántos clientes gestionas activamente hoy?</h2>
            <div className="w-full space-y-3">
              {['De 1 a 10', 'De 11 a 30', 'De 31 a 100', 'Más de 100'].map(opt => (
                <button key={opt} onClick={() => handleQuestionAnswer()} className="w-full h-16 rounded-2xl bg-white/5 border border-[var(--fp-cyan)]/20 hover:bg-[var(--fp-cyan)]/10 text-[#00D2FF] font-bold text-xl transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }
      if (questionIndex === 2) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-8 leading-tight">¿En qué pierdes más tiempo a la semana?</h2>
            <div className="w-full space-y-3">
              {['Crear y regar Excels a cada cliente', 'Analizar quién cumple o no cumple', 'Perseguir check-ins por WhatsApp', 'Cálculos manuales de avances'].map(opt => (
                <button key={opt} onClick={() => handleQuestionAnswer()} className="w-full py-4 px-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-sm transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }
      if (questionIndex === 3) {
        return (
           <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-8 leading-tight">¿Cómo te enteraste de nosotros?</h2>
            <div className="w-full grid grid-cols-2 gap-3">
              {['Instagram', 'TikTok', 'Buscando apps', 'Referencia', 'Ads', 'Otro'].map(opt => (
                <button key={opt} onClick={() => handleQuestionAnswer()} className="col-span-1 py-5 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/20 text-gray-300 font-semibold text-sm transition-colors text-center">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center w-full h-full text-center px-4">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="w-24 h-24 mb-8"
      >
        <Loader2 className="w-full h-full text-[var(--fp-cyan)] opacity-80" />
      </motion.div>
      <h2 className="text-3xl font-bold text-white mb-4">CaliBot Processing...</h2>
      <p className="text-gray-400 text-lg animate-pulse">{loadingText}</p>
    </div>
  );

  const renderTutorial = () => {
    let slides: {t: string, s: string, i: React.FC<any>}[] = [];

    if (role === 'athlete') {
      if (hasCoach) {
        slides = [
          { t: "100% Sincronizado", s: "Tu coach recibe tus fotos y pesajes al instante sin que tengas que mandarle un WhatsApp ni llenar Excels.", i: Users },
          { t: "Ayudas a tu Coach", s: "Al usar kCaliper, calculamos tu DEMA. Tu coach podrá ajustar tu dieta con matemáticas reales, sin adivinar por retención de líquidos.", i: Activity },
          { t: "CaliBot te protege", s: "CaliBot te enviará un recordatorio sutil garantizando tu adherencia al programa sin que tu coach tenga que estar encima tuyo.", i: MessageSquare }
        ];
      } else {
         slides = [
          { t: "Sé tu propio Coach", s: "Vas solo al gym, pero no vas ciego. kCaliper analiza exactamente cómo responde tu metabolismo.", i: Dumbbell },
          { t: "CaliBot está aquí por ti", s: "La Inteligencia Artificial te evalúa semanalmente. Te indica con luz verde o roja si tu dieta está surtiendo efecto.", i: MessageSquare },
          { t: "La Ciencia DEMA", s: "Filtra la retención de agua y fluctuaciones. Nunca más entres en pánico por subir 1kg de agua de un día para otro.", i: Activity }
        ];
      }
    } else {
      slides = [
        { t: "Dashboard Unificado", s: "Ve a todos tus atletas ordenados por nivel de urgencia o estado físico en una sola pantalla móvil.", i: Users },
        { t: "CaliBot audita por ti", s: "La IA filtra los check-ins antes que tú. Te marca exactamente quién va lento y necesita un recorte de macros este viernes.", i: Activity },
        { t: "Escala, Libérate, Gana", s: "Al automatizar el análisis, ahorrarás +10 horas a la semana. Tiempo libre para ti, o capacidad para el doble de clientes.", i: TrendingUp }
      ];
    }

    const currentSlide = slides[tutorialSlide];
    const Icon = currentSlide.i;
    const isCoachColor = role === 'coach';

    return (
      <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto px-4 text-center">
        {/* Mock Graphic Container to simulate mobile UI */}
        <div className={`w-32 h-32 rounded-3xl mb-10 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(108,92,231,0.15)] ${isCoachColor ? 'bg-[var(--fp-cyan)]/10' : 'bg-[var(--fp-violet)]/10'}`}>
          <Icon className={`w-16 h-16 ${isCoachColor ? 'text-[var(--fp-cyan)]' : 'text-[var(--fp-violet)]'}`} />
        </div>
        
        <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">{currentSlide.t}</h2>
        <p className="text-lg text-gray-400 mb-12 leading-relaxed px-2">
          {currentSlide.s}
        </p>

        {/* Dots */}
        <div className="flex gap-2 mb-10">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${tutorialSlide === i ? (isCoachColor ? 'bg-[var(--fp-cyan)] w-8' : 'bg-[var(--fp-violet)] w-8') : 'bg-white/20 w-2'}`} />
          ))}
        </div>

        <button onClick={nextTutorialSlide} className="w-full h-14 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-lg transition-colors flex items-center justify-center">
          {tutorialSlide === 2 ? 'Continuar' : 'Siguiente'} <ChevronRight className="w-5 h-5 ml-1 -mr-1" />
        </button>
      </div>
    );
  };

  const renderPaywall = () => {
    if (role === 'athlete') {
      return (
        <div className="flex flex-col w-full h-full max-w-sm mx-auto px-4 py-6 text-center justify-between">
           <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                Descuento<br />de Fundador.
              </h2>
              <p className="text-gray-400 text-sm mb-8">Congela este precio de por vida. Cancela de un click si CaliBot no es para ti.</p>

              <div className="bg-[#111111] border border-[var(--fp-violet)]/50 rounded-3xl p-6 text-left relative shadow-[0_0_40px_rgba(108,92,231,0.15)]">
                <div className="absolute top-0 right-0 bg-[var(--fp-violet)] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl uppercase tracking-wider">
                  -50% OFF
                </div>
                <h3 className="text-white font-bold text-xl mb-1">Atleta Pro</h3>
                <div className="flex flex-col mb-6 mt-1">
                  <span className="text-xs text-gray-500 line-through tracking-wider mb-0.5">$7.99/mes</span>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black text-white">$3.99</span>
                    <span className="text-sm text-gray-400 mb-1">/mes</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-2">
                  {['Dashboard DEMA Privado', 'CaliBot para Whatsapp', 'Comparador de Fotos', hasCoach ? 'Sync automático con Tu Coach' : 'Alertas smart de estancamiento'].map((f, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[var(--fp-violet)] shrink-0 mr-2 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
           </div>

           <div className="pt-6 flex flex-col items-center">
              <button onClick={() => {
                localStorage.setItem('kcaliper_onboarding_done', 'true');
                window.history.pushState({}, '', '/signup');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }} className="flex items-center justify-center w-full h-14 rounded-full bg-gradient-to-r from-[var(--fp-violet)] to-[var(--fp-cyan)] hover:opacity-90 font-bold text-white shadow-lg transition-transform hover:scale-[1.02]">
                Crear mi Cuenta (VIP)
              </button>
              <button onClick={() => {
                 localStorage.setItem('kcaliper_onboarding_done', 'true');
                 window.history.pushState({}, '', '/login');
                 window.dispatchEvent(new PopStateEvent('popstate'));
              }} className="mt-4 text-[10px] text-gray-600 hover:text-gray-400 underline transition-colors uppercase tracking-wider">
                Ya tengo cuenta · Iniciar sesión
              </button>
           </div>
        </div>
      );
    } 

    return (
      <div className="flex flex-col w-full h-full max-w-sm mx-auto px-4 py-6 text-center justify-between">
           <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">
                Listos para Escalar.
              </h2>
              <p className="text-gray-400 text-sm mb-6">Tu panel está configurado. Desbloquea tu entorno operativo e invita a tus atletas.</p>

              <div className="space-y-4">
                {/* Coach Basic */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 text-left">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-bold text-lg">Coach Basic</h3>
                    <div className="text-right">
                      <div className="text-xl font-black text-white">$7.99<span className="text-xs text-gray-500 font-normal">/mo</span></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 block">Hasta 15 clientes • Dashboard Unificado • Alertas</p>
                  <button onClick={onComplete} className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-colors">
                    Plan Basic
                  </button>
                </div>

                {/* Coach Pro */}
                <div className="bg-[#111111] border border-[var(--fp-cyan)]/50 rounded-2xl p-5 text-left relative shadow-[0_0_30px_rgba(0,210,255,0.15)]">
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[var(--fp-cyan)] text-black text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Recomendado
                  </div>
                  <div className="flex justify-between items-start mb-2 mt-1">
                    <h3 className="text-white font-bold text-lg">Coach Pro</h3>
                    <div className="text-right">
                      <div className="text-xl font-black text-white">$12.99<span className="text-xs text-gray-500 font-normal">/mo</span></div>
                    </div>
                  </div>
                  <p className="text-xs text-[#00D2FF]/80 mb-3 block">Clientes Ilimitados • CaliBot Auditorías • Soporte VIP</p>
                  <button onClick={onComplete} className="w-full py-2.5 rounded-full bg-[var(--fp-cyan)] text-black hover:opacity-90 font-bold text-sm transition-transform hover:scale-[1.02]">
                    Seleccionar Pro
                  </button>
                </div>
              </div>
           </div>
           
           <div className="pt-6">
              <p className="text-[11px] text-gray-500 text-center">Puedes actualizar o cancelar después en configuración.</p>
           </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden text-white font-sans selection:bg-[var(--fp-violet)]/30 flex flex-col supports-[min-height:100dvh]:min-h-[100dvh]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b ${role === 'coach' ? 'from-[var(--fp-cyan)]/10' : 'from-[var(--fp-violet)]/10'} to-transparent opacity-50`} />
      </div>

      {/* Tightly packed header */}
      <header className="relative z-20 flex-shrink-0 h-16 w-full max-w-sm mx-auto px-4 flex items-center justify-between">
        {renderBackBtn()}
        {['questions', 'tutorial'].includes(globalStep) && (
          <div className="text-xs font-semibold tracking-widest text-white/30 uppercase">
             {globalStep === 'questions' ? `Paso ${questionIndex + 1}/4` : 'Aprendizaje'}
          </div>
        )}
        <div className="w-10" /> {/* Spacer for centered title */}
      </header>

      {/* Content wrapper - takes up remaining space completely */}
      <main className="relative z-10 flex-1 w-full flex items-center justify-center">
        <div className={`w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}>
          {globalStep === 'role' && renderRole()}
          {globalStep === 'questions' && renderQuestions()}
          {globalStep === 'analyzing' && renderAnalyzing()}
          {globalStep === 'tutorial' && renderTutorial()}
          {globalStep === 'paywall' && renderPaywall()}
        </div>
      </main>
    </div>
  );
};

// SVG Icons missing from core import
function TrendingUp(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
}
