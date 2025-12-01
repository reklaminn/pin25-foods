'use client';

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import ProgressBar from '@/components/wizard/progress-bar';
import WizardStep from '@/components/wizard/wizard-step';
import PackageRecommendations from '@/components/wizard/package-recommendations';
import Button from '@/components/ui/button';
import { wizardSteps, initialSelections, UserSelections } from '@/data/wizard-data';
import { useRouter } from 'next/navigation';

export default function PackageWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<UserSelections>(initialSelections);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const currentStepData = wizardSteps[currentStep];
  const isLastStep = currentStep === wizardSteps.length - 1;

  // Get current selections for this step
  const getCurrentSelections = (): string[] => {
    const stepId = currentStepData.id;
    if (stepId === 'goals') return selections.goals;
    if (stepId === 'diet-type') return selections.dietType ? [selections.dietType] : [];
    if (stepId === 'avoid-proteins') return selections.avoidProteins;
    if (stepId === 'avoid-ingredients') return selections.avoidIngredients;
    if (stepId === 'people-count') return selections.peopleCount ? [selections.peopleCount] : [];
    if (stepId === 'calories') return selections.calories ? [selections.calories] : [];
    if (stepId === 'meal-plan') return selections.mealPlan ? [selections.mealPlan] : [];
    return [];
  };

  // Handle option selection
  const handleSelect = (optionId: string) => {
    const stepId = currentStepData.id;
    
    setSelections(prev => {
      if (stepId === 'goals') {
        const newGoals = prev.goals.includes(optionId)
          ? prev.goals.filter(id => id !== optionId)
          : [...prev.goals, optionId];
        return { ...prev, goals: newGoals };
      }
      
      if (stepId === 'diet-type') {
        return { ...prev, dietType: optionId };
      }
      
      if (stepId === 'avoid-proteins') {
        const newAvoid = prev.avoidProteins.includes(optionId)
          ? prev.avoidProteins.filter(id => id !== optionId)
          : [...prev.avoidProteins, optionId];
        return { ...prev, avoidProteins: newAvoid };
      }
      
      if (stepId === 'avoid-ingredients') {
        const newAvoid = prev.avoidIngredients.includes(optionId)
          ? prev.avoidIngredients.filter(id => id !== optionId)
          : [...prev.avoidIngredients, optionId];
        return { ...prev, avoidIngredients: newAvoid };
      }
      
      if (stepId === 'people-count') {
        return { ...prev, peopleCount: optionId };
      }
      
      if (stepId === 'calories') {
        return { ...prev, calories: optionId };
      }
      
      if (stepId === 'meal-plan') {
        return { ...prev, mealPlan: optionId };
      }
      
      return prev;
    });
  };

  // Check if can continue
  const canContinue = () => {
    const currentSelections = getCurrentSelections();
    
    // For multi-select steps, at least one selection required
    if (currentStepData.type === 'multi') {
      return currentSelections.length > 0;
    }
    
    // For single-select steps, exactly one selection required
    if (currentStepData.type === 'single') {
      return currentSelections.length === 1;
    }
    
    return true;
  };

  // Handle continue
  const handleContinue = () => {
    if (isLastStep) {
      setShowRecommendations(true);
    } else {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle back
  const handleBack = () => {
    if (showRecommendations) {
      setShowRecommendations(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle package selection - Navigate to checkout
  const handlePackageSelect = (packageData: any) => {
    // Store package selection in sessionStorage
    sessionStorage.setItem('selectedPackage', JSON.stringify({
      ...packageData,
      selections: selections
    }));
    
    // Navigate to checkout
    router.push('/checkout');
  };

  if (showRecommendations) {
    return (
      <>
        <ProgressBar currentStep={wizardSteps.length} totalSteps={wizardSteps.length} />
        
        <div className="min-h-screen bg-white pt-24 pb-32">
          <PackageRecommendations 
            selections={selections}
            onPackageSelect={handlePackageSelect}
          />
        </div>

        {/* Back Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-6 z-[90]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleBack}
              icon={ChevronLeft}
              className="w-full"
            >
              Seçimleri Düzenle
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ProgressBar currentStep={currentStep} totalSteps={wizardSteps.length} />
      
      <div className="min-h-screen bg-white pt-24 pb-32">
        <WizardStep
          step={currentStepData}
          selections={getCurrentSelections()}
          onSelect={handleSelect}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-6 z-[90]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {currentStep > 0 && (
              <Button
                variant="ghost"
                size="lg"
                onClick={handleBack}
                icon={ChevronLeft}
                className="flex-shrink-0"
              >
                Geri
              </Button>
            )}
            
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              disabled={!canContinue()}
              className="flex-1"
            >
              {isLastStep ? 'Paketleri Gör' : 'Devam Et'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
