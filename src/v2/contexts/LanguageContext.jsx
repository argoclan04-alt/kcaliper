import React, { createContext, useContext, useState } from 'react';

const translations = {
  es: {
    nav: {
      features: 'Características',
      demo: 'Demo',
      pricing: 'Precios',
      faq: 'FAQ',
      joinBeta: 'Únete a la Beta'
    },
    hero: {
      badge: 'IMPULSADO POR IA',
      title: 'Nunca más estarás',
      titleHighlight: 'solo',
      titleEnd: 'en tu transformación',
      coachTitle: 'El sistema nervioso central del',
      coachHighlight: 'entrenador moderno',
      subtitle: 'CaliBot analiza tu peso con matemáticas avanzadas y te acompaña 24/7 vía WhatsApp. Sin conjeturas. Sin estrés. Solo resultados.',
      placeholder: 'Tu email profesional',
      cta: 'Quiero Acceso Anticipado',
      liveCounter: 'entrenadores en la lista de espera',
      trustedBy: 'Confiado por coaches de élite en',
      countries: '12 países'
    },
    calibot: {
      title: 'Conoce a CaliBot',
      subtitle: 'Tu compañero de IA disponible 24/7 vía WhatsApp',
      typing: 'CaliBot está escribiendo...',
      messages: [
        { sender: 'user', text: '¡Hola! Me pesé hoy: 78.2 kg' },
        { sender: 'bot', text: '¡Perfecto! 📊 Tu peso de hoy (78.2 kg) está dentro del rango esperado.' },
        { sender: 'bot', text: 'Tu tendencia DEMA: 78.5 kg → vas en la dirección correcta. Has bajado 0.3 kg esta semana. ¡Sigue así! 💪' },
        { sender: 'user', text: '¿Por qué subí ayer si estoy haciendo todo bien?' },
        { sender: 'bot', text: 'Tranquilo, es completamente normal. Las fluctuaciones diarias (±1-2 kg) se deben a retención de agua, digestión o ejercicio intenso. Lo importante es tu TENDENCIA, no el número de un día. 📈' }
      ]
    },
    problem: {
      title: 'El problema que resolvemos',
      subtitle: 'El 73% de las personas abandonan su transformación en los primeros 30 días',
      problems: [
        { title: 'Confusión Diaria', desc: 'El peso fluctúa hasta 2kg por día. Sin contexto, cada número genera ansiedad.' },
        { title: 'Falta de Seguimiento', desc: 'Los coaches pierden horas persiguiendo datos de clientes que no responden.' },
        { title: 'Abandono Silencioso', desc: 'Sin feedback inmediato, los atletas se desmotivan y desaparecen.' }
      ],
      solutionTitle: 'La solución Kcaliper',
      solutions: [
        { title: 'Análisis DEMA', desc: 'Matemáticas avanzadas que eliminan el ruido y muestran tu progreso real.' },
        { title: 'Alertas Automáticas', desc: 'El coach recibe notificaciones inteligentes sin perseguir a nadie.' },
        { title: 'CaliBot 24/7', desc: 'Un compañero de IA que responde instantáneamente y nunca te deja solo.' }
      ]
    },
    features: {
      title: 'Diseñado para resultados',
      subtitle: 'Una plataforma. Dos experiencias. Cero fricción.',
      tabAthletes: 'Para Atletas',
      tabCoaches: 'Para Entrenadores',
      athletes: [
        { title: 'Logbook Personal', desc: 'Registra tu peso en segundos desde WhatsApp o la app.' },
        { title: 'Tendencia Real', desc: 'Ve tu progreso real con gráficos DEMA que eliminan el ruido.' },
        { title: 'CaliBot 24/7', desc: 'Recibe explicaciones instantáneas cuando algo no tiene sentido.' },
        { title: 'Hitos y Celebraciones', desc: 'Reconocimiento automático cuando alcanzas tus metas.' }
      ],
      coaches: [
        { title: 'Dashboard Centralizado', desc: 'Todos tus clientes en un solo lugar, ordenados por prioridad.' },
        { title: 'Alertas Inteligentes', desc: 'Recibe notificaciones solo cuando realmente importa.' },
        { title: 'Análisis de Tendencias', desc: 'Datos procesados y listos para tomar decisiones.' },
        { title: 'Escalabilidad', desc: 'Gestiona 100 atletas con el mismo esfuerzo que 10.' }
      ]
    },
    trend: {
      title: 'Visualiza tu progreso real',
      subtitle: 'El algoritmo DEMA elimina el ruido diario y revela tu verdadera tendencia',
      daily: 'Peso Diario',
      trend: 'Tendencia DEMA',
      label: 'kg'
    },
    pricing: {
      badge: 'PRECIO FUNDADOR',
      title: 'Acceso anticipado con precio especial',
      subtitle: 'Solo para los primeros 500 fundadores',
      spotsLeft: 'plazas restantes',
      countdown: 'Cierra en',
      days: 'd',
      hours: 'h',
      mins: 'm',
      secs: 's',
      plans: {
        athlete: {
          name: 'Atleta Pro',
          price: '$3.99',
          originalPrice: '$9.99',
          period: '/mes',
          features: [
            'Logbook personal ilimitado',
            'Análisis DEMA automático',
            'Acceso a CaliBot 24/7',
            'Gráficos de tendencia',
            'Recordatorios personalizados'
          ]
        },
        coach: {
          name: 'Coach Professional',
          price: '$12.99',
          originalPrice: '$29.99',
          period: '/mes',
          badge: 'MÁS POPULAR',
          features: [
            'Atletas ilimitados',
            'Dashboard centralizado',
            'Alertas inteligentes',
            'Análisis de tendencias',
            'CaliBot personalizado',
            'Soporte prioritario'
          ]
        }
      },
      cta: 'Reservar mi plaza'
    },
    testimonials: {
      title: 'Lo que dicen los expertos',
      subtitle: 'Coaches que ya transformaron su forma de trabajar',
      items: [
        { name: 'Carlos Mendoza', role: 'Coach de Fitness, México', text: 'Antes perdía 2 horas diarias persiguiendo datos. Ahora Kcaliper me los entrega procesados. Mis clientes están más comprometidos que nunca.' },
        { name: 'María González', role: 'Nutricionista, España', text: 'CaliBot es como tener un asistente que nunca duerme. Mis pacientes se sienten acompañados 24/7 y yo puedo enfocarme en lo que importa.' },
        { name: 'Andrés Silva', role: 'Preparador Físico, Colombia', text: 'La retención de mis clientes aumentó un 40% desde que uso Kcaliper. El precio es ridículamente bajo para el valor que entrega.' }
      ]
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: [
        { q: '¿Qué es DEMA y por qué es importante?', a: 'DEMA (Double Exponential Moving Average) es un algoritmo matemático que suaviza las fluctuaciones diarias del peso para mostrarte tu tendencia real. Es como ver a través del ruido para entender si realmente estás progresando.' },
        { q: '¿Cómo funciona CaliBot?', a: 'CaliBot es un asistente de IA integrado en WhatsApp. Puedes enviarle tu peso diario y recibirás análisis instantáneos, explicaciones cuando algo parece extraño, y motivación personalizada.' },
        { q: '¿Puedo usar Kcaliper sin un coach?', a: 'Sí, el plan Atleta Pro funciona perfectamente de forma independiente. Tendrás acceso a todas las herramientas de seguimiento y análisis, más CaliBot como tu compañero 24/7.' },
        { q: '¿El precio fundador es para siempre?', a: 'Sí. Si te unes durante la fase de acceso anticipado, mantendrás el precio fundador mientras tu suscripción esté activa.' },
        { q: '¿Qué pasa con mis datos?', a: 'Tu privacidad es sagrada. Tus datos están encriptados, nunca se venden a terceros, y puedes exportarlos o eliminarlos cuando quieras.' }
      ]
    },
    cta: {
      title: '¿Listo para transformarte?',
      subtitle: 'Únete a miles de atletas y coaches que ya dejaron de adivinar',
      placeholder: 'Tu mejor email',
      button: 'Quiero Acceso Anticipado',
      privacy: 'Sin spam. Cancelar en cualquier momento.'
    },
    footer: {
      tagline: 'Eliminamos las conjeturas del peso corporal con matemáticas e IA.',
      links: {
        product: 'Producto',
        features: 'Características',
        pricing: 'Precios',
        demo: 'Demo',
        company: 'Empresa',
        about: 'Nosotros',
        blog: 'Blog',
        careers: 'Carreras',
        legal: 'Legal',
        privacy: 'Privacidad',
        terms: 'Términos'
      },
      copyright: '© 2025 kcaliper.com. Todos los derechos reservados.'
    }
  },
  en: {
    nav: {
      features: 'Features',
      demo: 'Demo',
      pricing: 'Pricing',
      faq: 'FAQ',
      joinBeta: 'Join the Beta'
    },
    hero: {
      badge: 'POWERED BY AI',
      title: "You'll never be",
      titleHighlight: 'alone',
      titleEnd: 'in your transformation',
      coachTitle: 'The central nervous system of the',
      coachHighlight: 'modern coach',
      subtitle: 'CaliBot analyzes your weight with advanced mathematics and accompanies you 24/7 via WhatsApp. No guesswork. No stress. Just results.',
      placeholder: 'Your professional email',
      cta: 'Get Early Access',
      liveCounter: 'coaches on the waitlist',
      trustedBy: 'Trusted by elite coaches in',
      countries: '12 countries'
    },
    calibot: {
      title: 'Meet CaliBot',
      subtitle: 'Your AI companion available 24/7 via WhatsApp',
      typing: 'CaliBot is typing...',
      messages: [
        { sender: 'user', text: 'Hey! I weighed myself today: 78.2 kg' },
        { sender: 'bot', text: 'Perfect! 📊 Your weight today (78.2 kg) is within the expected range.' },
        { sender: 'bot', text: 'Your DEMA trend: 78.5 kg → you\'re heading in the right direction. You\'ve lost 0.3 kg this week. Keep it up! 💪' },
        { sender: 'user', text: 'Why did I gain yesterday if I\'m doing everything right?' },
        { sender: 'bot', text: 'Don\'t worry, it\'s completely normal. Daily fluctuations (±1-2 kg) are due to water retention, digestion, or intense exercise. What matters is your TREND, not a single day\'s number. 📈' }
      ]
    },
    problem: {
      title: 'The problem we solve',
      subtitle: '73% of people abandon their transformation in the first 30 days',
      problems: [
        { title: 'Daily Confusion', desc: 'Weight fluctuates up to 2kg per day. Without context, every number causes anxiety.' },
        { title: 'Lack of Follow-up', desc: 'Coaches waste hours chasing data from unresponsive clients.' },
        { title: 'Silent Abandonment', desc: 'Without immediate feedback, athletes lose motivation and disappear.' }
      ],
      solutionTitle: 'The Kcaliper solution',
      solutions: [
        { title: 'DEMA Analysis', desc: 'Advanced mathematics that eliminate noise and show your real progress.' },
        { title: 'Automatic Alerts', desc: 'Coaches receive smart notifications without chasing anyone.' },
        { title: 'CaliBot 24/7', desc: 'An AI companion that responds instantly and never leaves you alone.' }
      ]
    },
    features: {
      title: 'Designed for results',
      subtitle: 'One platform. Two experiences. Zero friction.',
      tabAthletes: 'For Athletes',
      tabCoaches: 'For Coaches',
      athletes: [
        { title: 'Personal Logbook', desc: 'Log your weight in seconds from WhatsApp or the app.' },
        { title: 'Real Trend', desc: 'See your real progress with DEMA charts that eliminate noise.' },
        { title: 'CaliBot 24/7', desc: 'Get instant explanations when something doesn\'t make sense.' },
        { title: 'Milestones & Celebrations', desc: 'Automatic recognition when you reach your goals.' }
      ],
      coaches: [
        { title: 'Centralized Dashboard', desc: 'All your clients in one place, sorted by priority.' },
        { title: 'Smart Alerts', desc: 'Get notifications only when it really matters.' },
        { title: 'Trend Analysis', desc: 'Processed data ready for decision-making.' },
        { title: 'Scalability', desc: 'Manage 100 athletes with the same effort as 10.' }
      ]
    },
    trend: {
      title: 'Visualize your real progress',
      subtitle: 'The DEMA algorithm eliminates daily noise and reveals your true trend',
      daily: 'Daily Weight',
      trend: 'DEMA Trend',
      label: 'kg'
    },
    pricing: {
      badge: 'FOUNDER PRICING',
      title: 'Early access with special pricing',
      subtitle: 'Only for the first 500 founders',
      spotsLeft: 'spots remaining',
      countdown: 'Closes in',
      days: 'd',
      hours: 'h',
      mins: 'm',
      secs: 's',
      plans: {
        athlete: {
          name: 'Athlete Pro',
          price: '$3.99',
          originalPrice: '$9.99',
          period: '/month',
          features: [
            'Unlimited personal logbook',
            'Automatic DEMA analysis',
            '24/7 CaliBot access',
            'Trend charts',
            'Personalized reminders'
          ]
        },
        coach: {
          name: 'Coach Professional',
          price: '$12.99',
          originalPrice: '$29.99',
          period: '/month',
          badge: 'MOST POPULAR',
          features: [
            'Unlimited athletes',
            'Centralized dashboard',
            'Smart alerts',
            'Trend analysis',
            'Customized CaliBot',
            'Priority support'
          ]
        }
      },
      cta: 'Reserve my spot'
    },
    testimonials: {
      title: 'What the experts say',
      subtitle: 'Coaches who have already transformed their workflow',
      items: [
        { name: 'Carlos Mendoza', role: 'Fitness Coach, Mexico', text: 'I used to waste 2 hours daily chasing data. Now Kcaliper delivers it processed. My clients are more engaged than ever.' },
        { name: 'María González', role: 'Nutritionist, Spain', text: 'CaliBot is like having an assistant that never sleeps. My patients feel supported 24/7 and I can focus on what matters.' },
        { name: 'Andrés Silva', role: 'Physical Trainer, Colombia', text: 'My client retention increased 40% since using Kcaliper. The price is ridiculously low for the value it delivers.' }
      ]
    },
    faq: {
      title: 'Frequently asked questions',
      items: [
        { q: 'What is DEMA and why is it important?', a: 'DEMA (Double Exponential Moving Average) is a mathematical algorithm that smooths daily weight fluctuations to show your real trend. It\'s like seeing through the noise to understand if you\'re really progressing.' },
        { q: 'How does CaliBot work?', a: 'CaliBot is an AI assistant integrated into WhatsApp. You can send your daily weight and receive instant analysis, explanations when something seems off, and personalized motivation.' },
        { q: 'Can I use Kcaliper without a coach?', a: 'Yes, the Athlete Pro plan works perfectly independently. You\'ll have access to all tracking and analysis tools, plus CaliBot as your 24/7 companion.' },
        { q: 'Is the founder price forever?', a: 'Yes. If you join during early access, you\'ll keep the founder price as long as your subscription is active.' },
        { q: 'What happens with my data?', a: 'Your privacy is sacred. Your data is encrypted, never sold to third parties, and you can export or delete it anytime.' }
      ]
    },
    cta: {
      title: 'Ready to transform?',
      subtitle: 'Join thousands of athletes and coaches who stopped guessing',
      placeholder: 'Your best email',
      button: 'Get Early Access',
      privacy: 'No spam. Cancel anytime.'
    },
    footer: {
      tagline: 'We eliminate body weight guesswork with math and AI.',
      links: {
        product: 'Product',
        features: 'Features',
        pricing: 'Pricing',
        demo: 'Demo',
        company: 'Company',
        about: 'About Us',
        blog: 'Blog',
        careers: 'Careers',
        legal: 'Legal',
        privacy: 'Privacy',
        terms: 'Terms'
      },
      copyright: '© 2025 kcaliper.com. All rights reserved.'
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');
  
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
