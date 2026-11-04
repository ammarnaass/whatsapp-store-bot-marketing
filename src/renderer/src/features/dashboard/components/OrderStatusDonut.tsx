import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useDataStore } from '../../data-management';

export const OrderStatusDonut: React.FC = () => {
  const orders = useDataStore((state) => state.orders);
  const isMockDataActive = useDataStore((state) => state.isMockDataActive);

  const hasOrders = orders.length > 0;

  return (
    <div className="wasell-card p-5 space-y-4 flex flex-col justify-between">
      <div>
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-blue-500" />
          توزيع الطلبات حسب الحالة
        </h3>
        <p className="text-xs text-slate-400">تصنيف الطلبات النشطة في النظام</p>
      </div>

      <div className="flex items-center justify-center py-2">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="3.8" />
            {hasOrders && isMockDataActive && (
              <>
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#128C7E" strokeWidth="3.8" strokeDasharray="50 50" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3B82F6" strokeWidth="3.8" strokeDasharray="30 70" strokeDashoffset="-50" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F59E0B" strokeWidth="3.8" strokeDasharray="20 80" strokeDashoffset="-80" />
              </>
            )}
          </svg>
          <div className="absolute text-center">
            <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
              {hasOrders ? (isMockDataActive ? '100%' : `${orders.length}`) : '0'}
            </span>
            <span className="block text-[11px] font-medium text-slate-400">{hasOrders && isMockDataActive ? 'الطلبات' : 'طلب'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#128C7E]" />
            مكتمل ومسلّم
          </span>
          <span className="font-mono font-bold">{hasOrders && isMockDataActive ? '50%' : '0'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            قيد التجهيز والشحن
          </span>
          <span className="font-mono font-bold">{hasOrders && isMockDataActive ? '30%' : '0'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            جديد بانتظار التأكيد
          </span>
          <span className="font-mono font-bold">{hasOrders && isMockDataActive ? '20%' : '0'}</span>
        </div>
      </div>
    </div>
  );
};
