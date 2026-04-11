import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "./utils";

// Define the props for the component
interface AnimatedFeatureCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The numerical index to display, e.g., "001" */
  index: string;
  /** The tag or category label */
  tag: string;
  /** The main title or description */
  title: React.ReactNode;
  /** The URL for the central image */
  imageSrc: string;
  /** The color variant which determines the gradient and tag color */
  color: "orange" | "purple" | "blue";
}

// Define HSL color values for each variant
const colorVariants = {
  orange: {
    '--feature-color': 'hsl(35, 91%, 55%)',
    '--feature-color-light': 'hsl(41, 100%, 85%)',
    '--feature-color-dark': 'hsl(24, 98%, 98%)',
  },
  purple: {
    '--feature-color': 'hsl(262, 85%, 60%)',
    '--feature-color-light': 'hsl(261, 100%, 87%)',
    '--feature-color-dark': 'hsl(264, 100%, 98%)',
  },
  blue: {
    '--feature-color': 'hsl(211, 100%, 60%)',
    '--feature-color-light': 'hsl(210, 100%, 83%)',
    '--feature-color-dark': 'hsl(216, 100%, 98%)',
  },
};

const AnimatedFeatureCard = React.forwardRef<
  HTMLDivElement,
  AnimatedFeatureCardProps
>(({ className, index, tag, title, imageSrc, color, ...props }, ref) => {
  const cardStyle = colorVariants[color] as React.CSSProperties;

  return (
    <motion.div
      ref={ref}
      style={cardStyle}
      className={cn(
        "relative flex h-[420px] w-full max-w-sm flex-col justify-end overflow-hidden rounded-2xl border bg-card p-6 shadow-sm",
        className
      )}
      whileHover="hover"
      initial="initial"
      variants={{
        initial: { y: 0 },
        hover: { y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      {...props}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 z-0 opacity-40 dark:opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 30%, var(--feature-color-light) 0%, transparent 70%)`
        }}
      />
      
      {/* Index Number */}
      <div className="absolute top-6 left-6 font-mono text-lg font-bold text-muted-foreground/40">
        {index}
      </div>

      {/* Main Image */}
      <motion.div 
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        variants={{
            initial: { scale: 0.8, y: -20 },
            hover: { scale: 1.1, y: -40 },
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <img
          src={imageSrc}
          alt={tag}
          className="w-48 h-48 object-contain drop-shadow-xl"
        />
      </motion.div>
      
      {/* Content */}
      <div className="relative z-20 rounded-xl border bg-background/90 p-5 backdrop-blur-md shadow-sm">
        <span
          className="mb-2 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{ 
            backgroundColor: 'var(--feature-color-dark)', 
            color: 'var(--feature-color)' 
          }}
        >
          {tag}
        </span>
        <div className="text-sm font-medium text-foreground leading-relaxed">
          {title}
        </div>
      </div>
    </motion.div>
  );
});
AnimatedFeatureCard.displayName = "AnimatedFeatureCard";

export { AnimatedFeatureCard };
