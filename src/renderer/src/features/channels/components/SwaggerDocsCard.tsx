import React, { useState } from 'react';
import {
  FileCode2,
  ExternalLink,
  Activity,
  CheckCircle2,
  Play,
  Key,
  Shield,
  Layers,
  Copy,
  Check,
} from 'lucide-react';

export const SwaggerDocsCard: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');
  const [latency, setLatency] = useState<number | null>(null);

  const swaggerUrl = 'http://localhost:2785/api/docs#/';
  const openwaApiKey = 'owa_k1_ae432e36acd4d1f24bccbd03e0e132606b163780f12985b96c724d3f3a97bcf9';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(openwaApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCheckHealth = async () => {
    setIsCheckingHealth(true);
    const start = Date.now();
    try {
      if ((window as any).api?.session?.getStatus) {
        await (window as any).api.session.getStatus();
        setLatency(Math.max(Date.now() - start, 18));
        setHealthStatus('online');
      } else {
        const res = await fetch('http://localhost:2785/api/health', {
          headers: { 'X-API-Key': openwaApiKey },
        });
        if (res.ok) {
          setLatency(Math.max(Date.now() - start, 18));
          setHealthStatus('online');
        } else {
          setHealthStatus('offline');
        }
      }
    } catch {
      setHealthStatus('offline');
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const endpointCategories = [
    {
      category: 'إدارة الجلسات والاقتران (Sessions & Pairing)',
      color: 'emerald',
      endpoints: [
        { method: 'GET', path: '/api/sessions', desc: 'استعراض كافة الجلسات النشطة وحالاتها' },
        { method: 'POST', path: '/api/sessions', desc: 'إنشاء جلسة جديدة لرقم واتساب' },
        { method: 'POST', path: '/api/sessions/{id}/start', desc: 'بدء الجلسة وتهيئة محرك Baileys' },
        { method: 'GET', path: '/api/sessions/{id}/qr', desc: 'جلب رمز الاستجابة السريعة (QR) بصيغة Base64' },
        { method: 'POST', path: '/api/sessions/{id}/pairing-code', desc: 'توليد كود اقتران رقمي من 8 خانات كبديل للـ QR' },
        { method: 'POST', path: '/api/sessions/{id}/logout', desc: 'فك اقتران الرقم وتسجيل الخروج بأمان' },
      ],
    },
    {
      category: 'إرسال الرسائل والوسائط (Messaging & Media)',
      color: 'teal',
      endpoints: [
        { method: 'POST', path: '/api/sessions/{id}/messages/send-text', desc: 'إرسال رسالة نصية عادية مع محاكاة الكتابة' },
        { method: 'POST', path: '/api/sessions/{id}/messages/send-image', desc: 'إرسال صورة مع تسمية توضيحية (Caption)' },
        { method: 'POST', path: '/api/sessions/{id}/messages/send-product', desc: 'إرسال منتج من كتالوج المتجر مباشرة (Baileys)' },
        { method: 'POST', path: '/api/sessions/{id}/messages/react', desc: 'إضافة تفاعل إيموجي على الرسالة' },
      ],
    },
    {
      category: 'المؤشرات والخطافات (Presence & Webhooks)',
      color: 'blue',
      endpoints: [
        { method: 'POST', path: '/api/sessions/{id}/chats/typing', desc: 'إرسال مؤشر "يكتب الآن..." (Composing / Paused)' },
        { method: 'POST', path: '/api/sessions/{id}/webhooks', desc: 'تسجيل خطاف ويب محلي لاستقبال الرسائل في Electron' },
        { method: 'GET', path: '/api/health', desc: 'فحص جاهزية الخادم وحالته العامة' },
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-[#1F293D] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-[#128C7E]/10 to-transparent border border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#128C7E] text-white shadow-md shadow-[#128C7E]/25">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                توثيق OpenWA Swagger API المباشر
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#128C7E] dark:text-emerald-300">
                Port 2785
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              واجهة Swagger التفاعلية الشاملة تحتوي على 163 مساراً برمجياً للتحكم بجلسات ورسائل واتساب
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCheckHealth}
            disabled={isCheckingHealth}
            className="h-10 px-3.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="فحص استجابة البوابة المحلية /api/health"
          >
            <Activity className={`w-4 h-4 ${isCheckingHealth ? 'animate-spin text-emerald-500' : 'text-[#128C7E]'}`} />
            <span>
              {isCheckingHealth
                ? 'جارٍ الفحص...'
                : latency
                ? `${latency}ms`
                : 'فحص الاتصال (Ping)'}
            </span>
          </button>

          <a
            href={swaggerUrl}
            target="_blank"
            rel="noreferrer"
            className="h-10 px-4 rounded-xl text-xs font-bold bg-[#128C7E] hover:bg-[#0e7064] text-white flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer shrink-0"
          >
            <span>فتح واجهة Swagger التفاعلية</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 2. Authentication & Quick Access Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Swagger URL Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-[#128C7E]" />
              رابط التوثيق المباشر (Swagger UI):
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              healthStatus === 'online'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                : healthStatus === 'offline'
                ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                : 'text-slate-500 bg-slate-100 dark:bg-slate-800'
            }`}>
              {healthStatus === 'online'
                ? `متصل (${latency}ms)`
                : healthStatus === 'offline'
                ? 'غير متصل'
                : 'جاهز للاختبار'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700">
            <code className="text-xs font-mono text-[#128C7E] dark:text-emerald-300 select-all" dir="ltr">
              {swaggerUrl}
            </code>
            <a
              href={swaggerUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#128C7E] hover:underline flex items-center gap-1"
            >
              زيارة <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* API Key Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              مفتاح المصادقة العام (X-API-Key):
            </span>
            <span className="text-[10px] font-semibold text-slate-400">Admin Key</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700">
            <code className="text-[11px] font-mono text-slate-600 dark:text-slate-300 truncate max-w-[240px]" dir="ltr">
              {openwaApiKey}
            </code>
            <button
              onClick={handleCopyKey}
              type="button"
              className="text-xs font-bold text-[#128C7E] hover:text-[#0e7064] flex items-center gap-1 cursor-pointer"
            >
              {copiedKey ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ المفتاح</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Categorized Main Endpoints Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#128C7E]" />
            <span>أهم مسارات API المعتمدة في التكامل (Core Endpoints)</span>
          </h4>
          <span className="text-xs text-slate-400">
            يمكن تجربة أي مسار بالضغط على زر "Try it out" داخل Swagger
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {endpointCategories.map((group, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200/70 dark:border-[#1F293D] bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between space-y-3"
            >
              <h5 className="text-xs font-extrabold text-slate-900 dark:text-white pb-2 border-b border-slate-200/60 dark:border-slate-800">
                {group.category}
              </h5>

              <div className="space-y-2 flex-1">
                {group.endpoints.map((ep, eIdx) => (
                  <div
                    key={eIdx}
                    className="p-2.5 rounded-lg bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded font-mono ${
                          ep.method === 'GET'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : ep.method === 'POST'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <code className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-semibold truncate flex-1 text-left" dir="ltr">
                        {ep.path}
                      </code>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {ep.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

