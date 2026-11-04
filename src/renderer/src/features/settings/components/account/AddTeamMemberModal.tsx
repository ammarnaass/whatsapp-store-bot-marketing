import React, { useState } from 'react';
import { X, UserPlus, Shield, AlertCircle } from 'lucide-react';
import { UserRole } from '../../../auth/types/auth.types';
import { api } from '../../../../api-bridge';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('sales');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const res = await api.auth.createUser({ name, email, phone, password, role });
      if (res.success) {
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setRole('sales');
        onCreated();
        onClose();
      } else {
        setErrorMsg(res.error || 'فشل إنشاء حساب الموظف');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ غير متوقع في الاتصال');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">إضافة عضو جديد للفريق</h3>
              <p className="text-[11px] text-slate-400">منح صلاحيات الوصول لموظفي المبيعات وخدمة العملاء</p>
            </div>
          </div>
          <button onClick={onClose} type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-xl flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الموظف</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="مثال: أحمد خالد"
                className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-slate-900 dark:text-white outline-none focus:border-[#128C7E]" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@store.com"
                className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-slate-900 dark:text-white outline-none focus:border-[#128C7E]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف (اختياري)</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" placeholder="+966..."
                className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-right" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">كلمة المرور المؤقتة</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="6 أحرف على الأقل"
                className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-slate-900 dark:text-white outline-none focus:border-[#128C7E]" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">الصلاحية ومستوى الوصول</label>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-slate-900 dark:text-white outline-none focus:border-[#128C7E] cursor-pointer font-bold">
              <option value="admin">مدير عمليات (Admin) — وصول شبه كامل للطلبات والمخزون</option>
              <option value="sales">مسؤول مبيعات (Sales) — استقبال المحادثات وتأكيد الطلبات</option>
              <option value="support">خدمة عملاء (Support) — الرد على الاستفسارات وحل الشكاوى</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-[#1F293D] flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1F293D] text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 cursor-pointer">
              إلغاء
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl text-white font-bold cursor-pointer transition-all disabled:opacity-50" style={{ backgroundColor: 'var(--color-brand-primary)' }}>
              {isSubmitting ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

