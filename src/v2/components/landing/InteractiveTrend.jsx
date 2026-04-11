import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';

const InteractiveTrend = () => {
  const { t } = useLanguage();
  const [showTrend, setShowTrend] = useState(true);
  const [animatedData, setAnimatedData] = useState([]);

  // Generate realistic weight data with fluctuations
  const generateData = () => {
    const data = [];
    let dailyWeight = 82;
    let demaWeight = 82;
    
    for (let i = 0; i < 30; i++) {
      // Daily fluctuations
      const fluctuation = (Math.random() - 0.4) * 1.5;
      dailyWeight = Math.max(75, Math.min(85, dailyWeight + fluctuation - 0.15));
      
      // DEMA smoothing (simulated)
      demaWeight = demaWeight * 0.9 + dailyWeight * 0.1 - 0.08;
      
      data.push({
        day: i + 1,
        daily: parseFloat(dailyWeight.toFixed(1)),
        dema: parseFloat(demaWeight.toFixed(1)),
      });
    }
    return data;
  };

  const fullData = generateData();

  // Animate data appearing
  useEffect(() => {
    let timeout;
    const animateData = (index) => {
      if (index <= fullData.length) {
        setAnimatedData(fullData.slice(0, index));
        timeout = setTimeout(() => animateData(index + 1), 80);
      }
    };
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateData(1);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('trend-chart');
    if (element) observer.observe(element);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A0A0A] border border-[#00D2FF]/30 rounded-lg p-3 shadow-xl">
          <p className="text-white/60 text-xs mb-2">Día {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'daily' ? t('trend.daily') : t('trend.trend')}: <span className="font-bold">{entry.value} kg</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="relative py-24 lg:py-32 bg-black overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#00D2FF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('trend.title')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {t('trend.subtitle')}
          </p>
        </motion.div>

        {/* Chart Container */}
        <motion.div
          id="trend-chart"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative p-6 rounded-2xl bg-[#0A0A0A] border border-white/10"
        >
          {/* Toggle */}
          <div className="flex items-center justify-end gap-4 mb-6">
            <button
              onClick={() => setShowTrend(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !showTrend 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/50 hover:text-white'
              }`}
              data-testid="toggle-daily"
            >
              <span className="w-3 h-3 rounded-full bg-white/40" />
              {t('trend.daily')}
            </button>
            <button
              onClick={() => setShowTrend(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                showTrend 
                  ? 'bg-[#00D2FF]/20 text-[#00D2FF]' 
                  : 'text-white/50 hover:text-white'
              }`}
              data-testid="toggle-dema"
            >
              <span className="w-3 h-3 rounded-full bg-[#00D2FF]" />
              {t('trend.trend')}
            </button>
          </div>

          {/* Chart */}
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={animatedData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDema" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D2FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="#ffffff20"
                  tick={{ fill: '#ffffff50', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={[75, 85]}
                  stroke="#ffffff20"
                  tick={{ fill: '#ffffff50', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Daily Weight Line */}
                <Area
                  type="monotone"
                  dataKey="daily"
                  stroke="#ffffff40"
                  strokeWidth={2}
                  fill="url(#colorDaily)"
                  dot={false}
                  name="daily"
                />
                
                {/* DEMA Trend Line */}
                {showTrend && (
                  <Area
                    type="monotone"
                    dataKey="dema"
                    stroke="#00D2FF"
                    strokeWidth={3}
                    fill="url(#colorDema)"
                    dot={false}
                    name="dema"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(0, 210, 255, 0.5))'
                    }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">-4.2 kg</div>
              <div className="text-white/50 text-sm">Pérdida total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00D2FF]">-0.5 kg</div>
              <div className="text-white/50 text-sm">Por semana</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">En objetivo</div>
              <div className="text-white/50 text-sm">Estado actual</div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#00D2FF]/20 via-transparent to-[#00D2FF]/20 opacity-50 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveTrend;
