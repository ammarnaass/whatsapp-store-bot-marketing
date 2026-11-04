import React from 'react';
import {
  Smartphone,
  QrCode,
  RefreshCw,
  Power,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Server,
  FileCode2,
  Lock,
  Globe,
} from 'lucide-react';
import { OpenWASessionDetails } from '../types/openwa.types';

interface OpenWACardProps {
  session: OpenWASessionDetails;
  isStarting: boolean;
  isPinging: boolean;
  onOpenQrModal: () => void;
  onPing: () => void;
  onLogout: () => void;
}

export const OpenWACard: React.FC<OpenWACardProps> = ({
  session,
  isStarting,
  isPinging,
  onOpenQrModal,
  onPing,
  onLogout,
}) => {
  const isConnected = session.status === 'CONNECTED' || session.status === 'WORKING';
  const isQrReady = session.status === 'QR_READY' || session.status === 'SCAN_QR';
  const swaggerDocsUrl = 'http://localhost:2785/api/docs#/';

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-[#1F293D] rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
      {/* 1. Header & Gateway Status */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#128C7E]/15 to-[#128C7E]/5 text-[#128C7E] dark:bg-[#128C7E]/20 shrink-0 shadow-xs">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  بوابة OpenWA المفتوحة (Multi-Device QR & REST)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Port 2785
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Baileys Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span>محرك خفيف مستقل بدون متصفح ثقيل</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <a
                  href={swaggerDocsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#128C7E] dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-bold"
                  title="فتح وثائق Swagger المباشرة في المتصفح"
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>وثائق Swagger API (163 مسار)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          {/* Connection Status Badge */}
          <div className="self-start sm:self-auto">
            {isConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                متصل ونشط
              </span>
            ) : isQrReady ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <QrCode className="w-3.5 h-3.5" />
                بانتظار مسح الرمز
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                <AlertCircle className="w-3.5 h-3.5" />
                غير متصل
              </span>
            )}
          </div>
        </div>

        {/* 2. Credentials & Live Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {/* Phone */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              رقم الهاتف المقترن:
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono" dir="ltr">
                {session.phone ? `+${session.phone}` : 'لم يتم اقتران رقم بعد'}
              </span>
              {isConnected && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
            </div>
          </div>

          {/* Session ID */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              معرف الجلسة (Session ID):
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono truncate" title={session.sessionId}>
              {session.sessionId}
            </span>
          </div>

          {/* Swagger Endpoint Link */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              توثيق Swagger API:
            </span>
            <a
              href={swaggerDocsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#128C7E] dark:text-emerald-400 hover:underline flex items-center gap-1.5 truncate"
              title="انقر لفتح Swagger UI على localhost:2785"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate" dir="ltr">:2785/api/docs#/</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>

          {/* Latency */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              سرعة الاستجابة (Ping):
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Activity className="w-3.5 h-3.5" />
              <span>{session.latencyMs ? `${session.latencyMs} ms` : 'بوابة متصلة (2785)'}</span>
            </div>
          </div>
        </div>

        {/* 3. Session Warning & Anti-ban protocol banner */}
        {!isConnected && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 mb-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-semibold">
              تنبيه الجلسة (FR-79): رقم المتجر غير مقترن حالياً أو بانتظار مسح الرمز. انقر أدناه لمسح QR وتفعيل الردود.
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 mb-6 text-xs text-slate-600 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-[#128C7E] shrink-0" />
          <span>
            بروتوكول تفادي الحظر الذكي نشط (FR-78): تجميع الرسائل (Debounce 3.5s) ومحاكاة الكتابة البشرية والتدفئة التلقائية مفعلة.
          </span>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-4 border-t border-slate-200/60 dark:border-[#1F293D]">
        <button
          type="button"
          onClick={onOpenQrModal}
          disabled={isStarting}
          className="h-[38px] px-4 rounded-xl text-xs font-bold bg-[#128C7E] text-white hover:bg-[#0e7064] transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <QrCode className="w-4 h-4" />
          <span>{isConnected ? 'إعادة مسح رمز الـ QR' : 'مسح رمز QR لربط الرقم'}</span>
        </button>

        <button
          type="button"
          onClick={onPing}
          disabled={isPinging}
          className="h-[38px] px-3.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          <span>فحص صحة البوابة</span>
        </button>

        {/* Direct Link to Swagger API Docs */}
        <a
          href={swaggerDocsUrl}
          target="_blank"
          rel="noreferrer"
          className="h-[38px] px-3.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-[#128C7E] dark:text-emerald-400 hover:bg-[#128C7E]/10 dark:hover:bg-[#128C7E]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>فتح وثائق Swagger (Port 2785)</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        {isConnected && (
          <button
            type="button"
            onClick={onLogout}
            className="h-[38px] px-3.5 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all flex items-center gap-2 cursor-pointer mr-auto"
          >
            <Power className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        )}
      </div>
    </div>
  );
};
