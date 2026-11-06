import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, UserCog, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ROLE_LABELS } from '../types/auth.types';

export const UserProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { currentUser, logout, setAccountModalOpen } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!currentUser) return null;

  const roleMeta = ROLE_LABELS[currentUser.role] || {
    label: 'مستخدم',
    badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name[0] || 'U').toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className="flex items-center gap-2 pr-1.5 pl-2 py-1 mr-0.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-[#1F293D] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
        title="الملف الشخصي وإعدادات الحساب"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#128C7E] to-[#075E54] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-[#128C7E]/20 shrink-0">
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
          ) : (
            getInitials(currentUser.name)
          )}
        </div>
        <div className="flex flex-col text-right leading-tight hidden xl:flex">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            {currentUser.name}
            {currentUser.role === 'owner' && (
              <ShieldCheck className="w-3 h-3 text-[#128C7E] dark:text-emerald-400" />
            )}
          </span>
          <span className="text-[10px] text-slate-400">{roleMeta.label}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1F293D] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-1.5 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-[#128C7E] to-[#075E54] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(currentUser.name)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
              <div className="mt-1">
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${roleMeta.badgeColor}`}>{roleMeta.label}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              setAccountModalOpen(true);
            }}
            type="button"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer"
          >
            <UserCog className="w-4 h-4 text-[#128C7E]" />
            <span>إدارة الحساب والفريق</span>
          </button>

          <div className="my-1 border-t border-slate-100 dark:border-[#1F293D]" />

          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            type="button"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  );
};

