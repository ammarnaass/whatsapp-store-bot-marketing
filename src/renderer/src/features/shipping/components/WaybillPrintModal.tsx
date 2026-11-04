import React from 'react';
import { X, Printer, PackageCheck } from 'lucide-react';
import { Shipment } from '../types/shipping.types';

interface WaybillPrintModalProps {
  shipment: Shipment | null;
  onClose: () => void;
}

export const WaybillPrintModal: React.FC<WaybillPrintModalProps> = ({ shipment, onClose }) => {
  if (!shipment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">معاينة بوليصة الشحن (Air Waybill)</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area */}
        <div id="waybill-content" className="p-5 text-xs text-slate-800 dark:text-slate-200 space-y-4 bg-white dark:bg-slate-950">
          <div className="flex items-center justify-between border-b-2 border-slate-900 dark:border-slate-100 pb-3">
            <div>
              <div className="text-base font-black tracking-wide text-slate-900 dark:text-white">WASIL LOGISTICS</div>
              <div className="text-[11px] text-slate-500 font-medium">بوليصة شحن قياسية موحدة</div>
            </div>
            <div className="text-left font-mono font-bold text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded">
              {shipment.carrier}
            </div>
          </div>

          {/* Barcode visual */}
          <div className="text-center py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="font-mono tracking-[0.4em] text-lg font-black">{shipment.tracking_no}</div>
            <div className="flex justify-center items-center gap-0.5 h-10 mt-1 opacity-80">
              {Array.from({ length: 42 }).map((_, i) => (
                <span
                  key={i}
                  className="bg-slate-900 dark:bg-slate-100 h-full inline-block"
                  style={{ width: (i % 3 === 0 || i % 7 === 0) ? '3px' : '1.5px', margin: '0 1px' }}
                />
              ))}
            </div>
          </div>

          {/* Shipper & Consignee */}
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">الراسل (Shipper):</span>
              <div>متجر واتساب الذكي - المستودع الرئيسي</div>
              <div className="text-slate-500">الرياض، المملكة العربية السعودية</div>
              <div className="text-slate-500 dir-ltr text-right">0500000000</div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">المستلم (Consignee):</span>
              <div className="font-semibold text-slate-900 dark:text-white">{shipment.customer_name || 'العميل'}</div>
              <div>{shipment.address?.city || 'المملكة'} {shipment.address?.district ? `- ${shipment.address.district}` : ''}</div>
              <div className="text-slate-500 dir-ltr text-right">{shipment.customer_phone || '-'}</div>
            </div>
          </div>

          {/* Order Details & Summary */}
          <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px]">
            <div>
              <span className="text-slate-400">رقم الطلب:</span>{' '}
              <span className="font-bold font-mono">#{shipment.order_number || shipment.order_id}</span>
            </div>
            <div>
              <span className="text-slate-400">طريقة الدفع:</span>{' '}
              <span className="font-bold text-cyan-600 dark:text-cyan-400">{shipment.payment_method || 'مدفوع إلكترونياً'}</span>
            </div>
            <div>
              <span className="text-slate-400">الإجمالي:</span>{' '}
              <span className="font-bold">{shipment.total ? `${shipment.total} ر.س` : '0 ر.س'}</span>
            </div>
          </div>
        </div>

        {/* Modal footer actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />
            بوليصة صالحة للاستلام من مناديب التوصيل
          </span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              إغلاق
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold rounded-xl text-white bg-cyan-600 hover:bg-cyan-500 shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة البوليصة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

