import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, X } from 'lucide-react';

const FomoBanner = ({ type = 'athlete' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, mins: 32, secs: 45 });
  const [spotsLeft, setSpotsLeft] = useState(type === 'athlete' ? 127 : 88);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        secs--;
        if (secs < 0) { secs = 59; mins--; }
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) return prev;
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate spots decreasing
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85 && spotsLeft > 20) {
        setSpotsLeft(prev => prev - 1);
      }
    }, 12000);
    return () => clearInterval(interval);
  }, [spotsLeft]);

  if (!isVisible) return null;

  const isCoach = type === 'coach';
  const gradientClass = isCoach 
    ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500'
    : 'bg-gradient-to-r from-[#00D2FF] via-cyan-500 to-blue-500';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className={`${gradientClass} py-2 px-4 relative z-[60]`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm flex-wrap">
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="text-black font-bold hidden sm:inline">PRE-LANZAMIENTO</span>
            <span className="text-black font-bold sm:hidden">PRE-LAUNCH</span>
          </div>

          {/* Spots left */}
          <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full">
            <Zap className="w-3 h-3 text-black" />
            <span className="text-black font-bold">{spotsLeft}</span>
            <span className="text-black/80 hidden sm:inline">plazas fundador</span>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-1.5 text-black">
            <Clock className="w-3 h-3" />
            <span className="font-mono font-bold">
              {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.mins).padStart(2, '0')}m {String(timeLeft.secs).padStart(2, '0')}s
            </span>
          </div>

          {/* CTA */}
          <a
            href={isCoach ? "#coach-waitlist" : "#waitlist"}
            className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-900 transition-colors hidden sm:inline-block"
          >
            {isCoach ? 'Acceso Coach →' : 'Reservar plaza →'}
          </a>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
            aria-label="Cerrar banner"
          >
            <X className="w-4 h-4 text-black/60" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FomoBanner;
