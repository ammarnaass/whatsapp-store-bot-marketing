import React, { useState, useEffect } from 'react';
import { Store, CheckCircle2, ChevronDown } from 'lucide-react';
import { api } from '../../../api-bridge';

interface AppHeaderStoreProfileProps {
  sessionStatus: string;
}

export const AppHeaderStoreProfile: React.FC<AppHeaderStoreProfileProps> = ({
  sessionStatus,
}) => {
  const [storeName, setStoreName] = useState('متجر وصّل التجاري الذكي');

  useEffect(() => {
    api.settings
      .getStoreSettings()
      .then((settings) => {
        if (settings?.identity?.storeNameAr) {
          setStoreName(settings.identity.storeNameAr);
        }
      })
      .catch(() => {});
  }, []);

  const isConnected = sessionStatus === 'CONNECTED';

  return (
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      {/* Store Identity Badge */}
      <div className="h-[38px] flex items-center gap-2 px-2.5 sm:px-3 rounded-xl border border-slate-200 dark:border-[#1F293D] bg-slate-50/80 dark:bg-slate-800/60 transition-colors shrink-0">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center font-bold shrink-0"
          style={{
            backgroundColor: 'var(--color-brand-light-bg)',
            color: 'var(--color-brand-primary)',
          }}
        >
          <Store className="w-3.5 h-3.5" />
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="truncate max-w-[130px] lg:max-w-[180px]">{storeName}</span>
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-brand-primary)' }} />
        </div>
      </div>

      {/* WhatsApp Live Status Pill */}
      <div
        className="h-[34px] flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 rounded-full border shrink-0"
        style={{
          backgroundColor: 'var(--color-brand-light-bg)',
          borderColor: 'color-mix(in srgb, var(--color-brand-primary) 30%, transparent)',
          color: 'var(--color-primary-dark)',
        }}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`} />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? '' : 'bg-amber-500'}`}
            style={isConnected ? { backgroundColor: 'var(--color-brand-accent)' } : undefined}
          />
        </span>
        <span className="text-xs font-bold tabular-nums whitespace-nowrap">
          <span className="hidden sm:inline">واتساب </span>
          <span>{isConnected ? 'متصل (100%)' : 'متصل (100%)'}</span>
        </span>
      </div>
    </div>
  );
};

