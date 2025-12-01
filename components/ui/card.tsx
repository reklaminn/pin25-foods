import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const hoverClass = hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : '';
  
  return (
    <div className={`bg-white dark:bg-dark-surface rounded-2xl shadow-lg dark:shadow-none border border-transparent dark:border-dark-border p-6 ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
