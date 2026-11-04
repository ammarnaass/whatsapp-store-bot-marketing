import React from 'react';
import { Store, CheckCircle2, RefreshCw } from 'lucide-react';
import { StoreIdentity } from '../../types/settings.types';

interface IdentityHeaderProps {
  identity: StoreIdentity;
  onTestSync: () => void;
  isTestingSync: boolean;
}

export const IdentityHeader: React.FC<IdentityHeaderProps> = ({
  identity,
  onTestSync,
  isTestingSync,
}) => {
  const isComplete = Boolean(
    identity.storeNameAr &&
    identity.storeNameEn &&
    identity.commercialRegistration &&
    identity.taxNumber &&
    identity.supportPhone
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-[#1F293D]">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
          style={{ backgroundColor: 'var(--color-brand-primary)' }}
        >
          <Store className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900 dark:text-white">هوية المتجر والبيانات الأساسية</h2>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#075E54] dark:text-emerald-300 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>{isComplete ? 'بروفايل تجاري مكتمل 100%' : 'WABA موثق'}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            البيانات الرسمية المرتبطة بواجهة الواتساب، الفواتير الضريبية، وحسابات التواصل
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onTestSync}
          disabled={isTestingSync}
          className="h-9 px-4 rounded-xl text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-brand-primary)' }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isTestingSync ? 'animate-spin' : ''}`} />
          <span>{isTestingSync ? 'جارٍ فحص المزامنة...' : 'اختبار مزامنة المنصة'}</span>
        </button>
      </div>
    </div>
  );
};

