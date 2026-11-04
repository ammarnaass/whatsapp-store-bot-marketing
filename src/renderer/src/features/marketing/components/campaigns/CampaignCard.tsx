import React from 'react';
import { Play, Pause, Trash2, Users, Clock, AlertCircle } from 'lucide-react';
import { Campaign } from '../../types/marketing.types';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { calculateDeliveryRate } from '../../utils/audience-calculator';

interface CampaignCardProps {
  campaign: Campaign;
  onControl: (id: string, action: 'START' | 'PAUSE' | 'CANCEL') => void;
  onDelete: (id: string) => void;
  onViewRecipients: (id: string) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onControl,
  onDelete,
  onViewRecipients,
}) => {
  const deliveryRate = calculateDeliveryRate(campaign.sent_count, campaign.recipients_count);
  const isRunning = campaign.status === 'RUNNING';

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] p-4 rounded-2xl elevation-1 space-y-3 transition-all hover:border-pink-300 dark:hover:border-pink-900/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="font-black text-sm text-slate-900 dark:text-white">{campaign.name}</h3>
          <CampaignStatusBadge status={campaign.status} />
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          {isRunning ? (
            <button
              onClick={() => onControl(campaign.id, 'PAUSE')}
              title="إيقاف مؤقت"
              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : campaign.status !== 'COMPLETED' ? (
            <button
              onClick={() => onControl(campaign.id, 'START')}
              title="بدء الحملة"
              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          ) : null}

          <button
            onClick={() => onViewRecipients(campaign.id)}
            title="سجل المستلمين"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(campaign.id)}
            title="حذف الحملة"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* شريط الإحصائيات ونسبة التقدم */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-pink-500" />
              {campaign.sent_count || 0} / {campaign.recipients_count || 0} مستلم
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {campaign.min_delay_sec}–{campaign.max_delay_sec} ثانية
            </span>
            {campaign.failed_count && campaign.failed_count > 0 ? (
              <span className="flex items-center gap-1 text-rose-500">
                <AlertCircle className="w-3 h-3" />
                {campaign.failed_count} فشل
              </span>
            ) : null}
          </div>
          <span className="text-pink-600 dark:text-pink-400 font-black">{deliveryRate}%</span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${deliveryRate}%` }}
          />
        </div>
      </div>

      {/* قالب الرسالة */}
      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-[#1F293D] text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
        <span className="font-bold text-slate-400 block mb-0.5">محتوى الرسالة:</span>
        {campaign.template}
      </div>
    </div>
  );
};

