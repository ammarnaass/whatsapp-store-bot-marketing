import { SessionStatus } from '../../shared/types';

export interface SendOpts {
  delayMs?: number;
  idempotencyKey?: string;
  simulateTyping?: boolean;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  error?: string;
}

export interface MediaInput {
  url?: string;
  path?: string;
  type: 'image' | 'document' | 'audio' | 'video';
  caption?: string;
  filename?: string;
}

export type ChannelEventType =
  | 'message.received'
  | 'message.status'
  | 'message.edited'
  | 'session.status'
  | 'session.qr'
  | 'call.received';

export interface ChannelEvent {
  type: ChannelEventType;
  sessionId: string;
  timestamp: string;
  data: any;
}

/**
 * واجهة القناة الموحدة (Channel Gateway Interface)
 * تجرد كافة تفاصيل OpenWA أو Meta Cloud API
 */
export interface WhatsAppChannel {
  startSession(id: string): Promise<void>;
  getQr(id: string): Promise<string>;
  getStatus(id: string): Promise<SessionStatus>;
  sendText(session: string, chatId: string, text: string, opts?: SendOpts): Promise<SendResult>;
  sendMedia(session: string, chatId: string, media: MediaInput, opts?: SendOpts): Promise<SendResult>;
  onEvent(handler: (e: ChannelEvent) => void): void;
}

