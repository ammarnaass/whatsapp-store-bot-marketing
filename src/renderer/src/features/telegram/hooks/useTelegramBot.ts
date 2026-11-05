import { useState, useEffect, useCallback } from 'react';
import { TelegramConfig, TelegramStatusResult, TelegramBotInfo } from '../types/telegram.types';
import { telegramService } from '../services/telegram.service';

export function useTelegramBot(onToast?: (msg: string) => void) {
  const [config, setConfig] = useState<TelegramConfig | null>(null);
  const [status, setStatus] = useState<TelegramStatusResult>({ isConnected: false, isPolling: false });
  const [botToken, setBotToken] = useState<string>('');
  const [autoReply, setAutoReply] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testInfo, setTestInfo] = useState<TelegramBotInfo | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cfg, stat] = await Promise.all([
        telegramService.getConfig(),
        telegramService.getStatus(),
      ]);
      if (cfg) {
        setConfig(cfg);
        setBotToken(cfg.bot_token || '');
        setAutoReply(cfg.auto_reply !== false);
      }
      setStatus(stat);
      if (stat.botInfo) setTestInfo(stat.botInfo);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTestToken = async () => {
    if (!botToken.trim()) {
      onToast?.('يرجى إدخال رمز البوت (Bot Token)');
      return;
    }
    setIsTesting(true);
    try {
      const res = await telegramService.testToken(botToken);
      if (res.success && res.botInfo) {
        setTestInfo(res.botInfo);
        onToast?.(`تم التحقق بنجاح من البوت: @${res.botInfo.username || res.botInfo.first_name}`);
      } else {
        onToast?.(res.error || 'رمز البوت غير صالح');
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveAndToggle = async (active: boolean) => {
    setIsLoading(true);
    try {
      await telegramService.saveConfig({
        bot_token: botToken.trim(),
        auto_reply: autoReply,
        is_active: active,
      });
      if (active) {
        const res = await telegramService.start(botToken.trim());
        if (res.success) {
          onToast?.('تم تشغيل بوابة تليغرام والاستقصاء الفوري بنجاح!');
        } else {
          onToast?.(res.error || 'فشل تشغيل البوت');
        }
      } else {
        await telegramService.stop();
        onToast?.('تم إيقاف تشغيل بوت تليغرام');
      }
      await loadData();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    status,
    botToken,
    setBotToken,
    autoReply,
    setAutoReply,
    isLoading,
    isTesting,
    testInfo,
    refresh: loadData,
    testToken: handleTestToken,
    saveAndToggle: handleSaveAndToggle,
    sendMessage: telegramService.sendMessage,
  };
}
