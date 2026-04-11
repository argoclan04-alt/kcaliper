"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Button } from "./button";
import { cn } from "./utils";

type FAQItem = {
  question: string;
  answer: string;
};

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  faqsLeft: FAQItem[];
  faqsRight: FAQItem[];
  className?: string;
}

export function FAQSection({
  title = "Preguntas Frecuentes",
  subtitle = "FAQ",
  description = "Todo lo que necesitas saber sobre CaliBot IA, métricas DEMA y cómo transformamos tu seguimiento físico.",
  buttonLabel = "Consultar soporte →",
  onButtonClick,
  faqsLeft,
  faqsRight,
  className,
}: FAQSectionProps) {
  return (
    <section className={cn("w-full max-w-6xl mx-auto py-24 px-6", className)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
        <div className="max-w-2xl">
          <p className="text-xs text-indigo-400 font-bold uppercase tracking-[0.2em] mb-4">
            {subtitle}
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            {title}
          </h2>
          <p className="text-white/40 text-lg leading-relaxed">
            {description}
          </p>
        </div>
        <div className="shrink-0 pb-2">
            <Button 
                className="rounded-full bg-white text-black hover:bg-white/90 font-bold px-6 py-2 shadow-lg border-0" 
                onClick={onButtonClick}
            >
                {buttonLabel}
            </Button>
        </div>
      </div>

      {/* FAQs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 px-4">
        {[faqsLeft, faqsRight].map((faqColumn, columnIndex) => (
          <Accordion
            key={columnIndex}
            type="single"
            collapsible
            className="w-full"
          >
            {faqColumn.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${columnIndex}-${i}`}
                className="border-white/[0.05] py-2"
              >
                <AccordionTrigger className="text-left font-bold text-white/80 hover:text-white hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/40 leading-relaxed pb-6 pr-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ))}
      </div>
    </section>
  );
}
