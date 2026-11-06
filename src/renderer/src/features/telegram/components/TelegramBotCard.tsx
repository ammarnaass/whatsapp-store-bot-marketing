import React, { useState } from 'react';
import { Send, Key, Eye, EyeOff, ExternalLink, Bot, Check, Zap, MessageSquare, Save, Trash2 } from 'lucide-react';
import { useTelegramBot } from '../hooks/useTelegramBot';
import { TelegramStatusBadge } from './TelegramStatusBadge';
import { TelegramTestMessageModal } from './TelegramTestMessageModal';
import { TelegramBotCatalogSettings } from './TelegramBotCatalogSettings';
import { BOTFATHER_URL } from '../constants/telegram.constants';

export const TelegramBotCard: React.FC<{ onToast?: (msg: string) => void }> = ({ onToast }) => {
  const {
    status, botToken, setBotToken, autoReply, setAutoReply,
    showCatalog, setShowCatalog, catalogLimit, setCatalogLimit,
    catalogCategoryFilter, setCatalogCategoryFilter, welcomeMessage, setWelcomeMessage,
    showQuickButtons, setShowQuickButtons, isLoading, isTesting, testInfo,
    testToken, saveToken, deleteToken, saveAndToggle, sendMessage,
  } = useTelegramBot(onToast);

  const [showToken, setShowToken] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const isOnline = status.isConnected && status.isPolling;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0088cc] flex items-center justify-center">
            <Send className="w-5 h-5 -rotate-45 ml-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">بوابة بوت تليغرام (Telegram Gateway)</h2>
              <TelegramStatusBadge status={status} size="sm" />
            </div>
            <p className="text-xs text-slate-500">ربط المتجر ووكيل الذكاء الاصطناعي مع تليغرام باستقصاء مباشر</p>
          </div>
        </div>
        <a href={BOTFATHER_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40">
          <span>إنشاء بوت عبر @BotFather</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">رمز واجهة البوت (Bot API Token) *</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Key className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
            <input
              type={showToken ? 'text' : 'password'} value={botToken} onChange={(e) => setBotToken(e.target.value)}
              placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ..."
              className="w-full h-9 pr-9 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-mono"
            />
            <button type="button" onClick={() => setShowToken(!showToken)} className="absolute left-3 top-2.5 text-slate-400">
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button type="button" disabled={isTesting || !botToken} onClick={testToken} className="h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs shrink-0 disabled:opacity-50">
            {isTesting ? 'فحص...' : 'فحص'}
          </button>
          <button type="button" disabled={isLoading} onClick={saveToken} className="h-9 px-3 rounded-xl bg-blue-50 text-[#0088cc] dark:bg-blue-950 dark:text-blue-400 font-bold text-xs flex items-center gap-1 shrink-0">
            <Save className="w-3.5 h-3.5" /> حفظ الرمز
          </button>
          <button type="button" disabled={isLoading || !botToken} onClick={deleteToken} className="h-9 px-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 font-bold text-xs flex items-center gap-1 shrink-0 disabled:opacity-40">
            <Trash2 className="w-3.5 h-3.5" /> حذف الرمز
          </button>
        </div>
      </div>

      {testInfo && (
        <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#0088cc]" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{testInfo.first_name}</span>
            <span className="text-[#0088cc] font-mono">@{testInfo.username}</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
            <Check className="w-3 h-3" /> تم التحقق
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between">
          <div><p className="text-xs font-bold">الاستقبال والاستقصاء الفوري</p><p className="text-[11px] text-slate-400">Long Polling مباشر</p></div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isOnline} disabled={isLoading || !botToken} onChange={(e) => saveAndToggle(e.target.checked)} className="sr-only peer" />
            <div className="w-9 h-5 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0088cc]"></div>
          </label>
        </div>
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between">
          <div><p className="text-xs font-bold flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-purple-600" /> رد الوكيل الذكي</p><p className="text-[11px] text-slate-400">إجابة العملاء وإتمام الطلبات</p></div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={autoReply} onChange={(e) => setAutoReply(e.target.checked)} className="sr-only peer" />
            <div className="w-9 h-5 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      <TelegramBotCatalogSettings
        showCatalog={showCatalog} setShowCatalog={setShowCatalog}
        catalogLimit={catalogLimit} setCatalogLimit={setCatalogLimit}
        catalogCategoryFilter={catalogCategoryFilter} setCatalogCategoryFilter={setCatalogCategoryFilter}
        welcomeMessage={welcomeMessage} setWelcomeMessage={setWelcomeMessage}
        showQuickButtons={showQuickButtons} setShowQuickButtons={setShowQuickButtons}
      />

      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
        <button type="button" onClick={() => setIsTestModalOpen(true)} disabled={!isOnline} className="h-8 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40">
          <MessageSquare className="w-3.5 h-3.5 text-[#0088cc]" /> رسالة تجريبية
        </button>
        <span className="text-[11px] text-slate-400 font-sans">{status.lastSyncAt ? `آخر مزامنة: ${new Date(status.lastSyncAt).toLocaleTimeString('ar-SA')}` : 'غير متزامن'}</span>
      </div>
      <TelegramTestMessageModal isOpen={isTestModalOpen} botUsername={testInfo?.username} onClose={() => setIsTestModalOpen(false)} onSend={(opts) => sendMessage(opts)} />
    </div>
  );
};
