import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, KeyRound, Edit2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { User, ROLE_LABELS } from '../types/auth.types';
import { api } from '../../../api-bridge';
import { useAuthStore } from '../store/useAuthStore';
import { SubAccountModal } from './SubAccountModal';
import { SubAccountPasswordModal } from './SubAccountPasswordModal';

export const TeamManagementTab: React.FC = () => {
  const { currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try { setUsers((await api.auth.listUsers()) || []); } catch {}
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    const actionLabel = nextStatus === 'suspended' ? 'تعليق' : 'إعادة تفعيل';
    if (!confirm(`هل تريد ${actionLabel} حساب (${user.name})؟`)) return;
    try {
      const res = await api.auth.toggleUserStatus?.({ userId: user.id, status: nextStatus });
      if (res?.success) await fetchUsers();
      else alert(res?.error || 'تعذر تغيير حالة الحساب');
    } catch { alert('حدث خطأ'); }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`هل أنت متأكد من حذف حساب (${user.name}) نهائياً؟`)) return;
    try {
      const res = await api.auth.deleteUser({ userId: user.id });
      if (res.success) await fetchUsers();
      else alert(res.error || 'تعذر حذف الحساب');
    } catch { alert('حدث خطأ'); }
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200">فريق العمل والحسابات الفرعية</h4>
          <p className="text-[11px] text-slate-400">إدارة حسابات الموظفين ومصفوفة الصلاحيات الخاصة بهم</p>
        </div>
        <button
          onClick={() => { setEditingUser(null); setIsSubModalOpen(true); }}
          type="button"
          className="h-8 px-3 rounded-xl bg-[#128C7E] hover:bg-[#0da08e] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>إضافة موظف جديد</span>
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/60">
        {users.map((u) => {
          const meta = ROLE_LABELS[u.role] || { label: u.role, badgeColor: 'bg-slate-100' };
          const isSelf = u.id === currentUser?.id;
          const isSuspended = u.status === 'suspended';
          const permsCount = u.permissions?.includes('*') ? 'كامل الصلاحيات' : `${u.permissions?.length || 0} شاشات`;

          return (
            <div key={u.id} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isSuspended ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  {u.name[0] || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                    {isSelf && <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded font-bold">أنت</span>}
                    {isSuspended && <span className="text-[10px] bg-rose-100 dark:bg-rose-950/60 text-rose-600 px-1.5 py-0.2 rounded font-bold">معلق</span>}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{u.email}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">{permsCount}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${meta.badgeColor}`}>{meta.label}</span>
                {!isSelf && u.role !== 'owner' && (
                  <>
                    <button onClick={() => { setEditingUser(u); setIsSubModalOpen(true); }} type="button" className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100" title="تعديل الصلاحيات">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setPasswordUser(u)} type="button" className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50" title="إعادة تعيين كلمة المرور">
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleToggleStatus(u)} type="button" className={`p-1.5 rounded-lg ${isSuspended ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`} title={isSuspended ? 'إلغاء التعليق' : 'تعليق الحساب'}>
                      {isSuspended ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleDelete(u)} type="button" className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50" title="حذف الحساب">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <SubAccountModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} onSuccess={fetchUsers} editingUser={editingUser} creatorId={currentUser?.id} />
      <SubAccountPasswordModal isOpen={Boolean(passwordUser)} onClose={() => setPasswordUser(null)} user={passwordUser} onSuccess={fetchUsers} />
    </div>
  );
};
