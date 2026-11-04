import React from 'react';
import { Camera } from 'lucide-react';

interface StoreLogoBannerProps {
  logoUrl: string;
  onUpdateLogo?: () => void;
}

export const StoreLogoBanner: React.FC<StoreLogoBannerProps> = ({
  logoUrl,
  onUpdateLogo,
}) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] mb-5">
      <div className="relative group shrink-0">
        <img
          src={logoUrl}
          alt="Store Logo"
          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#128C7E]/30 elevation-1"
        />
        <button
          type="button"
          onClick={() => alert('تم فتح نافذة استعراض ملفات الشعار الجديد (PNG/JPG)')}
          className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
          title="تغيير الشعار"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
          شعار العلامة التجارية النشط
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          يظهر للعملاء في بروفايل الواتساب الرسمي، الفواتير التلقائية، وبطاقات المنتجات.
        </p>
      </div>
      <button
        type="button"
        onClick={onUpdateLogo || (() => alert('تم فتح نافذة رفع الشعار'))}
        className="h-[34px] px-3 rounded-xl wasell-btn-secondary elevation-1 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer shrink-0"
      >
        تحديث الشعار
      </button>
    </div>
  );
};

