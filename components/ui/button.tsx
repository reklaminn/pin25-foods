import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-mealora-primary text-white hover:bg-mealora-primary/90 focus:ring-mealora-primary',
    secondary: 'bg-mealora-accent text-white hover:bg-mealora-accent/90 focus:ring-mealora-accent',
    ghost: 'bg-transparent text-mealora-primary hover:bg-mealora-cream focus:ring-mealora-primary',
    outline: 'bg-transparent border-2 border-mealora-primary text-mealora-primary hover:bg-mealora-primary hover:text-white focus:ring-mealora-primary'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
}
