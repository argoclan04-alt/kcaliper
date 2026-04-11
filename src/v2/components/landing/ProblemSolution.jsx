import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Ghost, Activity, Bell, Bot, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const ProblemSolution = () => {
  const { t } = useLanguage();

  const problemIcons = [AlertTriangle, TrendingDown, Ghost];
  const solutionIcons = [Activity, Bell, Bot];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-24 lg:py-32 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00D2FF]/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('problem.title')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {t('problem.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-stretch">
          {/* Problems Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 font-semibold uppercase tracking-wider text-sm">
                Sin Kcaliper
              </span>
            </div>

            {t('problem.problems').map((problem, i) => {
              const Icon = problemIcons[i];
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group relative p-6 rounded-2xl bg-[#0A0A0A] border border-red-500/20 hover:border-red-500/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                      <Icon className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">{problem.title}</h3>
                      <p className="text-white/50 leading-relaxed">{problem.desc}</p>
                    </div>
                  </div>
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Arrow in the middle (desktop) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center"
            >
              <ArrowRight className="w-6 h-6 text-[#00D2FF]" />
            </motion.div>
          </div>

          {/* Mobile Arrow */}
          <div className="flex lg:hidden justify-center">
            <motion.div
              initial={{ opacity: 0, rotate: 90 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5 text-[#00D2FF] rotate-90" />
            </motion.div>
          </div>

          {/* Solutions Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full bg-[#00D2FF] animate-pulse" />
              <span className="text-[#00D2FF] font-semibold uppercase tracking-wider text-sm">
                {t('problem.solutionTitle')}
              </span>
            </div>

            {t('problem.solutions').map((solution, i) => {
              const Icon = solutionIcons[i];
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group relative p-6 rounded-2xl bg-[#0A0A0A] border border-[#00D2FF]/20 hover:border-[#00D2FF]/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00D2FF]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00D2FF]/20 transition-colors">
                      <Icon className="w-6 h-6 text-[#00D2FF]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">{solution.title}</h3>
                      <p className="text-white/50 leading-relaxed">{solution.desc}</p>
                    </div>
                  </div>
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-[#00D2FF]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
