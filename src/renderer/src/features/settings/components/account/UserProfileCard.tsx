import React, { useState } from 'react';
import { User, Phone, Mail, Lock, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAuthStore } from '../../../auth/store/useAuthStore';
import { ROLE_LABELS } from '../../../auth/types/auth.types';
import { api } from '../../../../api-bridge';

export const UserProfileCard: React.FC = () => {
  const { currentUser, updateProfile } = useAuthStore();
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) return null;
  const roleMeta = ROLE_LABELS[currentUser.role];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);
    try {
      const ok = await updateProfile({ name, phone });
      if (newPassword) {
        if (newPassword.length < 6) {
          setStatusMsg({ text: 'كلمة المرور الجديدة يجب أن تتكون من 6 خانات على الأقل', isError: true });
          setIsSaving(false);
          return;
        }
        const pwRes = await api.auth.changePassword({ userId: currentUser.id, oldPassword, newPassword });
        if (!pwRes.success) {
          setStatusMsg({ text: pwRes.error || 'تعذر تحديث كلمة المرور', isError: true });
          setIsSaving(false);
          return;
        }
        setOldPassword('');
        setNewPassword('');
      }
      if (ok) {
        setStatusMsg({ text: 'تم حفظ وتحديث بيانات الملف الشخصي بنجاح', isError: false });
      }
    } catch {
      setStatusMsg({ text: 'حدث خطأ أثناء حفظ التعديلات', isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl p-5 elevation-1">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#1F293D]/80 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white">الملف الشخصي وبيانات الدخول</h3>
            <p className="text-[10px] text-slate-400">تعديل الاسم ورقم واتساب المعتمد وكلمة المرور</p>
          </div>
        </div>
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${roleMeta?.badgeColor}`}>
          {roleMeta?.label}
        </span>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
        {statusMsg && (
          <div className={`p-2.5 rounded-xl flex items-center gap-2 text-[11px] font-bold ${statusMsg.isError ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'}`}>
            {statusMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-slate-900 dark:text-white outline-none focus:border-[#128C7E]" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف / واتساب</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" placeholder="+966..."
              className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-right" />
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{currentUser.email}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold shrink-0">حساب موثق</span>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-[#1F293D] space-y-2">
          <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>تحديث كلمة المرور (اختياري)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="كلمة المرور الحالية"
              className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-slate-900 dark:text-white outline-none focus:border-[#128C7E]" />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="كلمة المرور الجديدة"
              className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-slate-900 dark:text-white outline-none focus:border-[#128C7E]" />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" disabled={isSaving} className="h-9 px-5 rounded-xl text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 transition-all" style={{ backgroundColor: 'var(--color-brand-primary)' }}>
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

