import React, { useState } from 'react';
import {
  X,
  Trash2,
  Sparkles,
  Database,
  CheckCircle2,
  AlertTriangle,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Network,
  BarChart2
} from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { DataSection } from '../types/data-management.types';

interface DataManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataManagerModal: React.FC<DataManagerModalProps> = ({ isOpen, onClose }) => {
  const {
    isMockDataActive,
    products,
    orders,
    customers,
    chats,
    webhookLogs,
    clearAllMockData,
    seedAllMockData,
    clearSection,
    seedSection
  } = useDataStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearAll = async () => {
    if (confirm('هل أنت متأكد من رغبتك في تفريغ وحذف كافة البيانات الوهمية من جميع الصفحات والتحول للبيانات الحقيقية؟')) {
      await clearAllMockData();
      showToast('تم التحول للبيانات الحقيقية بنجاح ومزامنة قاعدة البيانات.');
    }
  };

  const handleSeedAll = async () => {
    await seedAllMockData();
    showToast('تمت إعادة توليد وتعبئة كافة البيانات التجريبية بنجاح.');
  };

  const sections: Array<{
    key: DataSection;
    label: string;
    icon: React.ReactNode;
    count: number;
    unit: string;
  }> = [
    { key: 'products', label: 'كتالوج المنتجات', icon: <Package className="w-4 h-4 text-[#128C7E]" />, count: products.length, unit: 'منتج' },
    { key: 'orders', label: 'إدارة الطلبات والمبيعات', icon: <ShoppingBag className="w-4 h-4 text-[#7C3AED]" />, count: orders.length, unit: 'طلب' },
    { key: 'customers', label: 'قاعدة بيانات العملاء CRM', icon: <Users className="w-4 h-4 text-blue-500" />, count: customers.length, unit: 'عميل' },
    { key: 'chats', label: 'المحادثات وصندوق الوارد', icon: <MessageSquare className="w-4 h-4 text-emerald-500" />, count: chats.length, unit: 'محادثة' },
    { key: 'channels', label: 'سجلات الويب هوك والقوالب', icon: <Network className="w-4 h-4 text-amber-500" />, count: webhookLogs.length, unit: 'سجل' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 left-6 z-60 bg-[#128C7E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#111827] w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-[#1F293D] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>إدارة البيانات التجريبية والوهمية (Mock Data)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                التحكم الشامل في توليد أو تفريغ البيانات الوهمية عبر كافة شاشات المنصة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status Alert */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            isMockDataActive
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-50 dark:bg-[#128C7E]/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
          }`}>
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-extrabold block">
                {isMockDataActive ? 'الوضع الحالي: بيانات تجريبية نشطة (Demo Mode)' : 'الوضع الحالي: بيانات نظيفة فارغة (Clean Ready Mode)'}
              </span>
              <p className="leading-relaxed opacity-90">
                {isMockDataActive
                  ? 'يتم عرض نماذج بيانات واقعية في كل الصفحات لاختبار الواجهات والتصميم. يمكنك تفريغها بضغطة زر واحدة لتجهيز النظام لاستقبال بياناتك الحقيقية.'
                  : 'كافة الصفحات خالية تماماً من أي بيانات وهمية، وتعرض واجهات إرشادية جاهزة لاستقبال منتجاتك وطلباتك الحقيقية.'}
              </p>
            </div>
          </div>

          {/* Master Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleClearAll}
              className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 text-xs font-black transition-all cursor-pointer shadow-sm"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>تفريغ وحذف كافة البيانات الوهمية</span>
            </button>

            <button
              onClick={handleSeedAll}
              className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-violet-50 dark:bg-[#7C3AED]/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-[#7C3AED] dark:text-violet-300 border border-violet-200 dark:border-violet-900/50 text-xs font-black transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span>إعادة توليد وتعبئة البيانات التجريبية</span>
            </button>
          </div>

          {/* Granular Section Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              التحكم في بيانات كل قسم على حدة
            </h3>
            <div className="space-y-2">
              {sections.map((sec) => (
                <div
                  key={sec.key}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-[#1F293D]/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xs">
                      {sec.icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                        {sec.label}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {sec.count > 0 ? `${sec.count} ${sec.unit} موجودة` : 'فارغ تماماً (0)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {sec.count > 0 ? (
                      <button
                        onClick={() => {
                          clearSection(sec.key);
                          showToast(`تم تفريغ بيانات ${sec.label}`);
                        }}
                        className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer"
                      >
                        حذف وتفريغ
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          seedSection(sec.key);
                          showToast(`تم توليد بيانات تجريبية لـ ${sec.label}`);
                        }}
                        className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#7C3AED] bg-violet-50 dark:bg-[#7C3AED]/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 border border-violet-200 dark:border-violet-900/40 transition-colors cursor-pointer"
                      >
                        توليد بيانات
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-[#1F293D] bg-slate-50/50 dark:bg-slate-800/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#128C7E] text-white text-xs font-bold hover:bg-[#0d6e63] transition-colors cursor-pointer shadow-md shadow-[#128C7E]/20"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
