"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "./button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./carousel";
import { cn } from "./utils";

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items: Gallery4Item[];
  className?: string;
}

const Gallery4 = ({
  title = "Case Studies",
  description = "Discover how leading companies and developers are leveraging modern web technologies to build exceptional digital experiences.",
  items = [],
  className,
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className={cn("py-24", className)}>
      <div className="container mx-auto px-6">
        <div className="mb-12 flex items-end justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="max-w-lg text-lg leading-relaxed opacity-60">{description}</p>
          </div>
          <div className="hidden shrink-0 gap-3 md:flex">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="rounded-full border border-current/20 opacity-40 hover:opacity-100 hover:border-current disabled:opacity-20 transition-all"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="rounded-full border border-current/20 opacity-40 hover:opacity-100 hover:border-current disabled:opacity-20 transition-all"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: "start",
            loop: true,
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 2xl:ml-[max(4rem,calc(50vw-700px))]">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[340px] pl-[20px] lg:max-w-[420px]"
              >
                <div className="group relative h-full min-h-[400px] overflow-hidden rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:border-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
                  
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-8 text-white">
                    <div className="mb-3 text-2xl font-bold leading-tight tracking-tight">
                      {item.title}
                    </div>
                    <div className="mb-6 text-sm text-white/70 line-clamp-3 leading-relaxed">
                      {item.description}
                    </div>
                    <div className="flex items-center text-xs font-bold uppercase tracking-widest text-[#6C5CE7]">
                      Saber más{" "}
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Mobile Pagination Dots */}
        <div className="mt-8 flex justify-center gap-2 md:hidden">
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all",
                currentSlide === index ? "w-6 bg-[#6C5CE7]" : "w-1.5 bg-gray-200"
              )}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Gallery4 };
