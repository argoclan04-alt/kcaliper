import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, UserPlus, Star, MessageCircle, Trophy, TrendingDown, Zap, Heart } from 'lucide-react';

const firstNames = [
  'María', 'Carlos', 'Ana', 'Diego', 'Laura', 'Pedro', 'Valentina', 'Sebastián',
  'Camila', 'Javier', 'Isabella', 'Roberto', 'Patricia', 'Fernando', 'Daniela',
  'Andrés', 'Sofía', 'Miguel', 'Gabriela', 'Luis', 'Marcela', 'José', 'Natalia',
  'Ricardo', 'Alejandra', 'Eduardo', 'Verónica', 'Pablo', 'Carmen', 'Santiago',
];

const cities = [
  'CDMX', 'Lima', 'Bogotá', 'Buenos Aires', 'Santiago', 'Quito', 'Madrid',
  'Barcelona', 'Medellín', 'Guadalajara', 'Monterrey', 'Panamá', 'San José',
  'Montevideo', 'La Paz', 'Asunción',
];

const eventTemplates = [
  {
    type: 'purchase_athlete',
    icon: ShoppingCart,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20',
    getMessage: (name, city) => ({
      title: `${name} de ${city}`,
      subtitle: 'compró el Plan Atleta 🏋️',
      time: `hace ${Math.floor(Math.random() * 15) + 1} min`,
    }),
  },
  {
    type: 'purchase_coach',
    icon: ShoppingCart,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/20',
    getMessage: (name, city) => ({
      title: `${name} de ${city}`,
      subtitle: 'activó el Plan Coach Pro 🚀',
      time: `hace ${Math.floor(Math.random() * 30) + 1} min`,
    }),
  },
  {
    type: 'signup',
    icon: UserPlus,
    color: 'text-[#00D2FF]',
    bgColor: 'bg-[#00D2FF]/10',
    borderColor: 'border-[#00D2FF]/20',
    getMessage: (name, city) => ({
      title: `${name} de ${city}`,
      subtitle: 'se unió a la lista de espera ✨',
      time: `hace ${Math.floor(Math.random() * 10) + 1} min`,
    }),
  },
  {
    type: 'review',
    icon: Star,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20',
    getMessage: (name) => ({
      title: `${name}`,
      subtitle: `dejó una reseña de ${'⭐'.repeat(Math.floor(Math.random() * 2) + 4)}`,
      time: `hace ${Math.floor(Math.random() * 45) + 5} min`,
    }),
  },
  {
    type: 'milestone',
    icon: Trophy,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
    getMessage: (name) => ({
      title: `🎉 ${name}`,
      subtitle: `alcanzó su peso objetivo!`,
      time: `hace ${Math.floor(Math.random() * 60) + 10} min`,
    }),
  },
  {
    type: 'weight_loss',
    icon: TrendingDown,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20',
    getMessage: (name) => ({
      title: `${name}`,
      subtitle: `perdió ${(Math.random() * 3 + 1).toFixed(1)} kg esta semana 📉`,
      time: `hace ${Math.floor(Math.random() * 20) + 2} min`,
    }),
  },
  {
    type: 'comment',
    icon: MessageCircle,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    getMessage: (name) => {
      const comments = [
        '"La mejor app que he usado"',
        '"CaliBot es increíble"',
        '"Mi coach me la recomendó"',
        '"Ya no le tengo miedo a la báscula"',
        '"Por fin entiendo mis fluctuaciones"',
        '"La recomiendo al 100%"',
      ];
      return {
        title: `${name} comentó:`,
        subtitle: comments[Math.floor(Math.random() * comments.length)],
        time: `hace ${Math.floor(Math.random() * 30) + 1} min`,
      };
    },
  },
  {
    type: 'referral',
    icon: Heart,
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
    borderColor: 'border-pink-400/20',
    getMessage: (name) => ({
      title: `${name}`,
      subtitle: 'invitó a 3 amigos al plan fundador 💜',
      time: `hace ${Math.floor(Math.random() * 25) + 5} min`,
    }),
  },
  {
    type: 'active_users',
    icon: Zap,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-400/20',
    getMessage: () => ({
      title: `${Math.floor(Math.random() * 200) + 300} personas`,
      subtitle: 'están usando kCaliper ahora mismo 🟢',
      time: 'en vivo',
    }),
  },
];

const SocialProofWidget = () => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const generateEvent = useCallback(() => {
    const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    const name = firstNames[Math.floor(Math.random() * firstNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const message = template.getMessage(name, city);

    return {
      id: Date.now(),
      ...template,
      ...message,
    };
  }, []);

  useEffect(() => {
    // Show first event after 5 seconds
    const initialTimeout = setTimeout(() => {
      setCurrentEvent(generateEvent());
      setIsVisible(true);
    }, 5000);

    // Then cycle every 15 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentEvent(generateEvent());
        setIsVisible(true);
      }, 800);
    }, 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [generateEvent]);

  // Auto-hide after 10 seconds
  useEffect(() => {
    if (isVisible) {
      const hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      return () => clearTimeout(hideTimeout);
    }
  }, [isVisible, currentEvent]);

  if (!currentEvent) return null;

  const Icon = currentEvent.icon;

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, x: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0A0A0A]/95 backdrop-blur-xl border ${currentEvent.borderColor} shadow-2xl shadow-black/50 max-w-xs sm:max-w-sm`}
          >
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${currentEvent.bgColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${currentEvent.color}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{currentEvent.title}</p>
              <p className={`text-xs ${currentEvent.color} truncate`}>{currentEvent.subtitle}</p>
            </div>

            {/* Time */}
            <span className="text-white/30 text-[10px] flex-shrink-0 self-start mt-1">
              {currentEvent.time}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialProofWidget;
