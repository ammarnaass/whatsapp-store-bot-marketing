import React, { useState, useEffect } from 'react';
import { Square, Minus, Copy, X } from 'lucide-react';
import { api } from '../../../api-bridge';

export const AppHeaderWindowControls: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState<boolean>(true);

  useEffect(() => {
    api.window.isMaximized().then(setIsMaximized).catch(() => {});

    const unsub = api.window.onStateChanged((state) => {
      setIsMaximized(state.isMaximized);
    });

    return () => unsub();
  }, []);

  return (
    <div className="flex items-center gap-1.5 pr-2 mr-1 border-r border-slate-200 dark:border-[#1F293D]">
      {/* Minimize to Taskbar Button */}
      <button
        onClick={() => api.window.minimize()}
        type="button"
        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-[#1F293D] bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all cursor-pointer"
        title="تصغير النافذة إلى شريط المهام"
        aria-label="تصغير النافذة إلى شريط المهام"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      {/* Maximize / Restore Toggle Button */}
      <button
        onClick={() => api.window.toggleMaximize()}
        type="button"
        className={`w-8 h-8 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
          isMaximized
            ? ''
            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-[#1F293D] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/80'
        }`}
        style={
          isMaximized
            ? {
                backgroundColor: 'var(--color-brand-light-bg)',
                color: 'var(--color-primary-dark)',
                borderColor: 'color-mix(in srgb, var(--color-brand-primary) 30%, transparent)',
              }
            : undefined
        }
        title={isMaximized ? 'استعادة حجم النافذة' : 'تكبير النافذة لملء الشاشة'}
        aria-label={isMaximized ? 'استعادة حجم النافذة' : 'تكبير النافذة'}
      >
        {isMaximized ? (
          <Copy className="w-3.5 h-3.5 rotate-180" />
        ) : (
          <Square className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Close Window Button */}
      <button
        onClick={() => api.window.close()}
        type="button"
        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-[#1F293D] bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white hover:bg-rose-600 hover:border-rose-600 dark:hover:bg-rose-600 dark:hover:border-rose-600 transition-all cursor-pointer"
        title="إغلاق البرنامج"
        aria-label="إغلاق البرنامج"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
