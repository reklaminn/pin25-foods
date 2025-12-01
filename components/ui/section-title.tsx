import React from 'react';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionTitle({ eyebrow, title, subtitle, align = 'center' }: SectionTitleProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  
  return (
    <div className={`mb-12 ${alignClass}`}>
      {eyebrow && (
        <p className="text-mealora-primary dark:text-mealora-primary font-semibold text-sm uppercase tracking-wider mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
