import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, TrendingUp, Bot, Trophy, LayoutDashboard, Bell, BarChart3, Scale } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useLanguage } from '../../contexts/LanguageContext';

const FeaturesSection = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('athletes');

  const athleteIcons = [BookOpen, TrendingUp, Bot, Trophy];
  const coachIcons = [LayoutDashboard, Bell, BarChart3, Scale];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="features" className="relative py-24 lg:py-32 bg-black overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,210,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,210,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />

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
            {t('features.title')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="athletes" className="w-full" onValueChange={setActiveTab}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <TabsList className="bg-white/5 border border-white/10 p-1.5 rounded-full">
              <TabsTrigger
                value="athletes"
                className="px-6 py-3 rounded-full text-sm font-semibold data-[state=active]:bg-[#00D2FF] data-[state=active]:text-black data-[state=inactive]:text-white/60 transition-all"
                data-testid="tab-athletes"
              >
                {t('features.tabAthletes')}
              </TabsTrigger>
              <TabsTrigger
                value="coaches"
                className="px-6 py-3 rounded-full text-sm font-semibold data-[state=active]:bg-[#00D2FF] data-[state=active]:text-black data-[state=inactive]:text-white/60 transition-all"
                data-testid="tab-coaches"
              >
                {t('features.tabCoaches')}
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Athletes Tab */}
          <TabsContent value="athletes">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {t('features.athletes').map((feature, i) => {
                const Icon = athleteIcons[i];
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="group relative p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#00D2FF]/40 transition-all overflow-hidden"
                    data-testid={`feature-athlete-${i}`}
                  >
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-[#00D2FF]/10 flex items-center justify-center mb-4 group-hover:bg-[#00D2FF]/20 transition-colors">
                      <Icon className="w-7 h-7 text-[#00D2FF]" />
                    </div>

                    {/* Content */}
                    <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00D2FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#00D2FF]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>

          {/* Coaches Tab */}
          <TabsContent value="coaches">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {t('features.coaches').map((feature, i) => {
                const Icon = coachIcons[i];
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="group relative p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#00D2FF]/40 transition-all overflow-hidden"
                    data-testid={`feature-coach-${i}`}
                  >
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-[#00D2FF]/10 flex items-center justify-center mb-4 group-hover:bg-[#00D2FF]/20 transition-colors">
                      <Icon className="w-7 h-7 text-[#00D2FF]" />
                    </div>

                    {/* Content */}
                    <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00D2FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#00D2FF]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturesSection;
