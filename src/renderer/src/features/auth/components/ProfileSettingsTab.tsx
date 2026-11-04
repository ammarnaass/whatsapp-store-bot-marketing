import React, { useState } from 'react';
import { User, Phone, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ROLE_LABELS } from '../types/auth.types';
import { api } from '../../../api-bridge';

export const ProfileSettingsTab: React.FC = () => {
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
          setStatusMsg({ text: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', isError: true });
          setIsSaving(false);
          return;
        }
        const pwRes = await api.auth.changePassword({ userId: currentUser.id, oldPassword, newPassword });
        if (!pwRes.success) {
          setStatusMsg({ text: pwRes.error || 'فشل تحديث كلمة المرور', isError: true });
          setIsSaving(false);
          return;
        }
        setOldPassword('');
        setNewPassword('');
      }
      if (ok) {
        setStatusMsg({ text: 'تم تحديث بيانات الملف الشخصي بنجاح', isError: false });
      }
    } catch {
      setStatusMsg({ text: 'حدث خطأ أثناء حفظ التعديلات', isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-4">
      {statusMsg && (
        <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
          statusMsg.isError ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
        }`}>
          {statusMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل</label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full h-10 pr-9 pl-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] rounded-xl focus:border-[#128C7E] outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف / واتساب</label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr"
              placeholder="+213..." className="w-full h-10 pr-9 pl-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] rounded-xl focus:border-[#128C7E] outline-none text-right" />
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between border border-slate-200/60 dark:border-[#1F293D]">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.email}</p>
            <p className="text-[10px] text-slate-400">{roleMeta?.description}</p>
          </div>
        </div>
        <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${roleMeta?.badgeColor}`}>
          {roleMeta?.label}
        </span>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-[#1F293D]">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          تغيير كلمة المرور (اختياري)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
            placeholder="كلمة المرور الحالية" className="h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] rounded-xl outline-none" />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            placeholder="كلمة المرور الجديدة (6 أحرف فأكثر)" className="h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] rounded-xl outline-none" />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isSaving}
          className="h-10 px-5 bg-[#128C7E] hover:bg-[#0da08e] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50">
          {isSaving ? 'جارِ الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </form>
  );
};

