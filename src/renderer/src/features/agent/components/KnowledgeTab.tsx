import React from 'react';
import { Zap, CheckCircle, Upload, FileText, HelpCircle } from 'lucide-react';

interface KnowledgeTabProps {
  suggestAlternatives: boolean;
  onToggleSuggestAlternatives: (val: boolean) => void;
  autoDiscountOnHesitation: boolean;
  onToggleAutoDiscount: (val: boolean) => void;
}

export const KnowledgeTab: React.FC<KnowledgeTabProps> = ({
  suggestAlternatives,
  onToggleSuggestAlternatives,
  autoDiscountOnHesitation,
  onToggleAutoDiscount
}) => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Store Sync Live Card */}
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm flex flex-col space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                مزامنة منصة التجارة الإلكترونية
              </h3>
              <p className="text-xs text-slate-400">
                ربط تلقائي بالكتالوج، المخزون، وسلات المتروكات
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-200/50">
            <CheckCircle className="w-3.5 h-3.5 text-[#128C7E]" />
            مزامنة نشطة
          </span>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">المنتجات المتزامنة</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">1,420 منتج</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">آخر تحديث للمخزون</span>
            <span className="text-sm font-extrabold text-[#128C7E]">قبل 12 دقيقة</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">المنصة المرتبطة</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              سلة (Salla Cloud)
            </span>
          </div>
        </div>

        {/* Document Upload & Policies */}
        <div className="flex flex-col space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              مستندات التدريب والسياسات الملحقة (PDF / Docs)
            </span>
            <button
              onClick={() => alert('إضافة مستند جديد')}
              type="button"
              className="text-xs text-[#128C7E] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              إضافة ملف جديد
            </button>
          </div>

          {/* File Item 1 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] hover:bg-slate-100/60 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  سياسة_الاستبدال_والاسترجاع_الرسمية_2025.pdf
                </span>
                <span className="text-[10px] text-slate-400">
                  42 صفحة • تم التحليل والفهرسة بنجاح
                </span>
              </div>
            </div>
            <CheckCircle className="w-4 h-4 text-[#128C7E]" />
          </div>

          {/* File Item 2 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] hover:bg-slate-100/60 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  الأسئلة_الشائعة_وحسابات_الشحن_المحلي.pdf
                </span>
                <span className="text-[10px] text-slate-400">
                  18 صفحة • 140 إجابة مباشرة محددة
                </span>
              </div>
            </div>
            <CheckCircle className="w-4 h-4 text-[#128C7E]" />
          </div>
        </div>

        {/* Sales Behavior Toggles */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] cursor-pointer">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                اقتراح بدائل ذكية عند نفاد المخزون
              </span>
              <span className="text-[11px] text-slate-400">
                يوصي الوكيل بمنتج بديل مقارب بالسعر والخصائص إذا كان المنتج المطلوب غير متاح
              </span>
            </div>
            <input
              type="checkbox"
              checked={suggestAlternatives}
              onChange={(e) => onToggleSuggestAlternatives(e.target.checked)}
              className="w-5 h-5 rounded text-[#128C7E] focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] cursor-pointer">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                منح كوبونات تحفيزية ذاتية لإغلاق الصفقات (Up to 15%)
              </span>
              <span className="text-[11px] text-slate-400">
                السماح للوكيل بإنشاء كود خصم فوري مخصص عندما يتردد العميل قبل الدفع
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoDiscountOnHesitation}
              onChange={(e) => onToggleAutoDiscount(e.target.checked)}
              className="w-5 h-5 rounded text-[#128C7E] focus:ring-0 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
