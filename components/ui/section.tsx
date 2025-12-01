import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'cream' | 'beige';
}

export default function Section({ children, className = '', background = 'white' }: SectionProps) {
  const backgrounds = {
    white: 'bg-white dark:bg-dark-bg',
    cream: 'bg-mealora-cream dark:bg-[#1a1a1a]', // Cream yerine koyu gri
    beige: 'bg-mealora-yellow/10 dark:bg-[#222222]' // Beige yerine biraz daha açık gri
  };
  
  return (
    <section className={`py-16 md:py-24 transition-colors duration-300 ${backgrounds[background]} ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {children}
      </div>
    </section>
  );
}
