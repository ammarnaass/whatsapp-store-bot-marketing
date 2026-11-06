import React, { useState, useEffect } from 'react';
import { X, Shield, Check, Lock, Mail, User as UserIcon, Phone } from 'lucide-react';
import { User, UserRole, ROLE_LABELS, AVAILABLE_PERMISSIONS } from '../types/auth.types';
import { api } from '../../../api-bridge';
interface SubAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingUser?: User | null;
  creatorId?: string;
}
export const SubAccountModal: React.FC<SubAccountModalProps> = ({ isOpen, onClose, onSuccess, editingUser, creatorId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('sales');
  const [selectedPerms, setSelectedPerms] = useState<string[]>(['inbox', 'catalog', 'orders']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setPhone(editingUser.phone || '');
      setRole(editingUser.role);
      setSelectedPerms(editingUser.permissions || ['inbox']);
      setPassword('');
    } else {
      setName(''); setEmail(''); setPassword(''); setPhone(''); setRole('sales');
      setSelectedPerms(['inbox', 'catalog', 'orders']);
    }
    setError(null);
  }, [editingUser, isOpen]);
  if (!isOpen) return null;
  const togglePerm = (id: string) => {
    setSelectedPerms((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (editingUser) {
        const res = await api.auth.updateUser?.({ userId: editingUser.id, name, role, permissions: selectedPerms, phone });
        if (res?.success) { onSuccess(); onClose(); } else setError(res?.error || 'فشل تحديث البيانات');
      } else {
        const res = await api.auth.createUser({ email, name, password, role, permissions: selectedPerms, phone, creatorId });
        if (res.success) { onSuccess(); onClose(); } else setError(res.error || 'فشل إنشاء الحساب');
      }
    } catch (err: any) { setError(err.message || 'حدث خطأ في الاتصال'); }
    finally { setIsSubmitting(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#128C7E] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{editingUser ? 'تعديل الحساب الفرعي' : 'إضافة حساب موظف جديد'}</h3>
          </div>
          <button onClick={onClose} type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto scrollbar-thin text-xs">
          {error && <div className="p-2 rounded-xl bg-rose-50 text-rose-700 font-bold">{error}</div>}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الموظف *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={Boolean(editingUser)} required dir="ltr" className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg outline-none disabled:opacity-50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {!editingUser && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">كلمة المرور المؤقتة *</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} dir="ltr" className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" />
              </div>
            )}
            <div className={editingUser ? 'col-span-2' : ''}>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الدور الوظيفي</label>
              <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg outline-none">
                <option value="sales">مسؤول مبيعات ومحادثات (Sales)</option>
                <option value="inventory">أمين مستودع وتراخيص (Inventory)</option>
                <option value="support">خدمة عملاء ودعم (Support)</option>
                <option value="admin">مدير عمليات وتشغيل (Admin)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">مصفوفة الصلاحيات الممنوحة للشاشات</label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 max-h-40 overflow-y-auto scrollbar-thin">
              {AVAILABLE_PERMISSIONS.map((perm) => (
                <label key={perm.id} onClick={() => togglePerm(perm.id)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 cursor-pointer select-none">
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${selectedPerms.includes(perm.id) ? 'bg-[#128C7E] border-[#128C7E] text-white' : 'border-slate-300'}`}>
                    {selectedPerms.includes(perm.id) && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="h-8 px-3 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-100">إلغاء</button>
            <button type="submit" disabled={isSubmitting} className="h-8 px-4 rounded-lg bg-[#128C7E] hover:bg-[#0da08e] text-white font-bold disabled:opacity-50">
              {isSubmitting ? 'جارٍ الحفظ...' : editingUser ? 'حفظ التعديلات' : 'إصدار الحساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
