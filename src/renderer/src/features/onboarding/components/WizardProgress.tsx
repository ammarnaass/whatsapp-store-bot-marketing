import React from 'react';
import { WizardStepId } from '../types/onboarding.types';
import { WIZARD_STEPS } from '../constants/onboarding.constants';

interface WizardProgressProps {
  currentStep: WizardStepId;
  onSelectStep: (step: WizardStepId) => void;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep, onSelectStep }) => {
  return (
    <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-bold select-none">
      {WIZARD_STEPS.map((step) => {
        const isActive = currentStep === step.num;
        const isCompleted = currentStep > step.num;

        return (
          <button
            key={step.num}
            type="button"
            onClick={() => onSelectStep(step.num)}
            className={`py-2 px-1 rounded-xl cursor-pointer border transition-all ${
              isActive
                ? 'bg-[#128C7E] text-white border-[#128C7E] shadow-sm'
                : isCompleted
                ? 'bg-emerald-50 dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-300'
                : 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1F293D] hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-mono">{step.num}</div>
            <div>{step.title}</div>
          </button>
        );
      })}
    </div>
  );
};
