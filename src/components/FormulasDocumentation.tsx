import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Info, TrendingDown, Scale, Percent, Filter, Eye, Calculator, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';

const sections = [
  { id: 'dema', title: 'Media Móvil (DEMA)', icon: TrendingDown },
  { id: 'weekly-rate', title: 'Tasa Semanal', icon: Scale },
  { id: 'percentage', title: '% de Cambio', icon: Percent },
  { id: 'exclusion', title: 'Exclusión de Datos', icon: Filter },
  { id: 'indicators', title: 'Indicadores Visuales', icon: Eye },
];

export function FormulasDocumentation() {
  const [activeSection, setActiveSection] = useState('dema');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative p-1 sm:p-2">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-6 space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-3">Navegación</p>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeSection === section.id
                  ? 'bg-argo-gradient text-white shadow-lg shadow-blue-500/20 scale-[1.02]'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.title}
              {activeSection === section.id && <ChevronRight className="ml-auto w-4 h-4" />}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-12 pb-20">
        <header className="mb-8">
          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-none mb-3">SISTEMA ARGO</Badge>
          <h1 className="text-4xl font-black tracking-tight mb-2">Documentación Técnica</h1>
          <p className="text-gray-600 dark:text-gray-400">Cómo procesamos tus datos para convertirlos en progreso real.</p>
        </header>

        {/* Moving Average - DEMA */}
        <section id="dema" className="scroll-mt-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Media Móvil Exponencial Doble (DEMA)</h2>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                El **DEMA** es una línea de tendencia suavizada que filtra las fluctuaciones diarias causadas por retención de líquidos, volumen de comida y otros factores temporales. Muestra tu tendencia de peso real.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Cálculo Matemático</p>
              <div className="bg-gray-900/5 dark:bg-white/5 border border-white/10 p-5 rounded-2xl font-mono text-sm space-y-4 shadow-inner">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 font-bold mb-1">Paso 1: Calcular EMA (Exponential Moving Average)</p>
                  <p className="font-medium text-lg leading-none py-2 text-gray-900 dark:text-white">EMAₜ = (Wₜ × α) + (EMAₜ₋₁ × (1 - α))</p>
                  <p className="text-[10px] text-gray-500">Donde α = 2 / (n + 1). Usamos n=7 para suavizado semanal.</p>
                </div>
                <div className="border-t border-gray-200 dark:border-white/5 pt-4">
                  <p className="text-blue-600 dark:text-blue-400 font-bold mb-1">Paso 2: Calcular DEMA</p>
                  <p className="font-medium text-lg leading-none py-2 text-gray-900 dark:text-white">DEMA = (2 × EMAₙ) - EMA(EMAₙ)</p>
                  <p className="text-[10px] text-gray-500 italic">Aplica EMA dos veces eliminando el retraso (lag) de la media simple.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                **¿Por qué DEMA?** Responde más rápido a los cambios reales que una media móvil simple, eliminando el "ruido" diario que suele frustrar a los atletas.
              </p>
            </div>
          </div>
        </section>

        {/* Weekly Rate */}
        <section id="weekly-rate" className="scroll-mt-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Tasa de Cambio Semanal</h2>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Indica cuánto peso estás ganando o perdiendo por semana. Se calcula mediante **regresión lineal** sobre la tendencia DEMA, no sobre los datos en bruto.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 p-4 rounded-xl">
                 <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">Fórmula de Regresión</p>
                 <p className="font-mono text-lg mb-1 text-gray-900 dark:text-white">y = mx + b</p>
                 <p className="text-[10px] text-gray-600">m = Σ((x - x̄)(y - ȳ)) / Σ((x - x̄)²)</p>
              </div>
              <div className="bg-argo-gradient p-4 rounded-xl text-white shadow-lg">
                 <p className="text-[10px] font-bold uppercase opacity-70 mb-2">Resultado Final</p>
                 <p className="text-xl font-black">Tasa = m × 7</p>
                 <p className="text-xs opacity-90 mt-1">Multiplicamos la pendiente diaria para obtener el ritmo semanal.</p>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
               <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
                 <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" /> Usamos los últimos 7-14 valores de DEMA.</li>
                 <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" /> Positivo = Ganando peso / Negativo = Perdiendo peso.</li>
               </ul>
            </div>
          </div>
        </section>

        {/* Percentage */}
        <section id="percentage" className="scroll-mt-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600">
              <Percent className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Porcentaje de Cambio de Peso</h2>
          </div>

          <Card className="border-none shadow-none bg-gray-50 dark:bg-gray-900/60 rounded-2xl">
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Muestra la tasa de cambio semanal como un porcentaje relativo a tu tendencia actual.
              </p>
              <div className="bg-indigo-950 text-indigo-100 p-6 rounded-2xl font-mono text-center shadow-lg relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-xs opacity-50 mb-2 uppercase tracking-tighter">Cálculo de Intensidad</p>
                  <p className="text-xl font-bold">% Cambio = (Tasa / DEMA) × 100</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full group-hover:scale-150 transition-transform"></div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Exclusion */}
        <section id="exclusion" className="scroll-mt-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
              <Filter className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Exclusión de Datos</h2>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col md:flex-row gap-6 text-gray-900 dark:text-white">
              <div className="flex-1 space-y-4">
                <p className="text-sm">Puedes excluir entradas específicas de los cálculos sin borrarlas. Ideal para:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Comidas trampa', 'Retención por sodio', 'Cambios de horario', 'Ciclo menstrual'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="w-1 h-1 rounded-full bg-amber-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/3 bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                 <Filter className="w-8 h-8 text-amber-500 mb-2 opacity-50" />
                 <p className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Funcionamiento</p>
                 <p className="text-xs">Haz clic en cualquier fila para alternar exclusión.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Indicators */}
        <section id="indicators" className="scroll-mt-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-600">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Indicadores Visuales</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
               <div className="flex items-center justify-between mb-2">
                 <Badge className="bg-green-100 text-green-700 border-green-200">-0.5 kg</Badge>
                 <span className="text-[10px] uppercase font-bold text-green-600">Pérdida</span>
               </div>
               <p className="text-xs text-gray-600 dark:text-gray-400">Verde indica que tu tendencia de peso está bajando.</p>
            </div>
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
               <div className="flex items-center justify-between mb-2">
                 <Badge className="bg-red-100 text-red-700 border-red-200">+0.3 kg</Badge>
                 <span className="text-[10px] uppercase font-bold text-red-600">Ganancia</span>
               </div>
               <p className="text-xs text-gray-600 dark:text-gray-400">Rojo indica que tu tendencia de peso está subiendo.</p>
            </div>
          </div>
        </section>

        <footer className="pt-12 border-t border-gray-100 dark:border-white/5 text-center">
           <Calculator className="w-6 h-6 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
           <p className="text-xs text-gray-500">¿Tienes dudas matemáticas? Consulta con tu coach sobre los umbrales específicos de tu plan.</p>
        </footer>
      </div>
    </div>
  );
}
