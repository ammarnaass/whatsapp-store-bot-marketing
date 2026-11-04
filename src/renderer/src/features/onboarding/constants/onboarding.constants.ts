import { WizardStepConfig, WizardStepId } from '../types/onboarding.types';

export const WIZARD_STEPS: WizardStepConfig[] = [
  { num: 1, title: 'الترحيب' },
  { num: 2, title: 'ربط واتساب' },
  { num: 3, title: 'إضافة منتجات' },
  { num: 4, title: 'وكيل AI' },
  { num: 5, title: 'الاختبار' }
];

export const TOTAL_STEPS = 5;

export const DEFAULT_INITIAL_STEP: WizardStepId = 2;
