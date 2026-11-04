import React from 'react';
import { UserCheck } from 'lucide-react';
import { UserProfileCard } from './UserProfileCard';
import { TeamMembersCard } from './TeamMembersCard';
import { AccountSecuritySummary } from './AccountSecuritySummary';

export const AccountManagementSection: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-[#1F293D]">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
            style={{ backgroundColor: 'var(--color-brand-primary)' }}
          >
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">إدارة الحساب وفريق العمل</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تعديل بيانات الحساب، تغيير كلمة المرور، وإدارة صلاحيات المشرفين والموظفين
            </p>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* User Profile Card */}
        <div className="xl:col-span-7">
          <UserProfileCard />
        </div>

        {/* Security & Access Summary */}
        <div className="xl:col-span-5">
          <AccountSecuritySummary />
        </div>

        {/* Team Members List & Management */}
        <div className="xl:col-span-12">
          <TeamMembersCard />
        </div>
      </div>
    </div>
  );
};

