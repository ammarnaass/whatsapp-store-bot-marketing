import React from 'react';

interface PaymentGatewayRowProps {
  badgeText: string;
  badgeBg?: string;
  badgeTextColor?: string;
  title: string;
  tag?: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export const PaymentGatewayRow: React.FC<PaymentGatewayRowProps> = ({
  badgeText,
  badgeBg = 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-700',
  badgeTextColor = 'text-[#128C7E]',
  title,
  tag,
  description,
  checked,
  onToggle,
  children,
}) => {
  return (
    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-10 rounded-lg border flex items-center justify-center font-black text-xs shadow-xs shrink-0 ${badgeBg} ${badgeTextColor}`}>
            {badgeText}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{title}</h4>
              {tag && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#128C7E]/10 text-[#128C7E] font-bold">
                  {tag}
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
      {children}
    </div>
  );
};

