import { TelegramConfig, TelegramBotInfo, TelegramStatusResult, TelegramSendOptions } from '../../../../shared/types';

export type { TelegramConfig, TelegramBotInfo, TelegramStatusResult, TelegramSendOptions };

export interface TelegramBotFormState {
  bot_token: string;
  auto_reply: boolean;
  is_active: boolean;
}

export interface TelegramTestState {
  isTesting: boolean;
  error?: string | null;
  botInfo?: TelegramBotInfo | null;
}
