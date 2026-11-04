import React from 'react';
import { X, RefreshCw, Smartphone, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface OpenWAQrModalProps {
  isOpen: boolean;
  qrCodeData: string;
  countdown: number;
  onClose: () => void;
  onRefresh: () => void;
}

export const OpenWAQrModal: React.FC<OpenWAQrModalProps> = ({
  isOpen,
  qrCodeData,
  countdown,
  onClose,
  onRefresh,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-[#1F293D] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-[#128C7E]/10 text-[#128C7E] dark:bg-[#128C7E]/20 mb-3">
            <Smartphone className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            ربط واتساب بمسح رمز الـ QR
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            اربط رقم متجرك مباشرة عبر بروتوكول Multi-Device الذاتي التكلفة
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative p-4 rounded-2xl bg-white border-2 border-slate-200 dark:border-slate-700 shadow-md">
            {qrCodeData ? (
              <img
                src={qrCodeData}
                alt="WhatsApp QR Code"
                className="w-56 h-56 object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex flex-col items-center justify-center bg-slate-50 text-slate-400 rounded-xl">
                <RefreshCw className="w-8 h-8 animate-spin mb-2 text-[#128C7E]" />
                <span className="text-xs font-semibold">جارٍ توليد الرمز...</span>
              </div>
            )}
          </div>

          {/* Countdown & Refresh Indicator */}
          <div className="flex items-center gap-2 mt-4 text-xs text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>يتم تحديث الرمز تلقائياً خلال:</span>
            <span className="font-mono font-bold text-[#128C7E] text-sm bg-[#128C7E]/10 px-2 py-0.5 rounded-md">
              {countdown}s
            </span>
            <button
              type="button"
              onClick={onRefresh}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[#128C7E] transition-all cursor-pointer mr-1"
              title="تحديث يدوي فوري"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60 my-5">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>خطوات الربط في 4 ثوانٍ:</span>
          </h4>
          <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#128C7E] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                1
              </span>
              <span>افتح تطبيق واتساب على هاتفك الذكي (العادي أو التجاري).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#128C7E] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                2
              </span>
              <span>اذهب إلى الإعدادات أو القائمة (⁝) واضغط على <strong>الأجهزة المرتبطة</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#128C7E] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                3
              </span>
              <span>اضغط على <strong>ربط جهاز</strong> ووجّه كاميرا الهاتف نحو الرمز أعلاه.</span>
            </li>
          </ol>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>تشفير طرف لطرف (End-to-End Encrypted)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-[36px] px-5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
