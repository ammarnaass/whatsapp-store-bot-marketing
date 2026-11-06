import { useState, useEffect, useCallback } from 'react';
import { TelegramConfig, TelegramStatusResult, TelegramBotInfo } from '../types/telegram.types';
import { telegramService } from '../services/telegram.service';

export function useTelegramBot(onToast?: (msg: string) => void) {
  const [config, setConfig] = useState<TelegramConfig | null>(null);
  const [status, setStatus] = useState<TelegramStatusResult>({ isConnected: false, isPolling: false });
  const [botToken, setBotToken] = useState<string>('');
  const [autoReply, setAutoReply] = useState<boolean>(true);
  const [showCatalog, setShowCatalog] = useState<boolean>(true);
  const [catalogLimit, setCatalogLimit] = useState<number>(8);
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('all');
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [showQuickButtons, setShowQuickButtons] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testInfo, setTestInfo] = useState<TelegramBotInfo | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cfg, stat] = await Promise.all([telegramService.getConfig(), telegramService.getStatus()]);
      if (cfg) {
        setConfig(cfg);
        setBotToken(cfg.bot_token || '');
        setAutoReply(cfg.auto_reply !== false);
        setShowCatalog(cfg.show_catalog !== false);
        setCatalogLimit(cfg.catalog_limit || 8);
        setCatalogCategoryFilter(cfg.catalog_category_filter || 'all');
        setWelcomeMessage(cfg.welcome_message || '');
        setShowQuickButtons(cfg.show_quick_buttons !== false);
      }
      setStatus(stat);
      if (stat.botInfo) setTestInfo(stat.botInfo);
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleTestToken = async () => {
    if (!botToken.trim()) return onToast?.('يرجى إدخال رمز البوت (Bot Token)');
    setIsTesting(true);
    try {
      const res = await telegramService.testToken(botToken.trim());
      if (res.success && res.botInfo) {
        setTestInfo(res.botInfo);
        onToast?.(`تم التحقق بنجاح من البوت: @${res.botInfo.username || res.botInfo.first_name}`);
      } else onToast?.(res.error || 'رمز البوت غير صالح');
    } finally { setIsTesting(false); }
  };

  const getPayload = (active?: boolean): Partial<TelegramConfig> => ({
    bot_token: botToken.trim() || undefined,
    auto_reply: autoReply,
    is_active: active ?? Boolean(config?.is_active),
    show_catalog: showCatalog,
    catalog_limit: Number(catalogLimit) || 8,
    catalog_category_filter: catalogCategoryFilter,
    welcome_message: welcomeMessage.trim() || undefined,
    show_quick_buttons: showQuickButtons,
  });

  const handleSaveToken = async () => {
    setIsLoading(true);
    try {
      await telegramService.saveConfig(getPayload());
      onToast?.('تم حفظ إعدادات ورمز البوت بنجاح');
      await loadData();
    } finally { setIsLoading(false); }
  };

  const handleDeleteToken = async () => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف رمز البوت؟ سيتم إيقاف اتصال البوت ومسح الرمز تماماً.')) return;
    setIsLoading(true);
    try {
      await telegramService.deleteToken();
      setBotToken('');
      setTestInfo(null);
      onToast?.('تم حذف رمز البوت وإيقاف البوابة بنجاح');
      await loadData();
    } finally { setIsLoading(false); }
  };

  const handleSaveAndToggle = async (active: boolean) => {
    setIsLoading(true);
    try {
      await telegramService.saveConfig(getPayload(active));
      if (active) {
        const res = await telegramService.start(botToken.trim());
        onToast?.(res.success ? 'تم تشغيل بوابة تليغرام والاستقصاء بنجاح!' : (res.error || 'فشل تشغيل البوت'));
      } else {
        await telegramService.stop();
        onToast?.('تم إيقاف تشغيل بوت تليغرام');
      }
      await loadData();
    } finally { setIsLoading(false); }
  };

  return {
    config, status, botToken, setBotToken, autoReply, setAutoReply,
    showCatalog, setShowCatalog, catalogLimit, setCatalogLimit,
    catalogCategoryFilter, setCatalogCategoryFilter, welcomeMessage, setWelcomeMessage,
    showQuickButtons, setShowQuickButtons, isLoading, isTesting, testInfo,
    refresh: loadData, testToken: handleTestToken, saveToken: handleSaveToken,
    deleteToken: handleDeleteToken, saveAndToggle: handleSaveAndToggle,
    sendMessage: telegramService.sendMessage,
  };
}
