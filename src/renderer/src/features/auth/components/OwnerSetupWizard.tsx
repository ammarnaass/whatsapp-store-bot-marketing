import React, { useState } from 'react';
import { Crown, Sparkles, Store, Mail, Lock, User as UserIcon, Phone, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const OwnerSetupWizard: React.FC = () => {
  const [storeName, setStoreName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { register, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    await register({ email: email.trim(), name: name.trim(), password, phone: phone.trim(), storeName: storeName.trim() });
  };

  return (
    <div className="w-full max-w-[460px] bg-white dark:bg-[#111827] rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-6 pb-4 bg-gradient-to-b from-emerald-50/70 to-transparent dark:from-emerald-950/20 text-center relative">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/25">
          <Crown className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>التهيئة الأولى - حساب المالك الرئيسي</span>
        </div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white">مرحباً بك في WaSell AI</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">أنشئ حساب المدير العام للمتجر للبدء بكامل الصلاحيات</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-3 text-xs">
        {error && <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-center">{error}</div>}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المتجر أو العلامة التجارية *</label>
          <div className="relative">
            <Store className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="مثال: متجر الأناقة الذكي" required className="w-full h-9 pr-9 pl-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#128C7E] outline-none text-slate-800 dark:text-slate-100" />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل لمالك المتجر *</label>
          <div className="relative">
            <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="عبدالله الشمري" required className="w-full h-9 pr-9 pl-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#128C7E] outline-none text-slate-800 dark:text-slate-100" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني *</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@store.com" required dir="ltr" className="w-full h-9 pr-9 pl-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#128C7E] outline-none text-slate-800 dark:text-slate-100 font-mono text-[11px]" />
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الواتساب</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+9665..." dir="ltr" className="w-full h-9 pr-9 pl-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#128C7E] outline-none text-slate-800 dark:text-slate-100 font-mono text-[11px]" />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">كلمة مرور المالك (6 خانات على الأقل) *</label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} dir="ltr" className="w-full h-9 pr-9 pl-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#128C7E] outline-none text-slate-800 dark:text-slate-100 text-xs" />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full h-10 mt-2 rounded-xl bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#128C7E]/25 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          <span>تأكيد الحساب وإطلاق المتجر</span>
        </button>
      </form>
    </div>
  );
};

