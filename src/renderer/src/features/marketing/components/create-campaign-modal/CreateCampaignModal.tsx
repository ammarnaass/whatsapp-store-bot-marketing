import React, { useState } from 'react';
import { X, Megaphone, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { CreateCampaignFormData, AudienceFilter } from '../../types/marketing.types';
import { DEFAULT_ANTI_BAN_SETTINGS, PRESET_CAMPAIGN_TEMPLATES } from '../../constants/marketing.constants';
import { StepContentEditor } from './StepContentEditor';
import { StepAudienceSelector } from './StepAudienceSelector';
import { StepAntiBanSettings } from './StepAntiBanSettings';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCampaignFormData) => Promise<{ success: boolean; count?: number; error?: string }>;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [template, setTemplate] = useState(PRESET_CAMPAIGN_TEMPLATES[0].text);
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>({ all: true });
  const [minDelay, setMinDelay] = useState(DEFAULT_ANTI_BAN_SETTINGS.minDelaySec);
  const [maxDelay, setMaxDelay] = useState(DEFAULT_ANTI_BAN_SETTINGS.maxDelaySec);
  const [dailyLimit, setDailyLimit] = useState(DEFAULT_ANTI_BAN_SETTINGS.dailyLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim() || !template.trim()) {
      alert('يرجى تحديد اسم الحملة ونص الرسالة');
      setStep(1);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await onSubmit({
        name: name.trim(),
        template: template.trim(),
        audience_filter: audienceFilter,
        min_delay_sec: minDelay,
        max_delay_sec: maxDelay,
        daily_limit: dailyLimit,
      });
      if (res.success) {
        onClose();
        setName('');
        setStep(1);
      } else {
        alert(res.error || 'فشل في إنشاء الحملة');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl w-full max-w-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        {/* الترويسة وخطوات الإعداد */}
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-[#1F293D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">إطلاق حملة تسويقية جديدة عبر واتساب</h3>
              <p className="text-[11px] text-slate-400">الخطوة {step} من 3: {step === 1 ? 'المحتوى والمعاينة' : step === 2 ? 'تحديد الجمهور' : 'حماية مكافحة الحظر'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* جسم الخطوة الحالية */}
        <div className="flex-1 overflow-y-auto py-2">
          {step === 1 && (
            <StepContentEditor
              name={name}
              onNameChange={setName}
              template={template}
              onTemplateChange={setTemplate}
            />
          )}
          {step === 2 && (
            <StepAudienceSelector
              filter={audienceFilter}
              onChange={setAudienceFilter}
            />
          )}
          {step === 3 && (
            <StepAntiBanSettings
              minDelay={minDelay}
              onMinDelayChange={setMinDelay}
              maxDelay={maxDelay}
              onMaxDelayChange={setMaxDelay}
              dailyLimit={dailyLimit}
              onDailyLimitChange={setDailyLimit}
            />
          )}
        </div>

        {/* أزرار التنقل والحفظ */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#1F293D] text-xs">
          <button
            type="button"
            onClick={step === 1 ? onClose : () => setStep((s) => (s - 1) as any)}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
          >
            {step === 1 ? 'إلغاء' : <><ArrowRight className="w-3.5 h-3.5" /> السابق</>}
          </button>

          <div className="flex items-center gap-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold flex items-center gap-1 shadow-md cursor-pointer"
              >
                التالي <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {isSubmitting ? 'جارٍ الإنشاء...' : 'تأكيد وإطلاق الحملة'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

