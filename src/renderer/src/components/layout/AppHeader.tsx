import React from 'react';
import {
  Store,
  CheckCircle2,
  ChevronDown,
  Search,
  PauseCircle,
  Bell
} from 'lucide-react';
import { ThemeToggle } from '../../features/theme';
import { DataControlBadge } from '../../features/data-management';

interface AppHeaderProps {
  sessionStatus: string;
  globalSearch: string;
  onGlobalSearchChange: (val: string) => void;
  onEmergencyStop: () => void;
  onOpenDataManager: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  sessionStatus,
  globalSearch,
  onGlobalSearchChange,
  onEmergencyStop,
  onOpenDataManager
}) => {
  return (
    <header className="h-16 border-b px-6 flex items-center justify-between shrink-0 transition-colors z-30 bg-white dark:bg-[#0E1526]/90 border-slate-200 dark:border-[#1F293D] elevation-1 app-drag-region select-none">
      {/* Right side: Store Switcher & Live WhatsApp Pill & Search */}
      <div className="flex items-center gap-4 app-no-drag">
        {/* Store Switcher Dropdown Button */}
        <button
          type="button"
          className="h-[38px] flex items-center gap-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-[#1F293D] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer elevation-1"
        >
          <div className="w-6 h-6 rounded-lg bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center font-bold">
            <Store className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>متجر الرياض الرئيسي</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#128C7E]" />
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* WhatsApp Live Status Pill */}
        <div className="h-[34px] flex items-center gap-2 px-3 rounded-full bg-[#E7F6F2] dark:bg-[#128C7E]/20 border border-[#128C7E]/20 text-[#075E54] dark:text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
          </span>
          <span className="text-xs font-bold tabular-nums">
            متصل بالواتساب ({sessionStatus === 'CONNECTED' ? '99.8%' : 'جارٍ الربط'})
          </span>
        </div>

        {/* Quick Search Bar */}
        <div className="relative w-64 md:w-72 hidden md:block">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            placeholder="ابحث عن طلب، عميل، أو محادثة..."
            className="w-full h-[38px] pr-9 pl-3 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:outline-none focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/15 transition-all text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Left side: Emergency Killswitch, Language, Dark Mode, Notifications, Profile */}
      <div className="flex items-center gap-3 app-no-drag">
        {/* Prominent Emergency AI Button */}
        <button
          onClick={onEmergencyStop}
          type="button"
          className="h-[38px] flex items-center gap-2 px-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-600 hover:text-white transition-all active:scale-95 text-xs font-bold shadow-xs cursor-pointer"
          title="إيقاف استجابات الذكاء الاصطناعي فوراً في حالات الطوارئ"
        >
          <PauseCircle className="w-4 h-4" />
          <span>إيقاف مؤقت للذكاء الاصطناعي</span>
        </button>

        {/* Data Management Badge (Mock / Clean Data) */}
        <DataControlBadge onOpenManager={onOpenDataManager} />

        {/* Dark Mode Modular Toggle Button */}
        <ThemeToggle />

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => alert('التنبيهات: 3 رسائل جديدة بحاجة لتدخل بشري')}
            type="button"
            className="w-[38px] h-[38px] rounded-xl border border-slate-200 dark:border-[#1F293D] bg-white dark:bg-[#111827] elevation-1 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="التنبيهات"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
            3
          </span>
        </div>

        {/* User / Store Profile Avatar */}
        <div className="flex items-center gap-2.5 pr-2 mr-1 border-r border-slate-200 dark:border-[#1F293D]">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#128C7E]/30"
          />
          <div className="flex flex-col text-right leading-tight hidden sm:flex">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">عبدالعزيز التميمي</span>
            <span className="text-[11px] text-slate-400">مدير العمليات</span>
          </div>
        </div>
      </div>
    </header>
  );
};

