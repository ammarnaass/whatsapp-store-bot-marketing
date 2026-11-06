import React from 'react';
import { X, ExternalLink, Download, KeyRound, Monitor, CheckCircle, Info } from 'lucide-react';
import { SoftwareWithInventory } from '../types/software.types';

interface Props {
  item: SoftwareWithInventory | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SoftwareActivationModal: React.FC<Props> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{item.software_name}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">{item.version}</span>
              </h2>
              <p className="text-xs text-slate-500">معاينة واجهات البرنامج وشرح مكان إدخال كود التفعيل الرقمي</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-2">
            {item.download_url && (
              <a href={item.download_url} target="_blank" rel="noreferrer" className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors">
                <Download className="w-4 h-4" /> <span>تحميل ملف التثبيت المباشر</span>
              </a>
            )}
            {item.website_url && (
              <a href={item.website_url} target="_blank" rel="noreferrer" className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> <span>زيارة الموقع التعريفي</span>
              </a>
            )}
          </div>

          {/* Activation Guide Section */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-sm text-blue-900 dark:text-blue-300">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>خطوات ومكان إدخال كود التفعيل للعميل:</span>
            </div>
            <p className="text-xs leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300 font-medium">
              {item.activation_instructions || 'لا توجد تعليمات تفعيل مسجلة حالياً.'}
            </p>
          </div>

          {/* Screenshots of Activation Window */}
          {item.activation_guide_images?.length > 0 && (
            <div className="space-y-2">
              <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-purple-600" />
                <span>صور شاشة نافذة التفعيل وطريقة إدخال السيريال:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.activation_guide_images.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <img src={img} alt={`دليل تفعيل ${i + 1}`} className="w-full h-44 object-cover hover:scale-103 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Software UI Screenshots */}
          {item.screenshots?.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200">معرض صور واجهات البرنامج والشاشات:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {item.screenshots.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <img src={img} alt={`لقطة واجهة ${i + 1}`} className="w-full h-28 object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Requirements */}
          {item.system_requirements && (
            <div className="pt-2 text-slate-500 text-[11px] flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>متطلبات التشغيل: {item.system_requirements}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

