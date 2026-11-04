import React from 'react';
import { Wifi, ShieldCheck, CheckCircle2, Activity, Server, AlertCircle } from 'lucide-react';
import { OpenWASessionDetails } from '../types/openwa.types';
import { ChannelProviderType } from '../../../../shared/types';

interface ChannelsKpisProps {
  session?: OpenWASessionDetails;
  activeProvider?: ChannelProviderType;
  processedCount?: number;
  wbaid?: string;
  phoneNumberId?: string;
}

export const ChannelsKpis: React.FC<ChannelsKpisProps> = ({
  session,
  activeProvider = 'openwa_gateway',
  processedCount = 0,
  wbaid = '',
  phoneNumberId = ''
}) => {
  const isConnected = session?.status === 'CONNECTED' || session?.status === 'WORKING';
  const isQrReady = session?.status === 'QR_READY' || session?.status === 'SCAN_QR';
  const hasPhone = Boolean(session?.phone);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: OpenWA Gateway & Server Health */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              حالة بوابة OpenWA (Port 2785)
            </span>
            <span className={`text-xl font-extrabold mt-1 ${isConnected ? 'text-[#128C7E]' : isQrReady ? 'text-amber-500' : 'text-slate-600 dark:text-slate-400'}`}>
              {isConnected ? 'نشطة ومتصلة' : isQrReady ? 'بانتظار مسح الرمز' : 'غير متصلة'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
            <Wifi className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2 border border-slate-100 dark:border-[#1F293D]">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span>بوابة محلية (127.0.0.1)</span>
          </div>
          <span className="font-mono tabular-nums text-xs font-bold text-slate-700 dark:text-slate-300">
            {session?.latencyMs ? `${session.latencyMs}ms` : '--'}
          </span>
        </div>
      </div>

      {/* Card 2: Connected WhatsApp Number */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              رقم المتجر المقترن
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono" dir="ltr">
                {hasPhone ? `+${session?.phone}` : 'لم يتم ربط رقم بعد'}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2 border border-slate-100 dark:border-[#1F293D]">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {hasPhone ? 'Multi-Device QR' : 'امسح رمز QR للاقتران'}
          </span>
          <span className={`text-xs font-bold flex items-center gap-1 ${isConnected ? 'text-[#128C7E]' : 'text-slate-400'}`}>
            {isConnected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#128C7E]" />
                متصل وجاهز
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                غير مقترن
              </>
            )}
          </span>
        </div>
      </div>

      {/* Card 3: Daily Messages & Safe Limits */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              نشاط الرسائل اليومي
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                {processedCount}
              </span>
              <span className="text-xs font-mono tabular-nums text-slate-400">/ 200 رسالة (حد الأمان)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#128C7E] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(processedCount > 0 ? (processedCount / 200) * 100 : 2, 2))}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-bold">بروتوكول مكافحة الحظر</span>
            <span className="text-[#128C7E] font-bold font-mono tabular-nums">
              متبقي {Math.max(0, 200 - processedCount)} اليوم
            </span>
          </div>
        </div>
      </div>

      {/* Card 4: Local Webhook Listener & Routing */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              خادم الويب هوك المحلي
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                Port 3005
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">استماع لحظي</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2 border border-slate-100 dark:border-[#1F293D]">
          <span className="text-slate-500 dark:text-slate-400 text-xs">تكلفة الرسائل:</span>
          <span className="text-[#128C7E] font-bold font-mono tabular-nums">0$ مجاني (OpenWA)</span>
        </div>
      </div>
    </div>
  );
};
