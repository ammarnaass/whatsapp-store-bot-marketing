import React, { useState } from 'react';
import { X, KeyRound, Loader2 } from 'lucide-react';
import { User } from '../types/auth.types';
import { api } from '../../../api-bridge';

interface SubAccountPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

export const SubAccountPasswordModal: React.FC<SubAccountPasswordModalProps> = ({ isOpen, onClose, user, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { setError('كلمة المرور يجب أن لا تقل عن 6 خانات'); return; }
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await api.auth.adminResetPassword?.({ userId: user.id, newPassword });
      if (res?.success) {
        onSuccess();
        onClose();
        setNewPassword('');
      } else {
        setError(res?.error || 'فشل إعادة تعيين كلمة المرور');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111827] w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">إعادة تعيين كلمة المرور</h3>
              <p className="text-[10px] text-slate-400">للموظف: {user.name}</p>
            </div>
          </div>
          <button onClick={onClose} type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {error && <div className="p-2 rounded-xl bg-rose-50 text-rose-700 font-bold">{error}</div>}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">كلمة المرور الجديدة *</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              dir="ltr"
              className="w-full h-8 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="h-8 px-3 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-100">إلغاء</button>
            <button type="submit" disabled={isSubmitting} className="h-8 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 disabled:opacity-50">
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>حفظ وتحديث</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
