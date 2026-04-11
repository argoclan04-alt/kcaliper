import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import {
  Activity, ArrowRight, CheckCircle2, Instagram, Zap, DollarSign, Star,
  TrendingUp, Users, Heart, Globe, Shield, ChevronDown, Send, Video, PlayCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Particles } from './ui/particles';

interface BecomeInfluencerPageProps {
  onNavigate?: (page: string) => void;
}

const BENEFITS = [
  { icon: <DollarSign className="w-5 h-5" />, title: 'Pago por CPM', desc: 'Gana de forma predecible por cada 1,000 views reales de tu contenido (medido a los 7 días). No dependes de conversiones de venta para cobrar la base.' },
  { icon: <Users className="w-5 h-5" />, title: 'Bono $1 por Registro', desc: 'Adicional al pago por visualizaciones, te pagamos $1 extra por cada usuario que ingrese su email en la waitlist a través de tu link único.' },
  { icon: <Star className="w-5 h-5" />, title: 'Cuenta Pro Gratis', desc: 'Acceso completo a la plataforma para ti mientras seas un colaborador activo. Usa la app en tu propio entrenamiento o con tus clientes.' },
  { icon: <Zap className="w-5 h-5" />, title: 'Tracking Preciso', desc: 'Cookie de 30 días en tu link personalizado (kcaliper.com/?ref=TU_CODIGO) para asegurar que cada registro cuente a tu favor.' },
];

const REQUIREMENTS = [
  { step: '01', title: 'Apertura (Obligatoria)', desc: 'Los primeros 15 segundos deben empezar con un "dolor" real de tu audiencia y mostrar / mencionar "kcaliper.com" visiblemente en pantalla.' },
  { step: '02', title: 'Formato del Contenido', desc: 'Debes publicar 1 Reel o TikTok de mínimo 20 segundos de duración, mostrando el uso real de la app (móvil o dashboard).' },
  { step: '03', title: 'Reglas de Precios', desc: 'No puedes revelar nuestra información de precios antes del segundo 20 del video.' },
  { step: '04', title: 'Call-to-Action Exacto', desc: 'Debes cerrar invitando a que usen tu link en bio advirtiendo que los cupos de fundador son limitados.' },
];

const FAQS = [
  { q: '¿Necesito muchos seguidores para unirme?', a: 'No, no hay un límite estricto hacia abajo. Aprobamos perfiles basándonos en el engagement y en si la audiencia encaja bien (atletas o coaches reales).' },
  { q: '¿Cómo verifican los registros de la waitlist?', a: 'Nuestro sistema detecta automáticamente qué usuarios vienen de tu URL personalizada (?ref=tu_codigo). Verás los resultados reflejados cuando seas aceptado.' },
  { q: '¿Tengo exclusividad con ustedes?', a: 'No, puedes seguir trabajando con todas tus marcas habituales de suplementos o ropa. Solo te pedimos no promover otra plataforma de seguimiento de clientes simultáneamente.' },
  { q: '¿Puedo exagerar los resultados de Kcaliper?', a: 'No. Está estrictamente prohibido hacer afirmaciones médicas falsas o garantizar pérdida de grasa mágica. Kcaliper es una herramienta de datos seria.' },
];

export function BecomeInfluencerPage({ onNavigate }: BecomeInfluencerPageProps) {
  const [form, setForm] = useState({
    name: '', email: '', instagram: '', tiktok: '', youtube: '',
    followers: '', niche: '', why: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.instagram) {
      toast.error('Por favor completa los campos obligatorios.');
      return;
    }
    setLoading(true);
    try {
      const followers = parseInt(form.followers.replace(/\D/g, '')) || 0;
      let tier = 'nano';
      if (followers >= 500000) tier = 'macro';
      else if (followers >= 100000) tier = 'mid';
      else if (followers >= 10000) tier = 'micro';

      const ref_code = `ref_${form.instagram.replace('@', '').toLowerCase().replace(/[^a-z0-9]/g, '')}`;

      const { error } = await supabase.from('influencers').insert({
        name: form.name,
        email: form.email.toLowerCase().trim(),
        ig_handle: form.instagram.startsWith('@') ? form.instagram : `@${form.instagram}`,
        tiktok_handle: form.tiktok || null,
        followers,
        tier,
        ref_code,
        status: 'prospect',
        notes: form.why,
        country: 'Unknown',
        cpm_agreed: 0,
        engagement_rate: 0,
      });

      if (error && error.code !== '23505') throw error;

      setSubmitted(true);
      toast.success('¡Aplicación enviada! Te contactaremos pronto.');
    } catch (err: any) {
      toast.error(err.message || 'Error al enviar la aplicación.');
    }
    setLoading(false);
  };

  return (
    <div className="relative bg-black text-white min-h-screen font-['Inter',sans-serif] overflow-hidden">
      {/* Interactive Background Particles */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Particles 
          className="w-full h-full"
          quantity={80}
          ease={80}
          color="#6C5CE7"
          refresh
        />
      </div>

      {/* Content wrapper with z-index to stay above particles */}
      <div className="relative z-10">
        
        {/* NAV */}
        <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <button onClick={() => onNavigate?.('')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Activity className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">kCaliper<span className="text-indigo-600">.ai</span></span>
            </button>
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate?.('')} className="text-sm text-white/40 hover:text-white transition-colors">← Volver</button>
              <a href="#aplicar" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-full transition-all">
                Aplicar Ahora
              </a>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative pt-20 pb-32 px-6 text-center">
          {/* Background glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" />
            <div className="absolute -top-20 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-xs font-bold uppercase tracking-widest text-indigo-400 mb-8 backdrop-blur-sm">
              <Heart className="w-3.5 h-3.5" /> Brand Brief — Programa de Creadores
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.95]">
              Rentabiliza tu audiencia con la app que cambiará el{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                fitness hispano
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mx-auto mb-10">
              No es una app genérica de calorías. kcaliper.com es el centro de datos diseñado para coaches y atletas serios. 
              Gana por views (CPM) y por cada lead que nos traigas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#aplicar" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-black rounded-full text-base hover:bg-white/90 transition-all shadow-2xl shadow-white/10 active:scale-95">
                Aplicar Ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#rules" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black/40 backdrop-blur-md text-white font-semibold rounded-full text-base border border-white/10 hover:bg-white/10 transition-all">
                <PlayCircle className="w-5 h-5" /> Ver Reglas del Contenido
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/10">
              {[
                { value: 'CPM', label: 'Pago Base Fijo' },
                { value: '+$1', label: 'Por Registro (Lead)' },
                { value: '30 d', label: 'Tracking de Cookie' },
                { value: '100%', label: 'Soporte Directo' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 bg-white/[0.02] rounded-2xl border border-white/[0.05] backdrop-blur-sm">
                  <p className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-[10px] lg:text-xs text-white/40 font-bold uppercase tracking-widest mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-[#050508]/80 backdrop-blur-xl border-y border-white/5 pointer-events-none" />
          <div className="relative max-w-6xl mx-auto z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tighter mb-4">La Oferta para Creadores</h2>
              <p className="text-white/40 text-lg">Pagas justas. Tratamos a los creadores como socios, no como leads.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BENEFITS.map((b, i) => (
                <div key={i} className="group p-8 bg-black/40 backdrop-blur-md border border-white/[0.08] rounded-3xl hover:border-indigo-500/30 hover:bg-indigo-500/[0.05] transition-all duration-500">
                  <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-600/20 transition-all">
                    {b.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{b.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTENT RULES */}
        <section id="rules" className="py-24 px-6 relative">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-400 mb-6 border border-red-500/20">
                <Video className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-black tracking-tighter mb-4">Reglas del Contenido</h2>
              <p className="text-white/40">Para calificar para las comisiones y CPM, debes seguir estos requisitos exactos.</p>
            </div>
            <div className="space-y-4">
              {REQUIREMENTS.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-6 p-8 bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-3xl hover:bg-black/80 transition-colors">
                  <span className="text-6xl font-black text-white/5 tracking-tighter leading-none">{item.step}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-8 bg-indigo-900/20 border border-indigo-500/30 rounded-3xl text-center backdrop-blur-sm">
              <h4 className="text-indigo-400 font-bold mb-4 uppercase tracking-widest text-sm">💡 Ejemplo de Apertura (Hook)</h4>
              <p className="text-lg text-white italic font-medium">
                "La app que cambió cómo hago seguimiento de mis clientes — y por qué ya no les pido el peso por WhatsApp..."
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-[#050508]/80 backdrop-blur-xl border-y border-white/5 pointer-events-none" />
          <div className="relative max-w-3xl mx-auto z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tighter mb-4">Preguntas Frecuentes</h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.15] transition-colors">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left">
                    <span className="text-sm md:text-base font-semibold text-white">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-white/40 flex-shrink-0 ml-4 transition-transform ${openFaq === i ? 'rotate-180 text-indigo-400' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-sm text-white/50 leading-relaxed border-t border-white/[0.04] pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section id="aplicar" className="py-24 px-6 relative">
          <div className="relative max-w-2xl mx-auto z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black tracking-tighter mb-4">Aplica Ahora</h2>
              <p className="text-white/40">Responderemos en menos de 48 horas.</p>
            </div>

            {submitted ? (
              <div className="text-center p-12 bg-black/60 backdrop-blur-xl border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-500/10">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white mb-3">¡Aplicación Recibida!</h3>
                <p className="text-white/50 mb-8">Revisaremos tu perfil y te contactaremos a través de tu email o Instagram para coordinar el acuerdo.</p>
                <button onClick={() => onNavigate?.('')} className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all">
                  Volver al Inicio
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-black/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 space-y-6 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">Nombre completo *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">Email de Negocios *</label>
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="tu@email.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">Instagram *</label>
                    <input type="text" required value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="@tuhandle" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">TikTok <span className="normal-case opacity-50">(Opcional)</span></label>
                    <input type="text" value={form.tiktok} onChange={e => setForm({ ...form, tiktok: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="@tuhandle" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">¿Cuántos seguidores tienes? *</label>
                  <input type="text" required value={form.followers} onChange={e => setForm({ ...form, followers: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="Ejemplo: 25,000 en Instagram" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">¿Cuál es tu nicho principal?</label>
                  <select value={form.niche} onChange={e => setForm({ ...form, niche: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer">
                    <option value="" className="bg-black text-white/50">Selecciona tu categoría...</option>
                    <option value="fitness_general" className="bg-black">Fitness General</option>
                    <option value="nutricion" className="bg-black">Nutrición / Dieta</option>
                    <option value="culturismo" className="bg-black">Culturismo / Gym</option>
                    <option value="coaching" className="bg-black">Coaching Online</option>
                    <option value="otro" className="bg-black">Otro</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full py-4 bg-white text-black font-black rounded-xl text-base hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    {loading ? 'Procesando...' : <>Enviar a Revisión <Send className="w-5 h-5" /></>}
                  </button>
                  <p className="text-[10px] text-white/20 text-center leading-relaxed mt-4 uppercase tracking-widest">
                    Sin spam. Aplicación 100% gratuita. 
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative z-10 border-t border-white/5 py-12 px-6 bg-black/50 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <button onClick={() => onNavigate?.('')} className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Activity className="text-white w-4 h-4" />
              </div>
              <span className="font-black tracking-tighter text-white">kCaliper<span className="text-indigo-600">.ai</span></span>
            </button>
            <p className="text-xs text-white/30 uppercase tracking-widest font-bold">© 2026 kCaliper AI</p>
          </div>
        </footer>

      </div>
    </div>
  );
}
