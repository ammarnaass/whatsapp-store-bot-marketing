import React from 'react';
import { CustomerDetailProfile } from '../../types/customer-detail.types';

interface CustomerIdentityCardProps {
  profile: CustomerDetailProfile;
  isAi: boolean;
}

export const CustomerIdentityCard: React.FC<CustomerIdentityCardProps> = ({
  profile,
  isAi,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const initial = profile.name ? profile.name.slice(0, 1) : 'U';

  React.useEffect(() => {
    setImgError(false);
  }, [profile.avatar]);

  return (
    <div className="flex flex-col items-center text-center p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/60">
      <div className="relative mb-2">
        {profile.avatar && !imgError ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#128C7E]/30"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center font-bold text-xl ring-2 ring-[#128C7E]/30">
            {initial}
          </div>
        )}

        {profile.isVip && (
          <span className="absolute bottom-0 right-0 bg-[#075E54] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
            VIP
          </span>
        )}
      </div>

      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate max-w-full">
        {profile.name}
      </h4>

      <span className="text-xs text-slate-400 font-medium font-mono dir-ltr mt-0.5">
        +{profile.phone}
      </span>

      <div className="grid grid-cols-2 gap-2 w-full mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center elevation-1">
          <span className="text-[10px] text-slate-400 block font-bold">نمط الرد</span>
          <span className="text-xs font-black text-slate-900 dark:text-white">
            {isAi ? 'رد آلي AI' : 'تحكم بشري'}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center elevation-1">
          <span className="text-[10px] text-slate-400 block font-bold">القناة</span>
          <span className="text-xs font-black text-[#128C7E]">واتساب مباشر</span>
        </div>
      </div>
    </div>
  );
};

