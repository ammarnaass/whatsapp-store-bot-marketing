import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, CheckSquare, Square, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    await login(email.trim(), password, rememberMe);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
        <div className="relative">
          <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@store.com"
            required
            className="w-full h-10 pr-10 pl-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:outline-none focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/15 text-slate-900 dark:text-white"
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">كلمة المرور</label>
        <div className="relative">
          <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full h-10 pr-10 pl-11 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:outline-none focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/15 text-slate-900 dark:text-white"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-0.5">
        <label
          onClick={() => setRememberMe((v) => !v)}
          className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
        >
          {rememberMe ? <CheckSquare className="w-4 h-4 text-[#128C7E]" /> : <Square className="w-4 h-4 text-slate-400" />}
          <span>تذكرني على هذا الجهاز (30 يوماً)</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 rounded-xl bg-gradient-to-r from-[#128C7E] to-[#0D6D61] hover:from-[#0D6D61] hover:to-[#075E54] text-white text-xs font-bold shadow-md shadow-[#128C7E]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
        <span>تسجيل الدخول للمنظومة</span>
      </button>

      <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-[#128C7E]" />
        <span>بوابة دخول الموظفين والإدارة. يتم إصدار الحسابات من المدير فقط.</span>
      </div>
    </form>
  );
};
