import React, { useState } from 'react';
import { X, User, Users, Shield } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ProfileSettingsTab } from './ProfileSettingsTab';
import { TeamManagementTab } from './TeamManagementTab';

export const AccountManagementModal: React.FC = () => {
  const { isAccountModalOpen, setAccountModalOpen, currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'team'>('profile');

  if (!isAccountModalOpen || !currentUser) return null;

  const canManageTeam = currentUser.role === 'owner' || currentUser.role === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1F293D] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#128C7E]/10 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">إدارة الحساب وفريق العمل</h3>
              <p className="text-[11px] text-slate-400">تخصيص البيانات الشخصية والصلاحيات والوصول</p>
            </div>
          </div>
          <button
            onClick={() => setAccountModalOpen(false)}
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-100 dark:border-[#1F293D] flex gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            type="button"
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#128C7E] text-[#128C7E] dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>الملف الشخصي</span>
          </button>

          {canManageTeam && (
            <button
              onClick={() => setActiveTab('team')}
              type="button"
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'team'
                  ? 'border-[#128C7E] text-[#128C7E] dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>فريق العمل والصلاحيات</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'profile' && <ProfileSettingsTab />}
          {activeTab === 'team' && canManageTeam && <TeamManagementTab />}
        </div>
      </div>
    </div>
  );
};

