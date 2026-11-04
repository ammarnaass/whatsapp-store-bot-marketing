import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus, Trash2, Shield, RefreshCw } from 'lucide-react';
import { User, ROLE_LABELS } from '../../../auth/types/auth.types';
import { useAuthStore } from '../../../auth/store/useAuthStore';
import { api } from '../../../../api-bridge';
import { AddTeamMemberModal } from './AddTeamMemberModal';

export const TeamMembersCard: React.FC = () => {
  const { currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await api.auth.listUsers();
      setUsers(list || []);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف حساب (${name}) نهائياً؟`)) return;
    try {
      const res = await api.auth.deleteUser({ userId });
      if (res.success) {
        await fetchUsers();
      } else {
        alert(res.error || 'تعذر حذف الحساب');
      }
    } catch {
      alert('خطأ أثناء حذف الحساب');
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">أعضاء الفريق والصلاحيات</h3>
            <p className="text-[11px] text-slate-400">إدارة حسابات الموظفين ومسؤولي خدمة العملاء والمبيعات ({users.length})</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchUsers} disabled={isLoading} title="تحديث القائمة"
            className="p-2 rounded-xl border border-slate-200 dark:border-[#1F293D] text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setIsAddModalOpen(true)} type="button"
            className="h-8 px-3 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            style={{ backgroundColor: 'var(--color-brand-primary)' }}>
            <UserPlus className="w-3.5 h-3.5" />
            <span>إضافة عضو</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {users.length === 0 && !isLoading && (
          <div className="py-8 text-center text-xs text-slate-400">لا يوجد أعضاء مسجلين حالياً.</div>
        )}
        {users.map((user) => {
          const roleInfo = ROLE_LABELS[user.role] || { label: user.role, badgeColor: 'bg-slate-100 text-slate-600' };
          const isSelf = user.id === currentUser?.id;
          const isOwner = user.role === 'owner';
          return (
            <div key={user.id} className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs shrink-0">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</span>
                    {isSelf && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold">أنت</span>}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                    <span>{user.email}</span>
                    {user.phone && <span>• {user.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${roleInfo.badgeColor}`}>
                  {roleInfo.label}
                </span>
                {!isSelf && !isOwner && (
                  <button onClick={() => handleDelete(user.id, user.name)} type="button"
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                    title="حذف الموظف">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddTeamMemberModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onCreated={fetchUsers} />
    </div>
  );
};

