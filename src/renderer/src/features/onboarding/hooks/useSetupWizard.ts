import { useState } from 'react';
import { WizardStepId } from '../types/onboarding.types';
import { DEFAULT_INITIAL_STEP, TOTAL_STEPS } from '../constants/onboarding.constants';

export const useSetupWizard = (initialStep: WizardStepId = DEFAULT_INITIAL_STEP) => {
  const [currentStep, setCurrentStep] = useState<WizardStepId>(initialStep);

  const goToStep = (step: WizardStepId) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1) as WizardStepId);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as WizardStepId);
  };

  return {
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === TOTAL_STEPS
  };
};
