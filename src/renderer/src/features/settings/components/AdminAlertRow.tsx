import React from 'react';

interface AdminAlertRowProps {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

export const AdminAlertRow: React.FC<AdminAlertRowProps> = ({
  icon,
  title,
  badge,
  badgeColor = 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400',
  description,
  checked,
  onToggle,
}) => {
  return (
    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
      <div className="flex items-center gap-3 max-w-[80%]">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{title}</h4>
            {badge && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-5 h-5 accent-[#128C7E] rounded cursor-pointer shrink-0"
      />
    </div>
  );
};

