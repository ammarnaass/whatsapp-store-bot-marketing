import React from 'react';
import { Package, Globe } from 'lucide-react';

export type ShippingTab = 'shipments' | 'zones';

interface Props {
  activeTab: ShippingTab;
  onChangeTab: (tab: ShippingTab) => void;
  zonesCount: number;
  shipmentsCount: number;
}

export const ShippingNavTabs: React.FC<Props> = ({ activeTab, onChangeTab, zonesCount, shipmentsCount }) => {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
      <button
        onClick={() => onChangeTab('shipments')}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
          activeTab === 'shipments'
            ? 'bg-[#128C7E] text-white shadow-xs'
            : 'bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <Package className="w-4 h-4" />
        <span>الشحنات والبوالص اللوجستية</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
          activeTab === 'shipments' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
        }`}>
          {shipmentsCount}
        </span>
      </button>

      <button
        onClick={() => onChangeTab('zones')}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
          activeTab === 'zones'
            ? 'bg-[#128C7E] text-white shadow-xs'
            : 'bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <Globe className="w-4 h-4" />
        <span>مناطق ودول الشحن والشركات (WooCommerce)</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
          activeTab === 'zones' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
        }`}>
          {zonesCount}
        </span>
      </button>
    </div>
  );
};

