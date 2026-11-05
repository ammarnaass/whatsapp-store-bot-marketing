import React, { useState } from 'react';
import { Bot, ShieldCheck, Sparkles } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ThemeToggle } from '../../theme';
import { useAuthStore } from '../store/useAuthStore';

export const AuthScreen: React.FC = () => {
  const { isFirstTimeSetup } = useAuthStore();
  const [isRegisterView, setIsRegisterView] = useState(isFirstTimeSetup);

  const activeIsRegister = isFirstTimeSetup || isRegisterView;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md select-none">
      <div className="w-full max-w-[440px] bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-[#1F293D] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-[#1F293D] relative bg-slate-50/50 dark:bg-slate-900/30">
          <div className="absolute left-5 top-5">
            <ThemeToggle />
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#128C7E] to-[#0D6D61] text-white flex items-center justify-center shadow-lg shadow-[#128C7E]/25 mb-3">
              <Bot className="w-6 h-6" />
            </div>

            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">WaSell</span>
              <span className="text-xl font-black text-[#128C7E]">AI</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 mr-1">
                {isFirstTimeSetup ? 'تهيئة المتجر الأولى' : 'منصة المبيعات الذكية'}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              {isFirstTimeSetup
                ? 'أنشئ حساب مالك المتجر لتهيئة المنظومة وقاعدة البيانات'
                : activeIsRegister
                ? 'سجّل متجرك وابدأ أتمتة المبيعات فوراً'
                : 'سجل الدخول لإدارة محادثات ومتجر واتساب'}
            </p>
          </div>

          {!isFirstTimeSetup && (
            <div className="mt-4 grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setIsRegisterView(false)}
                className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !activeIsRegister
                    ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => setIsRegisterView(true)}
                className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeIsRegister
                    ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                حساب جديد
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {activeIsRegister ? (
            <RegisterForm onSwitchToLogin={() => setIsRegisterView(false)} isFirstOwner={isFirstTimeSetup} />
          ) : (
            <LoginForm onSwitchToRegister={() => setIsRegisterView(true)} />
          )}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-[#1F293D] flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          {isFirstTimeSetup ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>الإعداد الأولي - سيتم ربط الصلاحيات الكاملة بهذا الحساب</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#128C7E] dark:text-emerald-400" />
              <span>جلسات مشفرة ومؤمنة بالكامل على جهازك</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
