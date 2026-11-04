import React, { useState } from 'react';
import { UserPlus, Mail, User, Phone, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
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

    if (password.length < 6) {
      setLocalError('يجب أن تتكون كلمة المرور من 6 أحرف أو أرقام على الأقل');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('كلمتا المرور غير متطابقتين');
      return;
    }

    await register({ email, name, password, phone });
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {displayError && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center">
          {displayError}
        </div>
      )}

      {/* Name Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل</label>
        <div className="relative">
          <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: محمد السعيد"
            required
            className="w-full h-10 pr-10 pl-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:outline-none focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/15 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
        <div className="relative">
          <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="store@domain.com"
            required
            className="w-full h-10 pr-10 pl-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:outline-none focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/15 text-slate-900 dark:text-white"
            dir="ltr"
          />
        </div>
      </div>

      {/* Phone Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رقم هاتف الواتساب</label>
        <div className="relative">
          <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+966500000000"
            className="w-full h-10 pr-10 pl-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:outline-none focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/15 text-slate-900 dark:text-white"
            dir="ltr"
          />
        </div>
      </div>

      {/* Password Inputs */}
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            required
            className="w-full h-10 pr-3.5 pl-9 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:outline-none focus:border-[#128C7E] text-slate-900 dark:text-white"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        <input
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="تأكيد الكلمة"
          required
          className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:outline-none focus:border-[#128C7E] text-slate-900 dark:text-white"
          dir="ltr"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-xl bg-gradient-to-r from-[#128C7E] to-[#0D6D61] hover:from-[#0D6D61] hover:to-[#075E54] text-white text-xs font-bold shadow-md shadow-[#128C7E]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
        <span>إنشاء حساب تاجر جديد</span>
      </button>

      <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        لديك حساب بالفعل؟{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#128C7E] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
        >
          تسجيل الدخول
        </button>
      </div>
    </form>
  );
};

