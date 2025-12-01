import React from 'react';

interface PillProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export default function Pill({ children, active = false, onClick }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-mealora-primary text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}
