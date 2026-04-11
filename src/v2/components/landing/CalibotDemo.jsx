import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, MoreVertical, CheckCheck, Send } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const CalibotDemo = () => {
  const { t, language } = useLanguage();
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const containerRef = useRef(null);

  // New realistic conversation about popcorn/sodium
  const messagesES = [
    { sender: 'user', text: 'Hola, ¿por qué subí 800g si solo comí canchita ayer? :(' },
    { sender: 'bot', text: '¡Tranquilo! 😊 Esa variación es completamente normal. Las palomitas de maíz tienen alto contenido de sodio, lo que causa retención temporal de agua.' },
    { sender: 'bot', text: 'No es grasa real. Tu cuerpo está reteniendo líquidos para equilibrar el sodio. Esto desaparecerá en 24-48 horas. 💧' },
    { sender: 'bot', text: '¿Quieres que excluya este peso de la tendencia DEMA para que no afecte tu análisis real?' },
    { sender: 'user', text: 'Sí, por favor' },
    { sender: 'bot', text: '✅ Listo. Peso excluido del cálculo.\n\nTu tendencia real se mantiene perfecta: **-0.4 kg por semana**. Vas excelente según tu objetivo. 📉' }
  ];

  const messagesEN = [
    { sender: 'user', text: 'Hey, why did I gain 800g if I only had popcorn yesterday? :(' },
    { sender: 'bot', text: "Don't worry! 😊 That variation is completely normal. Popcorn has high sodium content, which causes temporary water retention." },
    { sender: 'bot', text: "It's not real fat. Your body is retaining fluids to balance the sodium. This will disappear in 24-48 hours. 💧" },
    { sender: 'bot', text: 'Would you like me to exclude this weight from the DEMA trend so it doesn\'t affect your real analysis?' },
    { sender: 'user', text: 'Yes, please' },
    { sender: 'bot', text: '✅ Done. Weight excluded from calculation.\n\nYour real trend remains perfect: **-0.4 kg per week**. You\'re doing excellent according to your goal. 📉' }
  ];

  const messages = language === 'es' ? messagesES : messagesEN;

  useEffect(() => {
    // Reset when language changes
    setVisibleMessages([]);
    setCurrentMessageIndex(0);
    setIsTyping(false);
  }, [language]);

  useEffect(() => {
    if (currentMessageIndex >= messages.length) return;

    const message = messages[currentMessageIndex];
    const isBot = message.sender === 'bot';
    const delay = isBot ? 1200 : 600;

    const timer = setTimeout(() => {
      if (isBot) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, { ...message, id: currentMessageIndex }]);
          setCurrentMessageIndex(prev => prev + 1);
        }, 1000 + Math.random() * 500);
      } else {
        setVisibleMessages(prev => [...prev, { ...message, id: currentMessageIndex }]);
        setCurrentMessageIndex(prev => prev + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentMessageIndex, messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  // Restart animation
  const handleRestart = () => {
    setVisibleMessages([]);
    setCurrentMessageIndex(0);
    setIsTyping(false);
  };

  const formatMessage = (text) => {
    // Handle bold text with **
    return text.split('**').map((part, i) => 
      i % 2 === 1 ? <strong key={i} className="text-[#00D2FF]">{part}</strong> : part
    );
  };

  return (
    <section id="demo" className="relative py-24 lg:py-32 bg-black overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00D2FF]/5 rounded-full blur-[100px] pointer-events-none" />

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
            {t('calibot.title')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {t('calibot.subtitle')}
          </p>
        </motion.div>

        {/* Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-sm mx-auto"
        >
          <div className="relative">
            {/* Phone Frame */}
            <div className="relative bg-[#0A0A0A] rounded-[3rem] p-3 border border-white/10 shadow-[0_0_60px_rgba(0,210,255,0.15)]">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20" />
              
              {/* Screen */}
              <div className="bg-[#111111] rounded-[2.5rem] overflow-hidden">
                {/* WhatsApp Header */}
                <div className="bg-[#0B141A] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D2FF] to-[#00D2FF]/50 flex items-center justify-center">
                    <span className="font-bold text-black text-sm">CB</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">CaliBot</div>
                    <div className="text-[#00D2FF] text-xs">Online</div>
                  </div>
                  <div className="flex items-center gap-4 text-white/60">
                    <Video className="w-5 h-5" />
                    <Phone className="w-5 h-5" />
                    <MoreVertical className="w-5 h-5" />
                  </div>
                </div>

                {/* Chat Area */}
                <div
                  ref={containerRef}
                  className="h-[420px] overflow-y-auto p-4 space-y-3 bg-[#0B141A] scrollbar-hide"
                  data-testid="calibot-chat-area"
                >
                  <AnimatePresence>
                    {visibleMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                            msg.sender === 'user'
                              ? 'bg-[#005C4B] text-white rounded-br-none'
                              : 'bg-[#1F2C33] text-white rounded-bl-none border-l-2 border-[#00D2FF]'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-line">{formatMessage(msg.text)}</p>
                          <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] text-white/40">
                              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {msg.sender === 'user' && (
                              <CheckCheck className="w-4 h-4 text-[#00D2FF]" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-[#1F2C33] px-4 py-3 rounded-lg rounded-bl-none border-l-2 border-[#00D2FF]">
                          <div className="flex items-center gap-1">
                            <motion.div
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="w-2 h-2 bg-[#00D2FF] rounded-full"
                            />
                            <motion.div
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-[#00D2FF] rounded-full"
                            />
                            <motion.div
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-[#00D2FF] rounded-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="bg-[#0B141A] px-3 py-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#1F2C33] rounded-full px-4 py-2.5 text-white/40 text-sm">
                      {language === 'es' ? 'Escribe un mensaje...' : 'Type a message...'}
                    </div>
                    <button
                      onClick={handleRestart}
                      className="w-10 h-10 rounded-full bg-[#00D2FF] flex items-center justify-center hover:bg-[#33DBFF] transition-colors"
                      data-testid="calibot-restart-btn"
                    >
                      <Send className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-[#00D2FF]/10 rounded-[4rem] blur-2xl -z-10" />
          </div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {[
            language === 'es' ? 'WhatsApp Integration' : 'WhatsApp Integration',
            language === 'es' ? 'Respuestas Instantáneas' : 'Instant Responses',
            language === 'es' ? 'Análisis DEMA' : 'DEMA Analysis',
            language === 'es' ? 'Sin Alarmas Falsas' : 'No False Alarms'
          ].map((feature, i) => (
            <div
              key={i}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
              {feature}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CalibotDemo;
