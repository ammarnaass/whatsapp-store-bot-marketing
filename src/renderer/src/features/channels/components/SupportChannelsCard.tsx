import React from 'react';
import { Smartphone, Send, Share2, ShieldCheck } from 'lucide-react';

interface SupportChannelsCardProps {
  smsFallbackActive: boolean;
  onToggleSmsFallback: (active: boolean) => void;
  instagramConnected: boolean;
  onToggleInstagram: () => void;
}

export const SupportChannelsCard: React.FC<SupportChannelsCardProps> = ({
  smsFallbackActive,
  onToggleSmsFallback,
  instagramConnected,
  onToggleInstagram
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Channel 1: SMS Failover */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                الرسائل النصية الاحتياطية (SMS Fallback)
              </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsFallbackActive}
                onChange={(e) => onToggleSmsFallback(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#128C7E]"></div>
            </label>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تحويل روابط الدفع وأكواد التحقق إلى SMS فوراً عبر بوابة Unifonic في حال عدم استلام رسالة
            الواتساب خلال 180 ثانية.
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            بوابة الربط الحالية:
          </span>
          <span className="text-[#128C7E] font-bold">Unifonic Gateway (KSA)</span>
        </div>
      </div>

      {/* Channel 2: Instagram Direct Messaging */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                إنستقرام دايركت (Instagram Direct)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
              جاهز للربط
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ربط محادثات وخاص إنستقرام بنفس محرك الذكاء الاصطناعي للرد على التعليقات والقصص وطلبات
            الشراء في شاشة واحدة موحدة.
          </p>
        </div>
        <button
          onClick={onToggleInstagram}
          type="button"
          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            instagramConnected
              ? 'bg-emerald-50 text-emerald-700 dark:bg-[#128C7E]/20 dark:text-emerald-300 border border-emerald-300'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>
            {instagramConnected ? 'متصل: @wasell.saudi' : 'ربط حساب Instagram Business'}
          </span>
        </button>
      </div>

      {/* Security & PDPL Compliance */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#128C7E]" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                الامتثال وأمن البيانات (PDPL & Cyber)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7F6F2] text-[#075E54] dark:bg-[#128C7E]/20 dark:text-emerald-300">
              متوافق 100%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تشفير تام للطرفين (End-to-End Encryption) ومتوافق بالكامل مع نظام حماية البيانات الشخصية
            السعودي وضوابط الأمن السيبراني.
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">استضافة البيانات:</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
            مركز بيانات محلي (الرياض)
          </span>
        </div>
      </div>
    </div>
  );
};
