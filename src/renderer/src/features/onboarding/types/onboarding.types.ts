export type WizardStepId = 1 | 2 | 3 | 4 | 5;

export interface WizardStepConfig {
  num: WizardStepId;
  title: string;
}

export interface SetupWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: WizardStepId;
}
