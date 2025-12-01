'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { WizardStep as WizardStepType, WizardOption } from '@/data/wizard-data';

interface WizardStepProps {
  step: WizardStepType;
  selections: string[];
  onSelect: (optionId: string) => void;
}

export default function WizardStep({ step, selections, onSelect }: WizardStepProps) {
  const isSelected = (optionId: string) => selections.includes(optionId);
  
  const canSelect = (optionId: string) => {
    if (step.type === 'single') return true;
    if (step.type === 'multi') {
      if (isSelected(optionId)) return true;
      return !step.maxSelections || selections.length < step.maxSelections;
    }
    return true;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {step.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          {step.subtitle}
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {step.options.map((option) => {
          const selected = isSelected(option.id);
          const disabled = !canSelect(option.id);
          
          return (
            <button
              key={option.id}
              onClick={() => !disabled && onSelect(option.id)}
              disabled={disabled}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-200
                text-left flex items-center gap-4
                ${selected 
                  ? 'border-mealora-primary bg-green-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Icon */}
              <div className={`
                text-4xl flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center
                ${selected ? 'bg-white' : 'bg-gray-100'}
              `}>
                {option.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-900">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </div>
                )}
              </div>
              
              {/* Checkmark */}
              {selected && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-mealora-primary rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Motivation Card */}
      <div className="bg-gray-100 rounded-2xl p-6 flex items-center gap-6">
        <img 
          src={step.motivationImage} 
          alt="Motivation"
          className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
        />
        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
          {step.motivationText}
        </p>
      </div>
    </div>
  );
}
