import React from 'react';
import { Compass, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { SetupWizardModalProps } from '../types/onboarding.types';
import { useSetupWizard } from '../hooks/useSetupWizard';
import { WizardProgress } from './WizardProgress';
import { StepWelcome } from './StepWelcome';
import { StepConnectWhatsApp } from './StepConnectWhatsApp';
import { StepAddProducts } from './StepAddProducts';
import { StepSetupAgent } from './StepSetupAgent';
import { StepSandboxTest } from './StepSandboxTest';

export const SetupWizardModal: React.FC<SetupWizardModalProps> = ({
  isOpen,
  onClose,
  initialStep
}) => {
  const { currentStep, goToStep, nextStep, prevStep, isFirstStep, isLastStep } =
    useSetupWizard(initialStep);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border shadow-2xl p-6 space-y-6 bg-white dark:bg-[#0E1526] border-slate-200 dark:border-[#1E293B] transition-colors">
        {/* رأس المعالج */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-[#1F293D]">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#128C7E]" />
              <span>معالج الإعداد الأولي لتطبيق WaSell</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              خطوات سريعة لإطلاق متجرك ووكيل الذكاء الاصطناعي
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* شريط التقدم بين الخطوات الـ 5 */}
        <WizardProgress currentStep={currentStep} onSelectStep={goToStep} />

        {/* محتوى الخطوة النشطة */}
        <div className="min-h-[220px] flex flex-col justify-center">
          {currentStep === 1 && <StepWelcome />}
          {currentStep === 2 && <StepConnectWhatsApp />}
          {currentStep === 3 && <StepAddProducts />}
          {currentStep === 4 && <StepSetupAgent />}
          {currentStep === 5 && <StepSandboxTest />}
        </div>

        {/* أزرار التنقل السفلية */}
        <div className="flex items-center justify-between border-t pt-4 border-slate-100 dark:border-[#1F293D]">
          <button
            type="button"
            disabled={isFirstStep}
            onClick={prevStep}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>رجوع</span>
          </button>

          <div className="flex items-center gap-2">
            {isLastStep ? (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>إنهاء وبدء الاستخدام</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
