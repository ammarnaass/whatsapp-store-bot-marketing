import React, { useState } from 'react';
import { Megaphone, Search, Plus } from 'lucide-react';
import { Campaign } from '../../types/marketing.types';
import { CampaignCard } from '../campaigns/CampaignCard';

interface CampaignsTabProps {
  campaigns: Campaign[];
  isLoading: boolean;
  onControl: (id: string, action: 'START' | 'PAUSE' | 'CANCEL') => void;
  onDelete: (id: string) => void;
  onViewRecipients: (id: string) => void;
  onOpenCreate: () => void;
}

export const CampaignsTab: React.FC<CampaignsTabProps> = ({
  campaigns,
  isLoading,
  onControl,
  onDelete,
  onViewRecipients,
  onOpenCreate,
}) => {
  const [search, setSearch] = useState('');

  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.template.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="بحث في أسماء الحملات أو النصوص..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-3 py-1.5 rounded-xl text-xs bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400">جارِ تحميل الحملات التسويقية...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#111827] border border-dashed border-slate-200 dark:border-[#1F293D] rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">لا توجد حملات تسويقية حالياً</h4>
            <p className="text-xs text-slate-400 mt-1">ابدأ بإنشاء أول حملة واستهدف عملاء متجرك برسائل واتساب آمنة</p>
          </div>
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            إنشاء حملة تسويقية
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((camp) => (
            <CampaignCard
              key={camp.id}
              campaign={camp}
              onControl={onControl}
              onDelete={onDelete}
              onViewRecipients={onViewRecipients}
            />
          ))}
        </div>
      )}
    </div>
  );
};

