import React, { useState } from 'react';

interface AccordionItemData {
  id: number;
  title: string;
  imageUrl: string;
}

const AccordionItemCard = ({ item, isActive, onMouseEnter }: {
  item: AccordionItemData;
  isActive: boolean;
  onMouseEnter: () => void;
}) => {
  return (
    <div
      className={`
        relative h-[450px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out flex-shrink-0
        ${isActive ? 'w-[400px]' : 'w-[60px]'}
      `}
      onMouseEnter={onMouseEnter}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Caption */}
      <span
        className={`
          absolute text-white text-lg font-semibold whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0'
              : 'w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90'
          }
        `}
      >
        {item.title}
      </span>
    </div>
  );
};

interface HeroAccordionProps {
  items?: AccordionItemData[];
  defaultActiveIndex?: number;
}

export function HeroImageAccordion({ items, defaultActiveIndex = 4 }: HeroAccordionProps) {
  const defaultItems: AccordionItemData[] = items || [
    {
      id: 1,
      title: 'Coach IA',
      imageUrl: 'https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?q=80&w=1974&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Tendencia DEMA',
      imageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'CaliBot + IA',
      imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1974&auto=format&fit=crop',
    },
    {
      id: 4,
      title: 'Fotos Progreso',
      imageUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2090&auto=format&fit=crop',
    },
    {
      id: 5,
      title: 'Milestones',
      imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  return (
    <div className="flex flex-row items-center justify-center gap-3 overflow-x-auto p-2">
      {defaultItems.map((item, index) => (
        <AccordionItemCard
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}
