import { motion } from 'framer-motion';
import { 
  Target, Heart, Zap, Users, Brain, Shield, 
  ArrowRight, Linkedin, Twitter, Globe, ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import GlobalFloatingMessages from '../components/landing/GlobalFloatingMessages';
import FomoBanner from '../components/landing/FomoBanner';

const NosotrosPage = () => {
  const values = [
    { icon: Target, title: 'Precisión', desc: 'Matemáticas avanzadas que eliminan las conjeturas del peso corporal.' },
    { icon: Heart, title: 'Empatía', desc: 'Entendemos lo difícil que es transformarse. CaliBot nunca juzga.' },
    { icon: Zap, title: 'Velocidad', desc: 'Respuestas instantáneas 24/7 vía WhatsApp.' },
    { icon: Shield, title: 'Privacidad', desc: 'Tus datos son sagrados. Encriptados y nunca vendidos.' },
  ];

  const team = [
    { 
      name: 'Fundador & CEO', 
      role: 'Visión y Producto', 
      bio: 'Obsesionado con resolver el problema de la confusión del peso con tecnología.',
      initials: 'CEO'
    },
    { 
      name: 'CTO', 
      role: 'Tecnología e IA', 
      bio: 'Arquitecto del motor DEMA y la inteligencia detrás de CaliBot.',
      initials: 'CTO'
    },
    { 
      name: 'Head of Product', 
      role: 'Experiencia de Usuario', 
      bio: 'Diseñando experiencias que los atletas y coaches aman usar.',
      initials: 'HPD'
    },
  ];

  const milestones = [
    { year: '2024', title: 'Idea nace', desc: 'Frustración personal con apps de peso existentes' },
    { year: '2024', title: 'Algoritmo DEMA', desc: 'Desarrollo del motor matemático' },
    { year: '2025', title: 'CaliBot beta', desc: 'Primera versión del asistente IA' },
    { year: '2025', title: 'Pre-lanzamiento', desc: 'Abrimos lista de espera para fundadores' },
    { year: '2026', title: 'Lanzamiento', desc: 'Disponible para todos (próximamente)' },
  ];

  return (
    <div className="min-h-screen bg-black relative">
      {/* Global floating messages */}
      <GlobalFloatingMessages type="athlete" />

      {/* FOMO Banner */}
      <FomoBanner type="athlete" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D2FF] to-[#00D2FF]/50 flex items-center justify-center">
                <span className="font-black text-black text-sm">K</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">
                kcaliper<span className="text-[#00D2FF]">.ai</span>
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <Link 
                to="/" 
                className="flex items-center gap-1 text-white/60 hover:text-white text-sm font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Volver
              </Link>
              <Link 
                to="/coaches" 
                className="text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors"
              >
                Para Coaches
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00D2FF]/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 mb-8">
              <Users className="w-4 h-4 text-[#00D2FF]" />
              <span className="text-[#00D2FF] text-sm font-semibold tracking-widest uppercase">
                NUESTRA HISTORIA
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Eliminamos las conjeturas del{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] to-cyan-300">
                peso corporal
              </span>
            </h1>

            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Nacimos de una frustración personal: pesarse cada día y no entender los números. 
              Hoy, ayudamos a miles de atletas y coaches a tomar decisiones basadas en datos, no en ansiedad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
                Nuestra Misión
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                Creemos que nadie debería sentirse solo en su transformación. El peso fluctúa por mil razones 
                que no son grasa: agua, sodio, ciclo menstrual, estrés, sueño...
              </p>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                Sin contexto, estos números generan ansiedad. Con contexto, se convierten en información valiosa.
              </p>
              <p className="text-[#00D2FF] text-lg font-semibold">
                Kcaliper traduce datos crudos en claridad. CaliBot te acompaña 24/7 para que nunca 
                tengas que preguntarte "¿por qué subí?" sin respuesta.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-[#111] rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '10K+', label: 'Atletas registrados' },
                    { value: '500+', label: 'Coaches activos' },
                    { value: '99%', label: 'Precisión DEMA' },
                    { value: '24/7', label: 'CaliBot disponible' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-3xl font-black text-[#00D2FF] mb-1">{stat.value}</div>
                      <div className="text-white/50 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -inset-2 bg-[#00D2FF]/10 rounded-2xl blur-xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              Nuestros Valores
            </h2>
            <p className="text-white/60 text-lg">Lo que nos guía en cada decisión</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#00D2FF]/40 transition-all text-center group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#00D2FF]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00D2FF]/20 transition-colors">
                  <value.icon className="w-7 h-7 text-[#00D2FF]" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-white/50 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              Nuestra Historia
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00D2FF] to-[#00D2FF]/20 hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                    <div className="text-[#00D2FF] font-mono text-sm mb-1">{milestone.year}</div>
                    <h3 className="text-white font-semibold text-lg mb-1">{milestone.title}</h3>
                    <p className="text-white/50 text-sm">{milestone.desc}</p>
                  </div>
                  <div className="relative z-10 w-4 h-4 rounded-full bg-[#00D2FF] flex-shrink-0 hidden md:block">
                    <div className="absolute inset-0 rounded-full bg-[#00D2FF] animate-ping opacity-30" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              El Equipo
            </h2>
            <p className="text-white/60 text-lg">Obsesionados con resolver este problema</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00D2FF] to-cyan-600 flex items-center justify-center mx-auto mb-4 text-black font-black text-xl">
                  {member.initials}
                </div>
                <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                <p className="text-[#00D2FF] text-sm mb-2">{member.role}</p>
                <p className="text-white/50 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
              ¿Listo para unirte a la revolución?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Sé parte de los fundadores que están transformando la forma en que entendemos nuestro peso.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 bg-[#00D2FF] text-black font-bold px-8 py-4 rounded-full hover:bg-[#33DBFF] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] transition-all"
              >
                Soy Atleta <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/coaches"
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold px-8 py-4 rounded-full hover:shadow-[0_0_30px_rgba(251,146,60,0.5)] transition-all"
              >
                Soy Coach <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D2FF] to-[#00D2FF]/50 flex items-center justify-center">
                <span className="font-black text-black text-sm">K</span>
              </div>
              <span className="font-heading font-bold text-white">
                kcaliper<span className="text-[#00D2FF]">.ai</span>
              </span>
            </div>
            <p className="text-white/50 text-sm">
              Eliminamos las conjeturas del peso con matemáticas e IA.
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

export default NosotrosPage;
