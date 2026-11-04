import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { User, UserRole, ROLE_LABELS } from '../types/auth.types';
import { api } from '../../../api-bridge';
import { useAuthStore } from '../store/useAuthStore';

export const TeamManagementTab: React.FC = () => {
  const { currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'sales' as UserRole });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const list = await api.auth.listUsers();
      setUsers(list || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const res = await api.auth.createUser(formData);
      if (res.success) {
        setShowAddForm(false);
        setFormData({ name: '', email: '', password: '', role: 'sales' });
        await fetchUsers();
      } else {
        setErrorMsg(res.error || 'فشل إضافة العضو');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ في الاتصال');
    }
  };

  const handleDeleteMember = async (userId: string, userName: string) => {
    if (!confirm(`هل أنت متأكد من حذف حساب (${userName}) نهائياً؟`)) return;
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">أعضاء الفريق والصلاحيات</h4>
          <p className="text-[11px] text-slate-400">إدارة حسابات الموظفين ومسؤولي خدمة العملاء والمبيعات</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          type="button"
          className="h-8 px-3 rounded-xl bg-[#128C7E] hover:bg-[#0da08e] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'إلغاء' : 'إضافة عضو جديد'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateMember} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-[#1F293D] space-y-3">
          {errorMsg && <p className="text-xs text-rose-600 font-bold">{errorMsg}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <input type="text" placeholder="اسم الموظف" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
              className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-lg outline-none" />
            <input type="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
              className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-lg outline-none" />
            <input type="password" placeholder="كلمة المرور المؤقتة" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6}
              className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-lg outline-none" />
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-lg outline-none">
              <option value="admin">مدير عمليات (Admin)</option>
              <option value="sales">مسؤول مبيعات (Sales)</option>
              <option value="support">خدمة عملاء (Support)</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="h-8 px-4 bg-[#128C7E] text-white rounded-lg text-xs font-bold hover:bg-[#0da08e] cursor-pointer">
              إنشاء الحساب
            </button>
          </div>
        </form>
      )}

      <div className="divide-y divide-slate-100 dark:divide-[#1F293D] border border-slate-200 dark:border-[#1F293D] rounded-xl overflow-hidden bg-white dark:bg-slate-900/60">
        {users.map((u) => {
          const meta = ROLE_LABELS[u.role] || { label: u.role, badgeColor: 'bg-slate-100' };
          const isSelf = u.id === currentUser?.id;
          return (
            <div key={u.id} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                  {u.name[0] || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{u.name}</span>
                    {isSelf && <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 px-1.5 py-0.2 rounded font-bold">أنت</span>}
                  </div>
                  <span className="text-[11px] text-slate-400">{u.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${meta.badgeColor}`}>
                  {meta.label}
                </span>
                {!isSelf && u.role !== 'owner' && (
                  <button onClick={() => handleDeleteMember(u.id, u.name)} type="button"
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="حذف الحساب">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

