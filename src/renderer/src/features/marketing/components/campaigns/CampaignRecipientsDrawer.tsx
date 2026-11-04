import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../../../../api-bridge';
import { CampaignRecipient } from '../../types/marketing.types';

interface CampaignRecipientsDrawerProps {
  campaignId: string | null;
  onClose: () => void;
}

export const CampaignRecipientsDrawer: React.FC<CampaignRecipientsDrawerProps> = ({
  campaignId,
  onClose,
}) => {
  const [recipients, setRecipients] = useState<CampaignRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    let isMounted = true;
    const fetchRecipients = async () => {
      setIsLoading(true);
      try {
        const list = await api.campaigns.getRecipients(campaignId);
        if (isMounted) setRecipients(list);
      } catch (err) {
        console.error('Failed to get campaign recipients:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchRecipients();
    return () => {
      isMounted = false;
    };
  }, [campaignId]);

  if (!campaignId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] h-full shadow-2xl flex flex-col border-r border-slate-200 dark:border-[#1F293D] animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-200 dark:border-[#1F293D] flex items-center justify-between">
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white">سجل مستلمي الحملة</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">تفاصيل حالات الإرسال وتحديثات التسليم</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-pink-500" />
              <span className="text-xs">جارِ جلب المستلمين...</span>
            </div>
          ) : recipients.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">لا يوجد مستلمون مسجلون في هذه الحملة</div>
          ) : (
            recipients.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{rec.name || 'عميل'}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{rec.phone}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  {rec.status === 'SENT' || rec.status === 'DELIVERED' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> تم الإرسال
                    </span>
                  ) : rec.status === 'FAILED' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full" title={rec.error_message}>
                      <AlertCircle className="w-3 h-3" /> فشل
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" /> في الانتظار
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

