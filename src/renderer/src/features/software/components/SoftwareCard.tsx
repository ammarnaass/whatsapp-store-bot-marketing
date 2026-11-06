import React from 'react';
import { Download, ExternalLink, KeyRound, Eye, Edit3, Trash2, ShieldCheck, Laptop } from 'lucide-react';
import { SoftwareWithInventory } from '../types/software.types';
import { formatCurrency } from '@shared/currencies';

interface Props {
  item: SoftwareWithInventory;
  onOpenActivation: (item: SoftwareWithInventory) => void;
  onOpenKeys: (item: SoftwareWithInventory) => void;
  onEdit: (item: SoftwareWithInventory) => void;
  onDelete: (id: string) => void;
}

export const SoftwareCard: React.FC<Props> = ({
  item, onOpenActivation, onOpenKeys, onEdit, onDelete,
}) => {
  const isAvailable = (item.availableKeysCount || 0) > 0;
  const licenseTypeArabic = {
    lifetime: 'ترخيص دائم مدى الحياة',
    yearly: 'اشتراك سنوي',
    monthly: 'اشتراك شهري',
    trial: 'نسخة تجريبية',
  }[item.license_type] || item.license_type;

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 group">
      <div>
        <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 border border-slate-100 dark:border-slate-750">
          {item.cover_image ? (
            <img src={item.cover_image} alt={item.software_name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 text-blue-600">
              <Laptop className="w-12 h-12 stroke-[1.5]" />
            </div>
          )}
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[11px] font-mono font-bold text-white">
            {item.version || 'v1.0'}
          </span>
          <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {isAvailable ? `${item.availableKeysCount} مفتاح متاح` : 'نفد المخزون'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{item.category}</span>
          <span>•</span>
          <span className="text-slate-400">{licenseTypeArabic}</span>
        </div>

        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 leading-snug">
          {item.software_name}
        </h3>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base font-black text-slate-900 dark:text-white">{formatCurrency(item.price, item.currency)}</span>
          {item.compare_at_price && item.compare_at_price > item.price && (
            <span className="text-xs line-through text-slate-400">{formatCurrency(item.compare_at_price, item.currency)}</span>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenActivation(item)}
            className="flex-1 h-8 px-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> <span>شرح ومكان التفعيل</span>
          </button>
          <button
            onClick={() => onOpenKeys(item)}
            className="h-8 px-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            title="إدارة وشحن مفاتيح التراخيص"
          >
            <KeyRound className="w-3.5 h-3.5" /> <span>المفاتيح</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-2">
            {item.website_url && (
              <a href={item.website_url} target="_blank" rel="noreferrer" className="hover:text-blue-600 p-1 rounded-md" title="الموقع الرسمي للبرنامج">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {item.download_url && (
              <a href={item.download_url} target="_blank" rel="noreferrer" className="hover:text-emerald-600 p-1 rounded-md" title="رابط التحميل المباشر">
                <Download className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700" title="تعديل البرنامج">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600" title="حذف البرنامج">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
