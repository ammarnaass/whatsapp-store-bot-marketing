import React from 'react';
import { Sparkles } from 'lucide-react';

export const StepWelcome: React.FC = () => {
  return (
    <div className="text-center py-8 space-y-3">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
        <Sparkles className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white">
        مرحباً بك في منصة WaSell
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        الحل المتكامل لتحويل محادثات واتساب إلى متجر ذكي يبيع المنتجات الفيزيائية والرقمية بالذكاء الاصطناعي مع الحفاظ التام على أمان بياناتك وتشغيل محلي سلس.
      </p>
    </div>
  );
};
