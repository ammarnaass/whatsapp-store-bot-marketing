import { SessionStatus, ChannelProviderType } from '../../../../shared/types';

export type OpenWASessionState = SessionStatus;
export type ActiveChannelProvider = ChannelProviderType;

export interface OpenWASessionDetails {
  sessionId: string;
  name: string;
  status: OpenWASessionState;
  phone?: string;
  qrCode?: string;
  uptimeSeconds?: number;
  latencyMs?: number;
  isBusiness?: boolean;
  platform?: string;
  lastSyncAt?: string;
}

export interface OpenWAConfig {
  host: string;
  port: number;
  apiKey: string;
  sessionId: string;
  webhookUrl: string;
  autoReconnect: boolean;
  heartbeatSec: number;
}

export interface ChannelRoutingRule {
  activeProvider: ActiveChannelProvider;
  broadcastProvider: 'meta_cloud' | 'openwa_gateway';
  conversationalAgentProvider: 'openwa_gateway' | 'meta_cloud';
  autoFailover: boolean;
}
