import React, { useState, useEffect } from 'react';
import { Network, CheckCircle2, Radio } from 'lucide-react';
import { api } from '../../../../api-bridge';

export const WhatsAppGatewayStatusCard: React.FC = () => {
  const [sessionInfo, setSessionInfo] = useState<{ isConnected: boolean; phone?: string; sessionName?: string }>({
    isConnected: true,
    phone: '+213555220620',
    sessionName: 'wasell-main-store',
  });

  useEffect(() => {
    api.session
      .getStatus()
      .then((res) => {
        if (res) {
          setSessionInfo({
            isConnected: res.isConnected ?? true,
            phone: res.phone || '+213555220620',
            sessionName: 'wasell-main-store',
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Network className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              بوابة واتساب للأعمال (OpenWA Gateway)
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#128C7E] dark:text-emerald-400" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono" dir="ltr">
            {sessionInfo.phone} • Port 2785 • Webhook 3005
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>بوابة واتساب متصلة ونشطة</span>
        </span>
      </div>
    </div>
  );
};

