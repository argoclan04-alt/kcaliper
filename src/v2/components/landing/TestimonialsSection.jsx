import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const reviews = [
  {
    name: 'Carlos Mendoza',
    role: 'Coach de Fitness, México',
    stars: 5,
    text: 'Antes perdía 2 horas diarias persiguiendo datos. Ahora Kcaliper me los entrega procesados. Mis clientes están más comprometidos que nunca.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Carlos&backgroundColor=b6e3f4',
  },
  {
    name: 'María González',
    role: 'Nutricionista, España',
    stars: 5,
    text: 'CaliBot es como tener un asistente que nunca duerme. Mis pacientes se sienten acompañados 24/7 y yo puedo enfocarme en lo que importa.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Maria&backgroundColor=ffd5dc',
  },
  {
    name: 'Andrés Silva',
    role: 'Preparador Físico, Colombia',
    stars: 5,
    text: 'La retención de mis clientes aumentó un 40% desde que uso Kcaliper. El precio es ridiculamente bajo para el valor que entrega.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Andres&backgroundColor=c0aede',
  },
  {
    name: 'Laura Jiménez',
    role: 'Atleta amateur',
    stars: 5,
    text: 'x fin entiendo porq subo de peso despues d comer sal jajaaj antes me frustraba un monton',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Laura&backgroundColor=ffd5dc',
  },
  {
    name: 'Roberto Díaz',
    role: 'Entrenador personal, Argentina',
    stars: 4,
    text: 'Llevo 3 meses usando la app y la verdad es que ha cambiado bastante mi forma de trabajar con clientes. Antes tenía todo en hojas de Excel, los pesos los anotaba a mano y a veces se me olvidaba actualizar. Ahora todo es automático y mis atletas pueden ver su progreso en tiempo real. Lo único que le falta es poder exportar informes en PDF, pero sé que lo están desarrollando.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Roberto&backgroundColor=b6e3f4',
  },
  {
    name: 'Valentina Morales',
    role: 'Fitness enthusiast',
    stars: 5,
    text: 'me encantaaa!! ya no me estreso cn la bascula',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Valentina&backgroundColor=ffd5dc',
  },
  {
    name: 'Diego Herrera',
    role: 'CrossFit Coach, Perú',
    stars: 5,
    text: 'Tengo 45 atletas y antes era imposible darle seguimiento real a cada uno. Con el dashboard de Kcaliper puedo ver alertas cuando alguien se desvía y actuar rápido. Es exactamente lo que necesitaba.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Diego&backgroundColor=b6e3f4',
  },
  {
    name: 'Camila Rojas',
    role: 'Estudiante universitaria',
    stars: 5,
    text: 'Brutal 🔥',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Camila&backgroundColor=ffd5dc',
  },
  {
    name: 'Fernando Castillo',
    role: 'Nutriólogo deportivo, Chile',
    stars: 5,
    text: 'He probado muchas apps de tracking y ninguna entiende las fluctuaciones como Kcaliper. El algoritmo DEMA es legítimamente superior a cualquier promedio móvil estándar. Mis colegas me preguntan qué herramienta uso cuando ven mis reportes.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Fernando&backgroundColor=c0aede',
  },
  {
    name: 'Ana Lucia Paredes',
    role: 'Coach online',
    stars: 4,
    text: 'Esta muy buena la app, al principio no entendia bn como funcionaba pero ya le agarre la onda. mis clientes la aman',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=AnaLucia&backgroundColor=ffd5dc',
  },
  {
    name: 'Sebastián Torres',
    role: 'Powerlifter, Ecuador',
    stars: 5,
    text: 'Lo mejor es que CaliBot no juzga. Le digo que comí pizza y me explica tranquilamente por qué subí al día siguiente. Me ayudó a dejar de tenerle miedo a la báscula.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sebastian&backgroundColor=b6e3f4',
  },
  {
    name: 'Patricia Vega',
    role: 'Mamá fitness',
    stars: 5,
    text: 'increible app!! la uso todos los dias',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Patricia&backgroundColor=ffd5dc',
  },
  {
    name: 'Javier Ríos',
    role: 'Entrenador, Uruguay',
    stars: 5,
    text: 'Antes mis clientes me mandaban WhatsApp a las 6am preguntando por qué subieron. Ahora CaliBot les responde antes de que yo despierte. Literalmente me devolvió mis mañanas.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Javier&backgroundColor=c0aede',
  },
  {
    name: 'Isabella Martín',
    role: 'Competidora bikini',
    stars: 5,
    text: 'En prep para competencia cada gramo importa. Las tendencias de Kcaliper me dan la claridad que necesito para no entrar en pánico cuando fluctúo. Mi coach también la usa para monitorizarme y dice que le facilita mucho el trabajo. 100% recomendada para cualquier competidor serio.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Isabella&backgroundColor=ffd5dc',
  },
  {
    name: 'Miguel Ángel Pérez',
    role: 'Personal trainer, Panamá',
    stars: 4,
    text: 'buena herramienta, el unico pero q le pongo es q aveces tarda un poco en cargar pero nada grave. la recomiendo',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=MiguelAngel&backgroundColor=b6e3f4',
  },
];

const TestimonialsSection = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const autoPlayRef = useRef(null);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % totalPages);
    }, 6000);
    return () => clearInterval(autoPlayRef.current);
  }, [totalPages]);

  const goToPage = (page) => {
    setCurrentPage(page);
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % totalPages);
    }, 6000);
  };

  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    currentPage * reviewsPerPage + reviewsPerPage
  );

  return (
    <section className="relative py-24 lg:py-32 bg-black overflow-hidden" id="testimonials">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,210,255,0.1),transparent)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Atletas y coaches que ya transformaron su forma de entender el peso
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => goToPage((currentPage - 1 + totalPages) % totalPages)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-20 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 text-white/70" />
          </button>
          <button
            onClick={() => goToPage((currentPage + 1) % totalPages)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-20 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 text-white/70" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {currentReviews.map((review, i) => (
                <motion.div
                  key={review.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#00D2FF]/30 transition-all group"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-12 h-12 text-[#00D2FF]" />
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${
                          j < review.stars
                            ? 'fill-[#00D2FF] text-[#00D2FF]'
                            : 'fill-white/10 text-white/10'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-white/70 leading-relaxed mb-6 relative z-10 text-sm">
                    "{review.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full bg-[#1a1a1a]"
                    />
                    <div>
                      <div className="text-white font-semibold">{review.name}</div>
                      <div className="text-white/50 text-sm">{review.role}</div>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#00D2FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Dots Pagination */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === currentPage
                    ? 'w-8 h-2 bg-[#00D2FF]'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Página ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 p-6 rounded-2xl bg-[#0A0A0A] border border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '4.9/5', label: 'Calificación promedio' },
              { value: '500+', label: 'Coaches activos' },
              { value: '12K+', label: 'Atletas registrados' },
              { value: '98%', label: 'Tasa de satisfacción' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
