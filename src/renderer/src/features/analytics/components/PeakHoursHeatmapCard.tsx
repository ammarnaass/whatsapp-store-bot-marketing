import React from 'react';
import { Flame, Clock, TrendingUp } from 'lucide-react';
import { PeakHoursData } from '../types/analytics.types';

interface PeakHoursHeatmapCardProps {
  peakHours: PeakHoursData;
}

export const PeakHoursHeatmapCard: React.FC<PeakHoursHeatmapCardProps> = ({ peakHours }) => {
  const { peakWindow, peakConversionBoost, hourlyData } = peakHours;
  const maxChats = Math.max(...hourlyData.map((d) => d.chats), 100);

  return (
    <div className="lg:col-span-6 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>ساعات الذروة ونشاط المبيعات اليومية</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">توزيع حجم المحادثات ومعدل الشراء على مدار اليوم</p>
        </div>
        <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full font-mono">
          {peakConversionBoost} تحويل
        </span>
      </div>

      {/* Peak Window Highlight */}
      <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="font-bold text-slate-900 dark:text-white">فترة الذروة الذهبية:</span>
        </div>
        <span className="font-black text-amber-700 dark:text-amber-300 font-mono">{peakWindow}</span>
      </div>

      {/* Hourly activity bars */}
      <div className="grid grid-cols-7 gap-2 pt-2 items-end h-28">
        {hourlyData.map((h, idx) => {
          const heightPercent = Math.max(15, Math.round((h.chats / maxChats) * 100));
          const isPeak = heightPercent > 70;
          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                {h.orders} طلب
              </span>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-20 flex items-end p-1">
                <div
                  className={`w-full rounded-t-md transition-all duration-700 ${
                    isPeak ? 'bg-amber-500 glow-whatsapp' : 'bg-[#128C7E]/70'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{h.hour}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

