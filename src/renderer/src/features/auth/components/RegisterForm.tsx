import React, { useState } from 'react';
import { UserPlus, Mail, User, Phone, Lock, Eye, EyeOff, Loader2, Store } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  isFirstOwner?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, isFirstOwner = false }) => {
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { register, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (password.length < 6) return setLocalError('يجب أن تتكون كلمة المرور من 6 خانات على الأقل');
    if (password !== confirmPassword) return setLocalError('كلمتا المرور غير متطابقتين');
    await register({ email: email.trim(), name: name.trim(), password, phone: phone.trim(), storeName: storeName.trim() });
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      {displayError && (
        <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center">
          {displayError}
        </div>
      )}
      {isFirstOwner && (
        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs text-center font-medium">
          مرحباً بك! أنت تقوم بتهيئة المتجر كـ <strong>المالك الرئيسي الأول</strong>.
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك الكامل *" required className="w-full h-9 pr-9 pl-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:border-[#128C7E] text-slate-900 dark:text-white" />
        </div>
        <div className="relative">
          <Store className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="اسم المتجر" className="w-full h-9 pr-9 pl-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:border-[#128C7E] text-slate-900 dark:text-white" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني *" required className="w-full h-9 pr-9 pl-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:border-[#128C7E] text-slate-900 dark:text-white" dir="ltr" />
        </div>
        <div className="relative">
          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="واتساب المتجر" className="w-full h-9 pr-9 pl-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:border-[#128C7E] text-slate-900 dark:text-white" dir="ltr" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور *" required className="w-full h-9 pr-9 pl-8 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:border-[#128C7E] text-slate-900 dark:text-white" dir="ltr" />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
        <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="تأكيد الكلمة *" required className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:border-[#128C7E] text-slate-900 dark:text-white" dir="ltr" />
      </div>
      <button type="submit" disabled={isLoading} className="w-full h-10 rounded-xl bg-gradient-to-r from-[#128C7E] to-[#0D6D61] hover:from-[#0D6D61] text-white text-xs font-bold shadow-md shadow-[#128C7E]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
        <span>{isFirstOwner ? 'إنهاء التهيئة وتفعيل حساب المالك' : 'إنشاء حساب تاجر جديد'}</span>
      </button>
      {!isFirstOwner && (
        <div className="pt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          لديك حساب بالفعل؟{' '}
          <button type="button" onClick={onSwitchToLogin} className="text-[#128C7E] dark:text-emerald-400 font-bold hover:underline cursor-pointer">
            تسجيل الدخول
          </button>
        </div>
      )}
    </form>
  );
};
