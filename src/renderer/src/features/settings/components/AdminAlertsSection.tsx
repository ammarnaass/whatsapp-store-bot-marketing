import React from 'react';
import {
  Bell,
  Star,
  AlertTriangle,
  FileText,
  Send,
  Smartphone
} from 'lucide-react';
import { AdminAlertSettings } from '../types/settings.types';

interface AdminAlertsSectionProps {
  alerts: AdminAlertSettings;
  onChange: (updated: AdminAlertSettings) => void;
  onSendTestAlert: () => void;
  isSendingAlert: boolean;
}

export const AdminAlertsSection: React.FC<AdminAlertsSectionProps> = ({
  alerts,
  onChange,
  onSendTestAlert,
  isSendingAlert
}) => {
  const toggleAlert = (key: keyof Omit<AdminAlertSettings, 'adminWhatsAppNumber'>) => {
    onChange({ ...alerts, [key]: !alerts[key] });
  };

  const updateNumber = (num: string) => {
    onChange({ ...alerts, adminWhatsAppNumber: num });
  };

  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-[#1F293D]/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                إشعارات النظام وتنبيهات الإدارة
              </h2>
              <p className="text-xs text-slate-400">
                قنوات الإشعار الفوري لمدير المتجر عبر الواتساب
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
            3 تنبيهات حيوية
          </span>
        </div>

        {/* Alerts List */}
        <div className="space-y-3 mb-5">
          {/* Alert 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
            <div className="flex items-center gap-3 max-w-[80%]">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  تنبيه بالطلبات عالية القيمة (VIP Orders)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  إشعار فوري لمدير المبيعات عند تسجيل طلب يتجاوز 1,000 ر.س.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={alerts.vipOrdersAlert}
              onChange={() => toggleAlert('vipOrdersAlert')}
              className="w-5 h-5 accent-[#128C7E] rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Alert 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
            <div className="flex items-center gap-3 max-w-[80%]">
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    إنذار التحويل للتدخل البشري الفوري
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold">
                    عاجل
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  إشعار صوتي وفوري عند استشعار انزعاج العميل أو طلبه موظف بشري.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={alerts.humanEscalationAlert}
              onChange={() => toggleAlert('humanEscalationAlert')}
              className="w-5 h-5 accent-[#128C7E] rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Alert 3 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
            <div className="flex items-center gap-3 max-w-[80%]">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  تقرير المبيعات الصباحي اليومي
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ملخص الأرقام والأرباح ونسبة إغلاق الذكاء الاصطناعي كل صباح (08:00 ص).
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={alerts.morningDigestAlert}
              onChange={() => toggleAlert('morningDigestAlert')}
              className="w-5 h-5 accent-[#128C7E] rounded cursor-pointer shrink-0"
            />
          </div>
        </div>

        {/* WhatsApp Management Receiver Box */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] rounded-xl space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            رقم واتساب الإدارة المستلم للتنبيهات الفورية
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="tel"
                value={alerts.adminWhatsAppNumber}
                onChange={(e) => updateNumber(e.target.value)}
                dir="ltr"
                className="w-full py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white font-mono text-left focus:outline-none focus:ring-2 focus:ring-[#128C7E]/20"
              />
            </div>
            <button
              type="button"
              onClick={onSendTestAlert}
              disabled={isSendingAlert}
              className="px-3.5 py-2 rounded-lg bg-[#128C7E] text-white text-xs font-bold hover:bg-[#075E54] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isSendingAlert ? 'animate-bounce' : ''}`} />
              <span>{isSendingAlert ? 'جارٍ الإرسال...' : 'إرسال اختبار'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
