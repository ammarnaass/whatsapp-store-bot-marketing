import React from 'react';
import { AppWindow, Layers } from 'lucide-react';
import { SoftwareWithInventory } from '../types/software.types';
import { SoftwareCard } from './SoftwareCard';

interface Props {
  items: SoftwareWithInventory[];
  categoryFilter: string;
  onSelectCategory: (cat: string) => void;
  onOpenActivation: (item: SoftwareWithInventory) => void;
  onOpenKeys: (item: SoftwareWithInventory) => void;
  onEdit: (item: SoftwareWithInventory) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'كافة البرمجيات' },
  { id: 'نقاط بيع', label: '🛒 نقاط بيع ومحلات (POS)' },
  { id: 'روضات', label: '🎒 روضات ومدارس خاصة' },
  { id: 'مخازن', label: '📦 مستودعات ومخزون' },
  { id: 'محاسبة', label: '📊 محاسبة وفواتير' },
];

export const SoftwareGrid: React.FC<Props> = ({
  items, categoryFilter, onSelectCategory, onOpenActivation, onOpenKeys, onEdit, onDelete, onAddNew,
}) => {
  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pl-1 shrink-0">
          <Layers className="w-3.5 h-3.5" /> التصنيف:
        </span>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              categoryFilter === c.id
                ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid or Empty State */}
      {items.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <AppWindow className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">لا توجد برمجيات مسجلة في هذا التصنيف</h3>
          <p className="text-xs text-slate-400 max-w-sm">أضف أول برنامج (مثل برنامج نقاط بيع المحلات أو تسيير الروضات) وابدأ في بيع تراخيصه ومتابعة تفعيلاته تلقائياً.</p>
          <button onClick={onAddNew} className="h-9 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors">
            إضافة برنامج جديد الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <SoftwareCard
              key={item.id}
              item={item}
              onOpenActivation={onOpenActivation}
              onOpenKeys={onOpenKeys}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

