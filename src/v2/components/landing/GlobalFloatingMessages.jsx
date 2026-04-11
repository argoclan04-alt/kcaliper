import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Messages for athletes - their internal thoughts/doubts
const athleteMessages = {
  thoughts: [
    "¿Por qué subí si hice todo bien?",
    "Comí canchita, ¿ya engordé?",
    "Estoy con la regla...",
    "¿Es grasa o agua?",
    "Ayer cené tarde",
    "El gym no funciona...",
    "¿Cuánto es normal subir?",
    "Me pesé después de comer",
    "¿El estrés engorda?",
    "No entiendo mi cuerpo",
    "¿Debería pesarme a diario?",
    "Comí mucha sal ayer",
    "Tomé poca agua",
    "¿Es músculo o grasa?",
    "No veo resultados",
    "¿Por qué fluctúa tanto?",
    "Me siento hinchado/a",
    "¿Cuándo veré cambios?",
    "Entrené muy duro ayer",
    "¿Retención de líquidos?",
    "No dormí bien anoche",
    "¿El alcohol afecta?",
    "Comí carbohidratos...",
    "¿Estoy estancado?",
    "Mi báscula está loca",
    "¿Mejor mañana o noche?",
    "Estoy desmotivado/a",
    "¿Funcionará esta vez?",
    "No sé si voy bien",
    "Me da miedo pesarme",
    "¿Por qué tan lento?",
    "Quiero resultados YA",
    "Mi amiga bajó más rápido",
    "¿El metabolismo?",
    "Comí un postre",
    "¿Arruiné mi progreso?",
    "Un día malo...",
    "¿Qué es DEMA?",
    "Necesito motivación",
  ],
  numbers: [
    "78.2 kg", "77.9 kg", "76.5 kg", "79.1 kg", "77.3 kg",
    "78.8 kg", "76.9 kg", "77.5 kg", "78.0 kg", "76.2 kg",
    "79.5 kg", "77.1 kg", "78.4 kg", "76.8 kg", "77.7 kg",
  ],
  trends: [
    "-0.3 kg", "-0.5 kg/sem", "+0.8 kg", "-0.4 kg",
    "DEMA ↓", "Tendencia: OK", "-1.2 kg/mes", "+0.2 kg",
    "-0.6 kg", "↓ 2.1%", "-0.7 kg/sem", "-0.5 kg",
  ],
  calibot: [
    "💧 Retención normal",
    "📊 Tu tendencia va bien",
    "✅ Peso excluido",
    "📉 -0.4 kg/semana",
    "🎯 En objetivo",
    "💪 Sigue así",
  ]
};

// Messages for coaches - athletes bothering them + notifications
const coachMessages = {
  // Athletes bothering the coach
  athleteQuestions: [
    "Coach, ¿por qué subí 300g?",
    "Si comí canchita, ¿me peso?",
    "Estoy bajando 1kg/sem, ¿está bien?",
    "¿Es normal bajar tan lento?",
    "Coach, ¿me desvié mucho?",
    "No me quiero pesar hoy...",
    "¿El peso de hoy cuenta?",
    "Comí postre, ¿qué hago?",
    "¿Por qué no bajo más rápido?",
    "Coach, estoy estancado",
    "¿Puedo comer carbohidratos?",
    "No entiendo mis números",
    "¿Está funcionando el plan?",
    "Me siento hinchada, ¿me peso?",
    "Coach, ¿voy bien o mal?",
    "¿Cuánto debería pesar?",
    "¿Es grasa o agua?",
    "Subí después del gym...",
    "¿El estrés me afecta?",
    "No dormí bien, ¿me peso?",
  ],
  // WhatsApp notifications from Kcaliper
  notifications: [
    "🔔 María cumplió milestone!",
    "⚠️ Juan: 3 días sin peso",
    "🎯 Carlos alcanzó 75 kg",
    "📉 Ana se desvió del plan",
    "✅ Pedro: tendencia perfecta",
    "🔴 Laura: peso atípico",
    "📊 5 atletas activos hoy",
    "⚡ Alerta: Diego inactivo",
    "🎉 Nuevo mínimo histórico",
    "📱 3 mensajes pendientes",
    "🟢 87% de retención",
    "⚠️ Revisar a María",
    "🔔 Milestone cercano: Juan",
    "📈 Tendencia positiva: Ana",
    "🎯 Meta cumplida: Pedro",
  ],
  // Coach frustrations (before Kcaliper)
  frustrations: [
    "¿Se habrá pesado?",
    "3 sin reportar...",
    "Otro cliente fantasma",
    "¿Mandé el recordatorio?",
    "+15 mensajes pendientes",
    "¿Dónde anoté su peso?",
    "Excel otra vez...",
    "¿Sigue el plan?",
    "No tengo tiempo",
    "2h persiguiendo datos",
  ],
  metrics: [
    "85 atletas activos",
    "92% retención",
    "15 nuevos este mes",
    "$12.99/mes ROI",
    "0 horas persiguiendo",
    "Dashboard unificado",
  ]
};

const GlobalFloatingMessages = ({ type = 'athlete' }) => {
  const [elements, setElements] = useState([]);
  const messages = type === 'athlete' ? athleteMessages : coachMessages;

  const generateElement = useCallback((id) => {
    const categories = Object.keys(messages);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const items = messages[category];
    const value = items[Math.floor(Math.random() * items.length)];
    
    return {
      id: `${id}-${Date.now()}`,
      value,
      category,
      startX: Math.random() * 80 + 10, // 10-90%
      startY: Math.random() * 100, // Will be positioned based on scroll
      duration: 6 + Math.random() * 4, // 6-10 seconds
      direction: Math.random() > 0.5 ? 1 : -1,
      size: Math.random() > 0.7 ? 'large' : 'small',
    };
  }, [messages]);

  useEffect(() => {
    // Generate initial batch
    const initialElements = Array.from({ length: 25 }, (_, i) => generateElement(i));
    setElements(initialElements);

    // Continuously regenerate elements
    const interval = setInterval(() => {
      setElements(prev => {
        const newElements = [...prev];
        // Replace 3-5 random elements
        const replaceCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < replaceCount; i++) {
          const randomIndex = Math.floor(Math.random() * newElements.length);
          newElements[randomIndex] = generateElement(Date.now() + i);
        }
        return newElements;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [generateElement]);

  const getStyles = (category, size) => {
    const baseSize = size === 'large' ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs';
    
    if (type === 'athlete') {
      switch (category) {
        case 'thoughts':
          return `${baseSize} text-white/20 italic max-w-[140px]`;
        case 'numbers':
          return `font-mono ${baseSize} text-[#00D2FF]/30 font-bold`;
        case 'trends':
          return `font-mono ${baseSize} text-green-400/30 font-semibold`;
        case 'calibot':
          return `${baseSize} text-[#00D2FF]/25 font-medium`;
        default:
          return `${baseSize} text-white/20`;
      }
    } else {
      switch (category) {
        case 'athleteQuestions':
          return `${baseSize} text-white/25 italic max-w-[150px]`;
        case 'notifications':
          return `${baseSize} text-orange-400/30 font-medium max-w-[160px]`;
        case 'frustrations':
          return `${baseSize} text-red-400/20 italic max-w-[130px]`;
        case 'metrics':
          return `font-mono ${baseSize} text-orange-300/30 font-bold`;
        default:
          return `${baseSize} text-white/20`;
      }
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      <AnimatePresence mode="popLayout">
        {elements.map((el) => (
          <motion.div
            key={el.id}
            initial={{ 
              opacity: 0,
              y: '100vh',
              x: 0,
            }}
            animate={{ 
              opacity: [0, 0.9, 0.9, 0],
              y: '-100vh',
              x: [0, el.direction * 50, el.direction * 30, el.direction * 60],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: el.duration,
              ease: "linear",
              times: [0, 0.1, 0.9, 1],
            }}
            className={`absolute whitespace-pre-wrap text-center ${getStyles(el.category, el.size)}`}
            style={{ 
              left: `${el.startX}%`,
              top: `${el.startY}%`,
            }}
          >
            {el.value}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GlobalFloatingMessages;
