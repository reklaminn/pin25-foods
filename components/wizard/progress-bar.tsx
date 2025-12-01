'use client';

import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="fixed top-20 left-0 right-0 bg-white border-b border-gray-200 z-[90]">
      <div className="container mx-auto px-4 max-w-4xl py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Adım {currentStep + 1} / {totalSteps}
          </span>
          <span className="text-sm font-medium text-mealora-primary">
            %{Math.round(progress)} tamamlandı
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-mealora-primary to-green-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
