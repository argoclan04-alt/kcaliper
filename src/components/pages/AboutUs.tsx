import { ArrowLeft, Activity, Heart, Target, Zap } from 'lucide-react';

export function AboutUs({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen fp-dark-bg" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto px-5 py-16 max-w-3xl">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white mb-8 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-fp-gradient rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Nosotros</h1>
        </div>
        <div className="space-y-10 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-2xl font-extrabold text-white mb-4">Precisión en cada gramo. <span className="text-fp-gradient">Inteligencia en cada decisión.</span></h2>
            <p className="text-base text-white/60 leading-relaxed">kCaliper.ai nació de una frustración real: la desconexión entre lo que la báscula dice y lo que realmente está pasando con tu cuerpo. Fundada por coaches y profesionales del fitness que entendían el problema de primera mano, creamos la plataforma que nosotros mismos queríamos usar.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-4">Nuestra Misión</h2>
            <p>Democratizar el acceso a análisis de composición corporal inteligente. Que cada persona que entrena — ya sea con coach o por su cuenta — tenga la misma calidad de seguimiento y análisis que un atleta élite.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-6">Nuestros Valores</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <Target className="w-5 h-5" />, title: 'Precisión', desc: 'DEMA no es un promedio simple. Es ciencia real aplicada a tu progreso.' },
                { icon: <Heart className="w-5 h-5" />, title: 'Empatía', desc: 'Sabemos lo frustrante que es ver la báscula subir cuando estás dando todo.' },
                { icon: <Zap className="w-5 h-5" />, title: 'Innovación', desc: 'CaliBot es el primer coach de IA especializado en composición corporal.' },
                { icon: <Activity className="w-5 h-5" />, title: 'Transparencia', desc: 'Tus datos son tuyos. Sin trucos, sin ventas a terceros, sin letras pequeñas.' },
              ].map((v, i) => (
                <div key={i} className="fp-dark-card rounded-xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center mb-3">{v.icon}</div>
                  <h3 className="font-bold text-white mb-1">{v.title}</h3>
                  <p className="text-xs text-white/50">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-4">¿Por qué "kCaliper"?</h2>
            <p>Un caliper (calibrador) es el instrumento de precisión por excelencia para medir composición corporal. La "k" representa la constante de precisión en nuestros algoritmos. Juntos, kCaliper.ai simboliza la medición precisa potenciada por inteligencia artificial.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-4">Contacto</h2>
            <p>¿Preguntas, sugerencias o simplemente quieres decir hola? Escríbenos a <a href="mailto:hola@kcaliper.ai" className="text-[#6C5CE7] hover:underline">hola@kcaliper.ai</a></p>
            <p className="mt-2">Síguenos en <a href="https://instagram.com/kcaliper.ai" target="_blank" rel="noopener" className="text-[#6C5CE7] hover:underline">@kcaliper.ai</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
