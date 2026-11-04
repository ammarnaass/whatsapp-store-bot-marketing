import { ChannelProviderType, SessionStatus } from '../../shared/types';

export interface SendMessageOptions {
  to: string; // E.164 formatted number or with @c.us
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'document' | 'audio' | 'video';
  caption?: string;
}

export interface ChannelStatusResult {
  status: SessionStatus;
  isConnected: boolean;
  statusText: string;
  phone?: string;
  latencyMs?: number;
  uptimeSeconds?: number;
  provider: ChannelProviderType;
}

export interface IWhatsAppChannelProvider {
  id: ChannelProviderType;
  name: string;
  getStatus(): Promise<ChannelStatusResult>;
  sendMessage(options: SendMessageOptions): Promise<{ success: boolean; messageId: string; error?: string }>;
  setTypingIndicator(to: string, isTyping: boolean): Promise<void>;
  disconnect(): Promise<boolean>;
}
