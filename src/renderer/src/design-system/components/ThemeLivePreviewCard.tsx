import React from 'react';
import { ShoppingBag, CheckCheck, Sparkles, MessageCircle } from 'lucide-react';
import { generateGlowColor, generateLightBackground } from '../utils/color-converter.utils';

interface ThemeLivePreviewCardProps {
  primaryHex: string;
  accentHex: string;
  storeName?: string;
}

export const ThemeLivePreviewCard: React.FC<ThemeLivePreviewCardProps> = ({
  primaryHex,
  accentHex,
  storeName = 'متجر الأناقة الحديثة',
}) => {
  const glow = generateGlowColor(primaryHex, 0.35);
  const lightBg = generateLightBackground(primaryHex);

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-lg space-y-3.5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1F293D] pb-2.5">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: primaryHex }}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{storeName}</h5>
            <span className="text-[10px] text-slate-400">معاينة تفاعلية حية للهوية</span>
          </div>
        </div>

        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs"
          style={{ backgroundColor: lightBg, color: primaryHex }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: accentHex }} />
          مفتوح للطلبات
        </span>
      </div>

      {/* Simulated Primary Button */}
      <div>
        <button
          type="button"
          className="w-full h-9 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
          style={{
            backgroundColor: primaryHex,
            boxShadow: `0 4px 14px ${glow}`,
          }}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>إتمام الطلب والدفع الفوري</span>
        </button>
      </div>

      {/* Simulated WhatsApp Chat Bubble */}
      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-[#1F293D]/60 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
          <MessageCircle className="w-3 h-3 text-emerald-500" />
          <span>رسالة واتساب التلقائية للعميل:</span>
        </div>
        <div
          className="p-2.5 rounded-lg text-xs leading-relaxed max-w-[92%] mr-auto shadow-xs"
          style={{
            backgroundColor: lightBg,
            color: '#0F172A',
            borderRight: `3px solid ${primaryHex}`,
          }}
        >
          <p className="font-medium text-[11px]">مرحباً بك عزيزي العميل! تم تأكيد طلبك #1084 بنجاح وسيتم تجهيز الشحنة فوراً 🚀</p>
          <div className="flex items-center justify-end gap-1 text-[9px] text-slate-500 mt-1">
            <span>12:45 م</span>
            <CheckCheck className="w-3.5 h-3.5" style={{ color: accentHex }} />
          </div>
        </div>
      </div>
    </div>
  );
};
