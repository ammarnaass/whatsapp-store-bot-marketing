import React from 'react';
import { Megaphone, Users } from 'lucide-react';
import { Campaign } from '../../../../shared/types';

interface CampaignListProps {
  campaigns: Campaign[];
}

export const CampaignList: React.FC<CampaignListProps> = ({ campaigns }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">سجل الحملات التسويقية</h3>

      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((camp) => (
          <div key={camp.id} className="wasell-card p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{camp.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E7F6F2] dark:bg-[#075E54]/30 text-[#075E54] dark:text-emerald-300">
                    {camp.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#128C7E]" /> {camp.recipients_count} مستلم مستهدف
                  </span>
                  <span>•</span>
                  <span>تأخير عشوائي: {camp.min_delay_sec}–{camp.max_delay_sec} ثانية</span>
                </div>
              </div>

              <div className="text-left font-mono text-xs">
                <span className="text-slate-400 block text-[11px]">معدل الوصول:</span>
                <span className="font-bold text-[#128C7E]">
                  {camp.recipients_count ? ((camp.sent_count / camp.recipients_count) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>

            {/* قالب الرسالة المستخدم */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-[#1F293D] text-xs text-slate-600 dark:text-slate-300">
              <span className="text-[11px] text-slate-400 block mb-1">قالب الرسالة:</span>
              <p className="line-clamp-2 leading-relaxed font-sans">{camp.template}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
