import React from 'react';
import { Megaphone, Plus, Tag, ShieldAlert } from 'lucide-react';
import { MarketingTab } from '../types/marketing.types';

interface MarketingHeaderProps {
  currentTab: MarketingTab;
  onTabChange: (tab: MarketingTab) => void;
  onOpenCreateCampaign: () => void;
  onOpenCreateCoupon: () => void;
  campaignsCount: number;
  couponsCount: number;
  blocklistCount: number;
}

export const MarketingHeader: React.FC<MarketingHeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenCreateCampaign,
  onOpenCreateCoupon,
  campaignsCount,
  couponsCount,
  blocklistCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1F293D] pb-4">
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <Megaphone className="w-4 h-4" />
          </div>
          التسويق الذكي والحملات عبر واتساب
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          بث الرسائل الترويجية المجدولة، محاكاة التأخير البشري لمكافحة الحظر، وإدارة قسائم الخصم
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
        {/* أزرار التبويبات الثلاثة */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
          <button
            onClick={() => onTabChange('campaigns')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              currentTab === 'campaigns'
                ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>الحملات</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {campaignsCount}
            </span>
          </button>

          <button
            onClick={() => onTabChange('coupons')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              currentTab === 'coupons'
                ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>الكوبونات</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {couponsCount}
            </span>
          </button>

          <button
            onClick={() => onTabChange('blocklist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              currentTab === 'blocklist'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>قائمة الحظر</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {blocklistCount}
            </span>
          </button>
        </div>

        {/* زر الإجراء الأساسي المعتمد على التبويب */}
        {currentTab === 'campaigns' ? (
          <button
            onClick={onOpenCreateCampaign}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            حملة جديدة
          </button>
        ) : currentTab === 'coupons' ? (
          <button
            onClick={onOpenCreateCoupon}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            كوبون جديد
          </button>
        ) : null}
      </div>
    </div>
  );
};

