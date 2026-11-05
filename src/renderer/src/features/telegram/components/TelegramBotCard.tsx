import React, { useState } from 'react';
import { Send, Key, Eye, EyeOff, ExternalLink, Bot, Check, Zap, MessageSquare } from 'lucide-react';
import { useTelegramBot } from '../hooks/useTelegramBot';
import { TelegramStatusBadge } from './TelegramStatusBadge';
import { TelegramTestMessageModal } from './TelegramTestMessageModal';
import { BOTFATHER_URL } from '../constants/telegram.constants';

export const TelegramBotCard: React.FC<{ onToast?: (msg: string) => void }> = ({ onToast }) => {
  const {
    status, botToken, setBotToken, autoReply, setAutoReply,
    isLoading, isTesting, testInfo, testToken, saveAndToggle, sendMessage,
  } = useTelegramBot(onToast);

  const [showToken, setShowToken] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const isOnline = status.isConnected && status.isPolling;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0088cc] flex items-center justify-center shadow-xs">
            <Send className="w-5 h-5 -rotate-45 ml-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">بوابة بوت تليغرام (Telegram Bot Gateway)</h2>
              <TelegramStatusBadge status={status} size="sm" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">ربط المتجر ووكيل الذكاء الاصطناعي مع تليغرام باستقصاء مباشر دون خوادم وسيطة</p>
          </div>
        </div>
        <a href={BOTFATHER_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors self-start sm:self-auto">
          <span>إنشاء بوت عبر @BotFather</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Token Input Section */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">رمز واجهة البوت (Bot API Token) *</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Key className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
            <input
              type={showToken ? 'text' : 'password'}
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ..."
              className="w-full h-9 pr-9 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0088cc]"
            />
            <button type="button" onClick={() => setShowToken(!showToken)} className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600">
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button type="button" disabled={isTesting || !botToken} onClick={testToken} className="h-9 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors shrink-0 disabled:opacity-50">
            {isTesting ? 'جارٍ الفحص...' : 'فحص التوكن'}
          </button>
        </div>
      </div>

      {/* Bot Info Banner if available */}
      {testInfo && (
        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0088cc] text-white flex items-center justify-center font-bold"><Bot className="w-4 h-4" /></div>
            <div>
              <p className="font-extrabold text-slate-900 dark:text-white">{testInfo.first_name}</p>
              <p className="text-[11px] text-[#0088cc] font-mono">@{testInfo.username}</p>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" /> تم التحقق
          </span>
        </div>
      )}

      {/* Controls & Switches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">الاستقبال والاستقصاء الفوري</p>
            <p className="text-[11px] text-slate-400">سحب رسائل العملاء لحظياً عبر Long Polling</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isOnline} disabled={isLoading || !botToken} onChange={(e) => saveAndToggle(e.target.checked)} className="sr-only peer" />
            <div className="w-9 h-5 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0088cc]"></div>
          </label>
        </div>

        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              <span>الرد الآلي بوكيل الذكاء الاصطناعي</span>
            </p>
            <p className="text-[11px] text-slate-400">عرض الكتالوج وإتمام الطلبات تلقائياً بتليغرام</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={autoReply} onChange={(e) => setAutoReply(e.target.checked)} className="sr-only peer" />
            <div className="w-9 h-5 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setIsTestModalOpen(true)}
          disabled={!isOnline}
          className="h-8 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-40"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#0088cc]" />
          <span>إرسال رسالة تجريبية</span>
        </button>

        <span className="text-[11px] text-slate-400 font-sans">
          {status.lastSyncAt ? `آخر مزامنة: ${new Date(status.lastSyncAt).toLocaleTimeString('ar-SA')}` : 'لم تبدأ المزامنة بعد'}
        </span>
      </div>

      <TelegramTestMessageModal
        isOpen={isTestModalOpen}
        botUsername={testInfo?.username}
        onClose={() => setIsTestModalOpen(false)}
        onSend={(opts) => sendMessage(opts)}
      />
    </div>
  );
};
