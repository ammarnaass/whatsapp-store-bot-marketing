import React from 'react';

interface WhatsAppBehaviorToggleProps {
  title: string;
  badge?: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

export const WhatsAppBehaviorToggle: React.FC<WhatsAppBehaviorToggleProps> = ({
  title,
  badge,
  description,
  checked,
  onToggle,
}) => {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D]">
      <div className="space-y-0.5 max-w-[78%]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 dark:text-white">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#128C7E] text-white font-bold">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#128C7E]" />
      </label>
    </div>
  );
};

