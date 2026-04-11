import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useLanguage } from '../../contexts/LanguageContext';

const FAQSection = () => {
  const { t } = useLanguage();

  const faqs = t('faq.items');

  return (
    <section id="faq" className="relative py-24 lg:py-32 bg-black overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('faq.title')}
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-white/10 rounded-xl px-6 bg-[#0A0A0A] data-[state=open]:border-[#00D2FF]/30 transition-colors"
                data-testid={`faq-item-${i}`}
              >
                <AccordionTrigger className="text-white font-semibold text-left py-5 hover:text-[#00D2FF] transition-colors [&[data-state=open]]:text-[#00D2FF]">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
