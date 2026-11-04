import React from 'react';
import { Printer, ExternalLink, Send, ChevronDown, PackageCheck } from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types/shipping.types';
import { ShipmentStatusBadge } from './ShipmentStatusBadge';

interface ShipmentsTableProps {
  shipments: Shipment[];
  isLoading: boolean;
  onPrintWaybill: (shipment: Shipment) => void;
  onUpdateStatus: (shipmentId: string, status: ShipmentStatus) => void;
  onSendWhatsApp: (phone: string, trackingNo: string, carrier: string) => void;
}

export const ShipmentsTable: React.FC<ShipmentsTableProps> = ({
  shipments,
  isLoading,
  onPrintWaybill,
  onUpdateStatus,
  onSendWhatsApp,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
        <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">جاري تحميل الشحنات والبيانات اللوجستية...</p>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
        <PackageCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">لا توجد شحنات مطابقة</h3>
        <p className="text-xs text-slate-400 mt-1">يمكنك إصدار بوليصة شحن جديدة أو تعديل معايير البحث والفلترة.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-right text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4">رقم البوليصة / الطلب</th>
              <th className="py-3 px-4">العميل</th>
              <th className="py-3 px-4">شركة الشحن</th>
              <th className="py-3 px-4">الوجهة والمدينة</th>
              <th className="py-3 px-4">الحالة</th>
              <th className="py-3 px-4">التاريخ</th>
              <th className="py-3 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {shipments.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-4">
                  <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{s.tracking_no}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">طلب #{s.order_number || s.order_id}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-900 dark:text-white">{s.customer_name || 'عميل متجر'}</div>
                  <div className="text-[11px] text-slate-400 dir-ltr text-right">{s.customer_phone || '-'}</div>
                </td>
                <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{s.carrier}</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                  <div>{s.address?.city || 'الرياض'}</div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{s.address?.district || s.address?.street || 'العنوان المسجل'}</div>
                </td>
                <td className="py-3 px-4">
                  <ShipmentStatusBadge status={s.status} />
                </td>
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                  {s.shipped_at ? new Date(s.shipped_at).toLocaleDateString('ar-SA') : '-'}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onPrintWaybill(s)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
                      title="معاينة وطباعة بوليصة الشحن"
                    >
                      <Printer className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    </button>
                    {s.customer_phone && (
                      <button
                        onClick={() => onSendWhatsApp(s.customer_phone!, s.tracking_no, s.carrier)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 transition"
                        title="إرسال تذكير بالواتساب"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </button>
                    )}
                    <div className="relative group">
                      <select
                        value={s.status}
                        onChange={(e) => onUpdateStatus(s.id, e.target.value as ShipmentStatus)}
                        className="text-[11px] py-1 pl-2 pr-5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 appearance-none cursor-pointer focus:outline-none"
                      >
                        <option value="IN_TRANSIT">في الطريق</option>
                        <option value="OUT_FOR_DELIVERY">مع المندوب</option>
                        <option value="DELIVERED">تم التسليم</option>
                        <option value="RETURNED">مرتجع</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

